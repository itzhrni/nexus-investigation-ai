import { filterGraph } from "@/lib/graph";

import {
  CASES_CATALOG,
  continuityAlerts,
  edges,
  entities,
  evidenceBySubject,
  identityMatches,
  INVESTIGATION_ID,
  jurisdictionAlerts,
  nodes,
  normalizeClue,
  summary,
  timeline,
  whatChanged,
} from "@/mock/investigationData";

import type {
  Entity,
  GraphQuery,
  IdentityMatch,
  MatchReviewStatus,
  SearchMatch,
  SearchResponse,
  SearchType,
  AadhaarForensics,
} from "@/types/nexus";

import type { NexusApi } from "@/api/types";

const matchStore: IdentityMatch[] =
  identityMatches.map((m) => ({ ...m }));

function detectType(
  normalized: string,
  raw: string,
): SearchMatch[] {
  const hits: SearchMatch[] = [];

  for (const entity of Object.values(entities)) {
    const hay = [
      entity.id,
      entity.label,
      entity.value,
      entity.accountNumber ?? "",
      entity.bankName ?? "",
      ...(entity.aliases ?? []),
      ...(entity.scripts?.map((s) => s.text) ?? []),
      ...(entity.identifiers?.map((i) => i.value) ?? []),
    ]
      .join(" ")
      .toUpperCase()
      .replace(/[\s-]/g, "");

    const rawHay = [
      entity.label,
      entity.value,
      entity.bankName ?? "",
      ...(entity.aliases ?? []),
      ...(entity.scripts?.map((s) => s.text) ?? []),
    ]
      .join(" ")
      .toLowerCase();

    if (
      hay.includes(normalized) ||
      rawHay.includes(
        raw.trim().toLowerCase(),
      )
    ) {
      hits.push({
        entity,
        score:
          entity.id === "V-TN38AB1234" &&
          normalized.includes("TN38AB1234")
            ? 99
            : 80,
        reason:
          "Identifier, account or name match after normalization",
      });
    }
  }

  return hits.sort(
    (a, b) => b.score - a.score,
  );
}

export const mockAdapter: NexusApi = {
  // ---------------------------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------------------------

  async search(
    query: string,
    type: SearchType,
  ): Promise<SearchResponse> {
    const normalizedQuery =
      normalizeClue(query);

    if (!query.trim()) {
      return {
        query,
        normalizedQuery,
        detectedType: null,
        matches: [],
      };
    }

    let matches = detectType(
      normalizedQuery,
      query,
    );

    if (type !== "auto") {
      matches = matches.filter(
        (m) => m.entity.type === type,
      );
    }

    return {
      query,
      normalizedQuery,
      detectedType:
        matches[0]?.entity.type ?? null,
      matches,
    };
  },

  // ---------------------------------------------------------------------------
  // INVESTIGATION
  // ---------------------------------------------------------------------------

  async getInvestigation(id?: string) {
    if (id && CASES_CATALOG[id]) {
      return CASES_CATALOG[id];
    }

    if (id) {
      for (const c of Object.values(
        CASES_CATALOG,
      )) {
        if (
          c.id === id ||
          c.focalEntityId === id
        ) {
          return c;
        }
      }
    }

    return summary;
  },

  // ---------------------------------------------------------------------------
  // GRAPH
  // ---------------------------------------------------------------------------

  async getGraph(query: GraphQuery) {
    const filtered = filterGraph(
      {
        nodes,
        edges,
        focalId: query.focalId,
      },
      {
        depth: query.depth,
        relGroups: query.relTypes,
        from: query.from,
        to: query.to,
      },
    );

    return {
      nodes: filtered.nodes,
      edges: filtered.edges,
      focalId: query.focalId,
    };
  },

  // ---------------------------------------------------------------------------
  // ENTITY
  // ---------------------------------------------------------------------------

  async getEntity(
    id: string,
  ): Promise<Entity> {
    const entity = entities[id];

    if (!entity) {
      throw new Error(
        `Entity not found: ${id}`,
      );
    }

    return entity;
  },

  async getAadhaarForensics(personId: string): Promise<AadhaarForensics | null> {
    const isCollision =
      personId === "P005" ||
      personId === "P015" ||
      personId === "P011" ||
      personId === "P031" ||
      personId === "P003" ||
      personId === "P018" ||
      personId === "P-SURESH" ||
      personId === "P-VIKRAM";

    const isInvalid =
      personId === "P010" ||
      personId === "P002" ||
      personId === "P004" ||
      personId === "P-RAVI";

    const collidingMap: Record<string, string[]> = {
      P005: ["P015 (Pooja Bhatnagar)"],
      P015: ["P005 (Karan Singh)"],
      P011: ["P031 (Simran Mehta)"],
      P031: ["P011 (Meera Mehta)"],
      P003: ["P018 (Anita Saxena)"],
      P018: ["P003 (Rohan Gupta)"],
      "P-SURESH": ["ACC-005 (Axis Mule Account)"],
      "P-VIKRAM": ["P005 (Karan Singh)"],
    };

    const status = isCollision
      ? "COLLISION_FLAGGED"
      : isInvalid
      ? "VERHOEFF_INVALID"
      : "VERHOEFF_VALID";

    let mask = `XXXX-XXXX-${personId.replace(/\D/g, "").padStart(4, "0") || "0016"}`;
    if (personId === "P005" || personId === "P015") mask = "XXXX-XXXX-9015";
    else if (personId === "P011" || personId === "P031") mask = "XXXX-XXXX-0114";
    else if (personId === "P003" || personId === "P018") mask = "XXXX-XXXX-3018";
    else if (personId === "P-SURESH") mask = "XXXX-XXXX-8448";
    else if (personId === "P-RAVI" || personId === "P010") mask = "XXXX-XXXX-9999";
    else if (personId === "P002") mask = "XXXX-XXXX-2029";
    else if (personId === "P004" || personId === "P-VIKRAM") mask = "XXXX-XXXX-4048";

    return {
      person_id: personId,
      has_aadhaar: true,
      aadhaar_masked: mask,
      status,
      verhoeff_valid: !isInvalid,
      collision_detected: isCollision,
      collision_details: isCollision
        ? `CRITICAL AADHAAR COLLISION: Identifier ${mask} is simultaneously claimed across multiple profiles (${collidingMap[personId]?.join(", ") || "shared syndicate identity"}). High indicator of forged identity documentation or synthetic identity theft.`
        : null,
      colliding_person_ids: collidingMap[personId] || [],
      fanout_sim_count: isCollision ? 3 : 1,
      fanout_account_count: isCollision ? 2 : 1,
      total_fanout: isCollision ? 5 : 2,
    };
  },

  // ---------------------------------------------------------------------------
  // EDGE
  // ---------------------------------------------------------------------------

  async getEdge(id: string) {
    const edge = edges.find(
      (e) => e.id === id,
    );

    if (!edge) {
      throw new Error(
        `Edge not found: ${id}`,
      );
    }

    return edge;
  },

  // ---------------------------------------------------------------------------
  // EVIDENCE
  // ---------------------------------------------------------------------------

  async getEvidence({
    entityId,
    edgeId,
  }) {
    if (
      edgeId &&
      evidenceBySubject[edgeId]
    ) {
      return evidenceBySubject[edgeId];
    }

    if (
      entityId &&
      evidenceBySubject[entityId]
    ) {
      return evidenceBySubject[entityId];
    }

    if (edgeId) {
      const edge = edges.find(
        (e) => e.id === edgeId,
      );

      if (!edge) {
        return null;
      }

      return {
        subjectLabel:
          `${edge.source} ↔ ${edge.target}`,

        relationship: edge.type,

        reasoning:
          edge.summary ??
          "Relationship present in the investigation graph.",

        items: edge.amount
          ? [
              {
                id: "EV-AUTO-FIN",
                category:
                  "DIRECT" as const,

                statement:
                  `Core Banking Transaction Log: ₹${edge.amount.toLocaleString(
                    "en-IN",
                  )} via ${
                    edge.transactionType ||
                    "Transfer"
                  }. Status: ${
                    edge.status ||
                    "COMPLETED"
                  }.`,

                sourceRecords: [
                  {
                    id: "CBS-LOG",
                    kind: "Banking Switch",
                    label: `${
                      edge.sourceBank ||
                      "Origin Bank"
                    } Core Banking`,
                  },
                ],
              },
            ]
          : [],

        timelineIds: [],

        confidence:
          edge.confidence,

        confidenceBand:
          edge.confidenceBand,
      };
    }

    if (entityId) {
      const ent =
        entities[entityId];

      if (ent) {
        return {
          subjectLabel: ent.label,

          reasoning:
            ent.summary ??
            `${ent.type} recorded in active investigation network.`,

          items:
            ent.identifiers?.map(
              (i, idx) => ({
                id: `EV-AUTO-${idx}`,
                category:
                  "DIRECT" as const,

                statement:
                  `${i.kind}: ${i.value} verified in law enforcement / financial registry.`,

                sourceRecords: [
                  {
                    id: `SRC-${idx}`,
                    kind: "Registry",
                    label: `${i.kind} Database`,
                  },
                ],
              }),
            ) ?? [],

          timelineIds: [],

          confidence:
            ent.confidence ?? 90,

          confidenceBand:
            ent.confidenceBand ??
            "HIGH",
        };
      }
    }

    return null;
  },

  // ---------------------------------------------------------------------------
  // TIMELINE
  // ---------------------------------------------------------------------------

  async getTimeline({
    from,
    to,
  }) {
    return timeline.filter(
      (event) => {
        const day =
          event.timestamp.slice(
            0,
            10,
          );

        if (
          from &&
          day < from
        ) {
          return false;
        }

        if (
          to &&
          day > to
        ) {
          return false;
        }

        return true;
      },
    );
  },

  // ---------------------------------------------------------------------------
  // WHAT CHANGED
  // ---------------------------------------------------------------------------

  async getWhatChanged() {
    return whatChanged;
  },

  // ---------------------------------------------------------------------------
  // IDENTITY MATCHES
  // ---------------------------------------------------------------------------

  async getIdentityMatches(
    entityId: string,
  ) {
    return matchStore.filter(
      (m) => m.entityId === entityId,
    );
  },

  async reviewIdentityMatch(
    matchId: string,
    status: MatchReviewStatus,
  ) {
    const match =
      matchStore.find(
        (m) => m.id === matchId,
      );

    if (!match) {
      throw new Error(
        `Match not found: ${matchId}`,
      );
    }

    match.status = status;

    return match;
  },

  // ---------------------------------------------------------------------------
  // JURISDICTION
  // ---------------------------------------------------------------------------

  async getJurisdictionAlerts() {
    return jurisdictionAlerts;
  },

  // ---------------------------------------------------------------------------
  // CONTINUITY
  // ---------------------------------------------------------------------------

  async getContinuityAlerts() {
    return continuityAlerts;
  },

  // ---------------------------------------------------------------------------
  // CASES
  // ---------------------------------------------------------------------------

  async getAllCases() {
    return Object.values(
      CASES_CATALOG,
    );
  },

  // ---------------------------------------------------------------------------
  // MOCK FIR INGESTION
  // ---------------------------------------------------------------------------

  async ingestFir(
    _textContent: string,
    reportTitle = "Police FIR Report",
  ) {
    return {
      report_title: reportTitle,

      extracted_entities: [
        {
          id: "P001",
          entity_type: "Person",
          label: "Aarav Sharma",
          metadata: {
            role: "Suspect",
            mentioned_in: reportTitle,
          },
        },

        {
          id: "SIM001",
          entity_type: "SIM",
          label: "SIM001",
          metadata: {
            operator: "Airtel",
          },
        },
      ],

      extracted_relationships: [
        {
          id: "REL_MOCK_01",

          source_entity_type:
            "Person",

          source_entity_id:
            "P001",

          target_entity_type:
            "SIM",

          target_entity_id:
            "SIM001",

          relationship_type:
            "OWNS_SIM",

          confidence: 0.95,
        },
      ],

      overall_confidence: 0.92,

      warnings: [],
    };
  },

  // ---------------------------------------------------------------------------
  // MOCK CSV INGESTION
  // ---------------------------------------------------------------------------

  async ingestCsv(
    _file: File,
  ) {
    return {
      records_processed: 42,
      entities_created: 18,
      relationships_created: 34,
      duplicates_resolved: 5,
      warnings: [],
    };
  },

  // ---------------------------------------------------------------------------
  // MOCK VISION / OCR
  // ---------------------------------------------------------------------------

  async analyzeVision(
    _file: File,
    locationId = "LOC005",
  ) {
    return {
      extracted_text:
        "TN38AB1234 SIGHTED AT CHECKPOINT",

      detected_plate:
        "TN38AB1234",

      confidence: 0.94,

      matched_vehicle: {
        vehicle_id:
          "V-TN38AB1234",

        registration_number:
          "TN38AB1234",

        make: "Toyota",

        model: "Fortuner",

        color: "White",

        owner_person_id:
          "P001",
      },

      owner: {
        person_id: "P001",

        name: "Aarav Sharma",

        state: "Tamil Nadu",

        district: "Coimbatore",
      },

      connected_entities: [
        {
          entity_id: "P001",
          relationship_type:
            "OWNS",
          confidence: 0.95,
        },

        {
          entity_id:
            locationId || "LOC005",

          relationship_type:
            "SEEN_AT",

          confidence: 0.92,
        },
      ],

      warnings: [],
    };
  },
};

export { INVESTIGATION_ID };
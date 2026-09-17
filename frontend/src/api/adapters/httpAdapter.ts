import type { NexusApi } from "@/api/types";

import { mockAdapter } from "@/api/adapters/mockAdapter";

import { CASES_CATALOG } from "@/mock/investigationData";

import type {
  BackendSearchResponse,
  BackendFocalGraphResponse,
  BackendInvestigationSummaryResponse,
  BackendContinuityResponse,
  BackendJurisdictionsResponse,
  BackendTimelineComparisonResponse,
  BackendEvidenceResponse,
  BackendEntityResolutionResponse,
} from "@/types/backend";

import {
  toBackendEntityType,
  inferEntityTypeFromId,
  mapBackendSearchResultToEntity,
  mapBackendSearchResponse,
  mapBackendGraphToPayload,
  mapBackendSummaryToInvestigation,
  mapBackendContinuityToAlerts,
  mapBackendJurisdictionsToAlerts,
  mapBackendTimelineToWhatChanged,
  mapBackendEvidenceToBundle,
  mapBackendCandidatesToMatches,
  toFrontendEntityType,
} from "@/lib/backendMappers";

import { formatRelationshipLabel } from "@/lib/timelinePresenter";

import type {
  Entity,
  GraphEdge,
  GraphPayload,
  TimelineEvent,
  MatchReviewStatus,
  SearchMatch,
  IdentityMatch,
  AadhaarForensics,
} from "@/types/nexus";

// Local cache to support entity and edge inspection
// without requiring separate endpoints
const nodeCache = new Map<string, Entity>();
const edgeCache = new Map<string, GraphEdge>();

let activeFocalId = "P001";
let activeFocalType = "Person";

const reviewedMatches = new Map<string, IdentityMatch>();

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const candidates: string[] = [];

  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (envUrl) {
    const trimmed = envUrl.endsWith("/")
      ? envUrl.slice(0, -1)
      : envUrl;

    candidates.push(`${trimmed}${cleanPath}`);
  }

  candidates.push(`/api${cleanPath}`);

  // Only attempt direct localhost ports if not on HTTPS.
  // This avoids mixed-content blocks on HTTPS deployments.
  if (
    typeof window === "undefined" ||
    window.location.protocol !== "https:"
  ) {
    candidates.push(
      `http://127.0.0.1:8000/api${cleanPath}`,
    );

    candidates.push(
      `http://localhost:8000/api${cleanPath}`,
    );
  }

  const token =
    localStorage.getItem("nexus_auth_token") ||
    "demo-jwt-token-nexus-2026";

  let lastError: any = null;

  for (const url of candidates) {
    try {
      const controller = new AbortController();

      const timeoutId = setTimeout(
        () => controller.abort(),
        2000,
      );

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          ...(init?.headers ?? {}),
        },
        ...init,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return (await response.json()) as T;
      }

      // Authentication failure:
      // immediately clear the local authentication state.
      if (response.status === 401) {
        try {
          const { useAuthStore } = await import(
            "@/store/authStore"
          );

          useAuthStore.getState().logout();
        } catch {
          localStorage.removeItem("nexus_auth_token");
          localStorage.removeItem("nexus_auth_user");
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw (
    lastError ||
    new Error(`Backend API Error: ${path}`)
  );
}

export const httpAdapter: NexusApi = {
  // ---------------------------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------------------------

  search: async (query, type) => {
    let backendMatches: SearchMatch[] = [];
    let detectedType: any = null;

    try {
      const backendType = toBackendEntityType(type);

      const params = new URLSearchParams({
        q: query,
        limit: "100",
      });

      if (backendType) {
        params.set("entity_type", backendType);
      }

      const raw =
        await request<BackendSearchResponse>(
          `/search?${params.toString()}`,
        );

      const mapped =
        mapBackendSearchResponse(raw, query);

      backendMatches = mapped.matches;
      detectedType = mapped.detectedType;

      // Cache entities found in search.
      backendMatches.forEach((m) => {
        nodeCache.set(m.entity.id, m.entity);
      });
    } catch (err) {
      console.warn(
        "Live backend search error:",
        err,
      );
    }

    // If backend returned results, use them exclusively.
    if (backendMatches.length > 0) {
      return {
        query,
        normalizedQuery: query
          .trim()
          .toUpperCase()
          .replace(/[\s\-_]/g, ""),
        detectedType:
          detectedType ||
          backendMatches[0]?.entity.type ||
          null,
        matches: backendMatches,
      };
    }

    // Only query mock catalog if live backend returned
    // zero matches.
    let mockMatches: SearchMatch[] = [];

    try {
      const mockRes =
        await mockAdapter.search(query, type);

      mockMatches = mockRes.matches;

      if (!detectedType) {
        detectedType = mockRes.detectedType;
      }
    } catch {
      // Ignore mock fallback errors.
    }

    return {
      query,
      normalizedQuery: query
        .trim()
        .toUpperCase()
        .replace(/[\s\-_]/g, ""),
      detectedType:
        detectedType ||
        mockMatches[0]?.entity.type ||
        null,
      matches: mockMatches,
    };
  },

  // ---------------------------------------------------------------------------
  // INVESTIGATION SUMMARY
  // ---------------------------------------------------------------------------

  getInvestigation: async (id) => {
    const cleanId = id.startsWith("INV-")
      ? id.replace("INV-", "")
      : id;

    activeFocalId = cleanId;
    activeFocalType =
      inferEntityTypeFromId(cleanId);

    try {
      const raw =
        await request<BackendInvestigationSummaryResponse>(
          `/investigation/${activeFocalType}/${cleanId}/summary`,
        );

      const mapped =
        mapBackendSummaryToInvestigation(raw);

      if (
        mapped &&
        mapped.focalEntityId
      ) {
        return mapped;
      }
    } catch {
      // Fallback to synthesizing investigation
      // summary from entity information below.
    }

    // If it's a known mock case ID,
    // fall back to mock catalog.
    if (
      cleanId.startsWith("CASE-") ||
      cleanId.startsWith("FIR-")
    ) {
      const mockCase =
        await mockAdapter.getInvestigation(id);

      if (mockCase) {
        return mockCase;
      }
    }

    // Synthesize structured summary for the
    // focal entity without hardcoding a mock case.
    const entityLabel =
      nodeCache.get(cleanId)?.label ||
      cleanId;

    return {
      id: cleanId,
      label: `Investigation: ${entityLabel}`,
      status: "ACTIVE",
      focalEntityId: cleanId,
      focalLabel: entityLabel,
      entityCount: 1,
      caseCount: 0,
      jurisdictionCount: 1,
      continuityCount: 0,
      eventCount: 0,
      jurisdictions: ["India"],
    };
  },

  // ---------------------------------------------------------------------------
  // GRAPH
  // ---------------------------------------------------------------------------

  getGraph: async (query) => {
    const focalId =
      query.focalId || activeFocalId;

    activeFocalId = focalId;

    activeFocalType =
      inferEntityTypeFromId(focalId);

    let livePayload: GraphPayload | null =
      null;

    try {
      const params = new URLSearchParams({
        depth: String(query.depth || 1),
      });

      if (query.from) {
        params.set(
          "start_time",
          query.from,
        );
      }

      if (query.to) {
        params.set(
          "end_time",
          query.to,
        );
      }

      const raw =
        await request<BackendFocalGraphResponse>(
          `/investigation/${activeFocalType}/${focalId}?${params.toString()}`,
        );

      const payload =
        mapBackendGraphToPayload(raw);

      if (
        payload &&
        payload.nodes.length > 0
      ) {
        livePayload = payload;
      }
    } catch {
      // Live query failed.
    }

    // -------------------------------------------------------------------------
    // IMPORTANT:
    // If the live backend returned graph data, use it exclusively.
    // This prevents mock data from contaminating the real investigation graph.
    // -------------------------------------------------------------------------

    if (
      livePayload &&
      livePayload.nodes.length > 0
    ) {
      livePayload.nodes.forEach((n) => {
        if (!nodeCache.has(n.id)) {
          nodeCache.set(n.id, {
            id: n.id,
            type: n.type,
            label: n.label,
            value: n.label,
            confidenceBand: "HIGH",
            summary: `${n.sublabel || n.type}: ${n.label}`,
          });
        }
      });

      livePayload.edges.forEach((e) => {
        edgeCache.set(e.id, e);
      });

      return livePayload;
    }

    // -------------------------------------------------------------------------
    // MOCK FALLBACK
    // Only use mock graph data when:
    // 1. Backend produced no graph data
    // 2. The focal ID is a known mock/demo ID
    // -------------------------------------------------------------------------

    if (
      focalId.startsWith("CASE-") ||
      focalId.startsWith("V-TN38") ||
      focalId.startsWith("P-")
    ) {
      try {
        const mockPayload =
          await mockAdapter.getGraph(query);

        if (
          mockPayload &&
          mockPayload.nodes.length > 0
        ) {
          mockPayload.nodes.forEach((n) =>
            nodeCache.set(n.id, {
              id: n.id,
              type: n.type,
              label: n.label,
              value: n.label,
              confidenceBand: "HIGH",
              summary: `${n.sublabel || n.type}: ${n.label}`,
            }),
          );

          mockPayload.edges.forEach((e) => {
            edgeCache.set(e.id, e);
          });

          return mockPayload;
        }
      } catch {
        // Ignore mock fallback errors.
      }
    }

    // -------------------------------------------------------------------------
    // FOCAL-ONLY FALLBACK
    // If the entity has no graph relationships in DB,
    // return the focal node alone.
    // -------------------------------------------------------------------------

    const ent = nodeCache.get(focalId);

    return {
      focalId,
      nodes: [
        {
          id: focalId,
          type: toFrontendEntityType(
            activeFocalType,
          ),
          label: ent?.label || focalId,
          sublabel: activeFocalType,
          val: 15,
        },
      ],
      edges: [],
    };
  },

  // ---------------------------------------------------------------------------
  // ENTITY
  // ---------------------------------------------------------------------------

  getEntity: async (id) => {
    if (nodeCache.has(id)) {
      return nodeCache.get(id)!;
    }

    // Try lookup via search API.
    try {
      const searchRes =
        await request<BackendSearchResponse>(
          `/search?q=${encodeURIComponent(id)}&limit=10`,
        );

      if (
        searchRes.results &&
        searchRes.results.length > 0
      ) {
        const found =
          searchRes.results.find(
            (r) =>
              r.entity_id.toUpperCase() ===
              id.toUpperCase(),
          ) ||
          searchRes.results[0];

        const entity =
          mapBackendSearchResultToEntity(
            found,
          );

        nodeCache.set(id, entity);

        return entity;
      }
    } catch {
      // Fallback below.
    }

    // Fallback heuristic entity.
    const fType =
      toFrontendEntityType(
        inferEntityTypeFromId(id),
      );

    const fallback: Entity = {
      id,
      type: fType,
      label: id,
      value: id,
      confidenceBand: "HIGH",
      summary: `Entity ${id} (${fType})`,
    };

    nodeCache.set(id, fallback);

    return fallback;
  },

  getAadhaarForensics: async (personId: string): Promise<AadhaarForensics | null> => {
    try {
      const res = await request<AadhaarForensics>(
        `/analysis/aadhaar-forensics?person_id=${encodeURIComponent(personId)}`
      );
      return res;
    } catch {
      return null;
    }
  },

  // ---------------------------------------------------------------------------
  // EDGE
  // ---------------------------------------------------------------------------

  getEdge: async (id) => {
    if (edgeCache.has(id)) {
      return edgeCache.get(id)!;
    }

    return {
      id,
      source: activeFocalId,
      target: "UNKNOWN",
      type: "CONNECTED_TO",
      confidence: 1.0,
      confidenceBand: "HIGH",
      summary: `Relationship ${id}`,
    };
  },

  // ---------------------------------------------------------------------------
  // EVIDENCE
  // ---------------------------------------------------------------------------

  getEvidence: async ({
    entityId,
    edgeId,
  }) => {
    // First inspect cached edge.
    if (
      edgeId &&
      edgeCache.has(edgeId)
    ) {
      const e = edgeCache.get(edgeId)!;

      const srcNode =
        nodeCache.get(e.source);

      const tgtNode =
        nodeCache.get(e.target);

      const srcLabel =
        srcNode?.label || e.source;

      const tgtLabel =
        tgtNode?.label || e.target;

      return {
        subjectLabel:
          `${srcLabel} ↔ ${tgtLabel}`,

        relationship: e.type,

        reasoning:
          e.summary ||
          `Direct link ${e.type} identified in graph traversal.`,

        confidence:
          e.confidence ?? 0.9,

        confidenceBand:
          e.confidenceBand ?? "HIGH",

        timelineIds: [],

        items: e.amount
          ? [
              {
                id: `EV-EDGE-${e.id}`,
                category: "DIRECT",
                statement:
                  `Core Banking Transaction: ₹${e.amount.toLocaleString(
                    "en-IN",
                  )} via ${
                    e.transactionType ||
                    "Wire Transfer"
                  } (${
                    e.status ||
                    "COMPLETED"
                  }).`,
                sourceRecords: [
                  {
                    id: `SRC-${e.id}`,
                    kind: "Banking switch",
                    label: `${srcLabel} Banking Record`,
                  },
                ],
              },
            ]
          : [
              {
                id: `EV-EDGE-${e.id}`,
                category: "DIRECT",
                statement:
                  `${srcLabel} connected to ${tgtLabel} via ${e.type} (${
                    e.summary ||
                    "Graph Edge"
                  }).`,
                sourceRecords: [
                  {
                    id: `SRC-${e.id}`,
                    kind: "Intelligence Log",
                    label:
                      "Relational Edge Registry",
                  },
                ],
              },
            ],
      };
    }

    const targetId =
      entityId ||
      edgeId ||
      activeFocalId;

    try {
      const raw =
        await request<BackendEvidenceResponse>(
          `/analysis/evidence?focal_entity_id=${encodeURIComponent(
            targetId,
          )}`,
        );

      const bundle =
        mapBackendEvidenceToBundle(raw);

      if (
        bundle &&
        bundle.items &&
        bundle.items.length > 0
      ) {
        return bundle;
      }
    } catch {
      // Fallback below.
    }

    // Direct node inspection without
    // mock fallback.
    if (
      entityId &&
      nodeCache.has(entityId)
    ) {
      const ent =
        nodeCache.get(entityId)!;

      return {
        subjectLabel: ent.label,

        reasoning:
          ent.summary ||
          `Entity ${ent.label} (${ent.type}) in active focal graph.`,

        confidence:
          ent.confidence ?? 0.9,

        confidenceBand:
          ent.confidenceBand ?? "HIGH",

        timelineIds: [],

        items: [
          {
            id: `EV-NODE-${ent.id}`,
            category: "DIRECT",
            statement:
              `${ent.type.toUpperCase()}: ${ent.label} record verified.`,
            sourceRecords: [
              {
                id: `SRC-${ent.id}`,
                kind: "Database",
                label:
                  "Central Intelligence DB",
              },
            ],
          },
        ],
      };
    }

    return null;
  },

  // ---------------------------------------------------------------------------
  // TIMELINE
  // ---------------------------------------------------------------------------

  getTimeline: async ({
    focalId,
    from,
    to,
  }) => {
    const id =
      focalId || activeFocalId;

    const entityType =
      inferEntityTypeFromId(id);

    const timelineEvents: TimelineEvent[] =
      [];

    // 1. Gather timestamped edges from
    // edge cache for the focal entity.
    edgeCache.forEach((e) => {
      if (
        (e.source === id ||
          e.target === id) &&
        e.validFrom
      ) {
        if (
          from &&
          e.validFrom < from
        ) {
          return;
        }

        if (
          to &&
          e.validFrom > to
        ) {
          return;
        }

        const srcLabel =
          nodeCache.get(e.source)
            ?.label || e.source;

        const tgtLabel =
          nodeCache.get(e.target)
            ?.label || e.target;

        let description =
          `${srcLabel} ↔ ${tgtLabel}`;

        if (e.summary) {
          description =
            e.summary
              .replace(
                e.source,
                srcLabel,
              )
              .replace(
                e.target,
                tgtLabel,
              );
        }

        timelineEvents.push({
          id: `EVT-EDGE-${e.id}`,
          timestamp: e.validFrom,
          kind: e.type,
          title:
            formatRelationshipLabel(
              e.type,
            ),
          description,
          entityIds: [
            e.source,
            e.target,
          ],
          edgeIds: [e.id],
        });
      }
    });

    // 2. Fetch continuity timeline items.
    try {
      const cont =
        await request<BackendContinuityResponse>(
          `/investigation/${entityType}/${id}/continuity`,
        );

      (cont.transitions || []).forEach(
        (t) => {
          (t.timeline || []).forEach(
            (tl, tIdx) => {
              timelineEvents.push({
                id: `EVT-CONT-${t.entity_id}-${tIdx}`,

                timestamp:
                  tl.date ||
                  t.transition_date ||
                  "2026-01-10T12:00:00",

                kind:
                  "CONTINUITY_TRANSITION",

                title:
                  `Identifier Transition: ${t.transition.from_identifier} → ${t.transition.to_identifier}`,

                description:
                  tl.event ||
                  `Transition of ${t.transition.identifier_type}`,

                entityIds: [
                  t.entity_id,
                  t.transition
                    .from_identifier,
                  t.transition
                    .to_identifier,
                ],
              });
            },
          );
        },
      );
    } catch {
      // Continue.
    }

    // Sort chronologically.
    timelineEvents.sort(
      (a, b) =>
        a.timestamp.localeCompare(
          b.timestamp,
        ),
    );

    // Return true timeline events.
    // Do not fall back to mock timeline data.
    return timelineEvents;
  },

  // ---------------------------------------------------------------------------
  // WHAT CHANGED
  // ---------------------------------------------------------------------------

  getWhatChanged: async (
    anchorEventId,
  ) => {
    const focalId =
      activeFocalId;

    const entityType =
      activeFocalType;

    const refTs =
      anchorEventId &&
      anchorEventId.includes("T")
        ? anchorEventId
        : "2026-01-15T12:00:00";

    try {
      const raw =
        await request<BackendTimelineComparisonResponse>(
          `/investigation/${entityType}/${focalId}/timeline?reference_timestamp=${encodeURIComponent(
            refTs,
          )}`,
        );

      return mapBackendTimelineToWhatChanged(
        raw,
        `Anchor for ${focalId}`,
      );
    } catch {
      return {
        anchorEventId: "T-ANCHOR-0",
        anchorLabel:
          `Investigation for ${focalId}`,

        before: {
          label: "Baseline Period",
          communication: "Normal",
          locations: [],
          vehicles: [],
        },

        after: {
          label: "Active Window",
          communication: "Normal",
          locations: [],
          vehicles: [],
        },
      };
    }
  },

  // ---------------------------------------------------------------------------
  // IDENTITY MATCHES
  // ---------------------------------------------------------------------------

  getIdentityMatches: async (
    entityId,
  ) => {
    try {
      const raw =
        await request<BackendEntityResolutionResponse>(
          `/analysis/entity-resolution?query_entity_id=${encodeURIComponent(
            entityId,
          )}`,
        );

      const mapped =
        mapBackendCandidatesToMatches(
          raw.candidates || [],
        );

      // Check if any match was reviewed locally.
      return mapped.map(
        (m) =>
          reviewedMatches.get(m.id) ||
          m,
      );
    } catch {
      return [];
    }
  },

  reviewIdentityMatch: async (
    matchId,
    status: MatchReviewStatus,
  ) => {
    const existing =
      reviewedMatches.get(matchId) || {
        id: matchId,
        entityId: activeFocalId,
        displayName: matchId,
        confidence: 90,
        signals: [
          "Investigator manual decision",
        ],
        status,
      };

    const updated = {
      ...existing,
      status,
    };

    reviewedMatches.set(
      matchId,
      updated,
    );

    return updated;
  },

  // ---------------------------------------------------------------------------
  // JURISDICTION ALERTS
  // ---------------------------------------------------------------------------

  getJurisdictionAlerts: async (
    investigationId,
  ) => {
    const cleanId =
      investigationId.startsWith(
        "INV-",
      )
        ? investigationId.replace(
            "INV-",
            "",
          )
        : investigationId;

    const entityType =
      inferEntityTypeFromId(cleanId);

    try {
      const raw =
        await request<BackendJurisdictionsResponse>(
          `/investigation/${entityType}/${cleanId}/jurisdictions`,
        );

      const mapped =
        mapBackendJurisdictionsToAlerts(
          raw,
        );

      return mapped || [];
    } catch {
      return [];
    }
  },

  // ---------------------------------------------------------------------------
  // CONTINUITY ALERTS
  // ---------------------------------------------------------------------------

  getContinuityAlerts: async (
    investigationId,
  ) => {
    const cleanId =
      investigationId.startsWith(
        "INV-",
      )
        ? investigationId.replace(
            "INV-",
            "",
          )
        : investigationId;

    const entityType =
      inferEntityTypeFromId(cleanId);

    try {
      const raw =
        await request<BackendContinuityResponse>(
          `/investigation/${entityType}/${cleanId}/continuity`,
        );

      const mapped =
        mapBackendContinuityToAlerts(
          raw,
        );

      return mapped || [];
    } catch {
      return [];
    }
  },

  // ---------------------------------------------------------------------------
  // ALL CASES
  // ---------------------------------------------------------------------------

  getAllCases: async () => {
    try {
      const raw =
        await request<BackendSearchResponse>(
          "/search?q=FIR&entity_type=FIR&limit=100",
        );

      if (
        raw.results &&
        raw.results.length > 0
      ) {
        return raw.results.map((r) => {
          const props =
            r.properties || {};

          return {
            id: r.entity_id,

            label: `${
              r.label ||
              r.entity_id
            } · ${
              props.crime_type ||
              "Under Investigation"
            }`,

            status:
              "ACTIVE" as const,

            focalEntityId:
              r.entity_id,

            focalLabel:
              r.label ||
              r.entity_id,

            entityCount: 1,
            caseCount: 1,
            jurisdictionCount: 1,
            continuityCount: 0,
            eventCount: 0,

            jurisdictions:
              props.state
                ? [props.state]
                : [
                    "National Jurisdiction",
                  ],

            policeStation:
              props.police_station ||
              "Jurisdiction Police Station",

            district:
              props.district ||
              "District HQ",

            state:
              props.state ||
              "State Police",

            registeredDate:
              props.incident_date ||
              "2026-01-15",

            sections:
              props.crime_type ||
              "Under Investigation",

            crimeType:
              props.crime_type,
          };
        });
      }
    } catch {
      // Fallback below.
    }

    return Object.values(
      CASES_CATALOG,
    );
  },

  // ---------------------------------------------------------------------------
  // FIR INGESTION
  // ---------------------------------------------------------------------------

  ingestFir: async (
    textContent,
    reportTitle = "Police FIR Report",
    policeStation = "Central PS",
  ) => {
    return request(
      "/ingest/fir",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          text_content:
            textContent,

          report_title:
            reportTitle,

          police_station:
            policeStation,
        }),
      },
    );
  },

  // ---------------------------------------------------------------------------
  // CSV INGESTION
  // ---------------------------------------------------------------------------

  ingestCsv: async (file) => {
    const formData =
      new FormData();

    formData.append(
      "file",
      file,
    );

    return request(
      "/ingest/csv",
      {
        method: "POST",
        body: formData,
      },
    );
  },

  // ---------------------------------------------------------------------------
  // VISION / OCR
  // ---------------------------------------------------------------------------

  analyzeVision: async (
    file,
    locationId = "LOC005",
  ) => {
    const formData =
      new FormData();

    formData.append(
      "file",
      file,
    );

    if (locationId) {
      formData.append(
        "location_id",
        locationId,
      );
    }

    return request(
      "/vision/analyze",
      {
        method: "POST",
        body: formData,
      },
    );
  },
};
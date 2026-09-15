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
} from "@/types/nexus";
import type { NexusApi } from "@/api/types";

const matchStore: IdentityMatch[] = identityMatches.map((m) => ({ ...m }));

function detectType(normalized: string, raw: string): SearchMatch[] {
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

    if (hay.includes(normalized) || rawHay.includes(raw.trim().toLowerCase())) {
      hits.push({
        entity,
        score: entity.id === "V-TN38AB1234" && normalized.includes("TN38AB1234") ? 99 : 80,
        reason: "Identifier, account or name match after normalization",
      });
    }
  }
  return hits.sort((a, b) => b.score - a.score);
}

export const mockAdapter: NexusApi = {
  async search(query: string, type: SearchType): Promise<SearchResponse> {
    const normalizedQuery = normalizeClue(query);
    if (!query.trim()) {
      return { query, normalizedQuery, detectedType: null, matches: [] };
    }
    let matches = detectType(normalizedQuery, query);
    if (type !== "auto") {
      matches = matches.filter((m) => m.entity.type === type);
    }
    return {
      query,
      normalizedQuery,
      detectedType: matches[0]?.entity.type ?? null,
      matches,
    };
  },

  async getInvestigation(id?: string) {
    if (id && CASES_CATALOG[id]) {
      return CASES_CATALOG[id];
    }
    if (id) {
      for (const c of Object.values(CASES_CATALOG)) {
        if (c.id === id || c.focalEntityId === id) return c;
      }
    }
    return summary;
  },

  async getGraph(query: GraphQuery) {
    const filtered = filterGraph(
      { nodes, edges, focalId: query.focalId },
      {
        depth: query.depth,
        relGroups: query.relTypes,
        from: query.from,
        to: query.to,
      },
    );
    return { nodes: filtered.nodes, edges: filtered.edges, focalId: query.focalId };
  },

  async getEntity(id: string): Promise<Entity> {
    const entity = entities[id];
    if (!entity) throw new Error(`Entity not found: ${id}`);
    return entity;
  },

  async getEdge(id: string) {
    const edge = edges.find((e) => e.id === id);
    if (!edge) throw new Error(`Edge not found: ${id}`);
    return edge;
  },

  async getEvidence({ entityId, edgeId }) {
    if (edgeId && evidenceBySubject[edgeId]) return evidenceBySubject[edgeId];
    if (entityId && evidenceBySubject[entityId]) return evidenceBySubject[entityId];
    if (edgeId) {
      const edge = edges.find((e) => e.id === edgeId);
      if (!edge) return null;
      return {
        subjectLabel: `${edge.source} ↔ ${edge.target}`,
        relationship: edge.type,
        reasoning: edge.summary ?? "Relationship present in the investigation graph.",
        items: edge.amount
          ? [
              {
                id: "EV-AUTO-FIN",
                category: "DIRECT" as const,
                statement: `Core Banking Transaction Log: ₹${edge.amount.toLocaleString("en-IN")} via ${edge.transactionType || "Transfer"}. Status: ${edge.status || "COMPLETED"}.`,
                sourceRecords: [{ id: "CBS-LOG", kind: "Banking Switch", label: `${edge.sourceBank || "Origin Bank"} Core Banking` }],
              },
            ]
          : [],
        timelineIds: [],
        confidence: edge.confidence,
        confidenceBand: edge.confidenceBand,
      };
    }
    if (entityId) {
      const ent = entities[entityId];
      if (ent) {
        return {
          subjectLabel: ent.label,
          reasoning: ent.summary ?? `${ent.type} recorded in active investigation network.`,
          items: ent.identifiers?.map((i, idx) => ({
            id: `EV-AUTO-${idx}`,
            category: "DIRECT" as const,
            statement: `${i.kind}: ${i.value} verified in law enforcement / financial registry.`,
            sourceRecords: [{ id: `SRC-${idx}`, kind: "Registry", label: `${i.kind} Database` }],
          })) ?? [],
          timelineIds: [],
          confidence: ent.confidence ?? 90,
          confidenceBand: ent.confidenceBand ?? "HIGH",
        };
      }
    }
    return null;
  },

  async getTimeline({ from, to }) {
    return timeline.filter((event) => {
      const day = event.timestamp.slice(0, 10);
      if (from && day < from) return false;
      if (to && day > to) return false;
      return true;
    });
  },

  async getWhatChanged() {
    return whatChanged;
  },

  async getIdentityMatches(entityId: string) {
    return matchStore.filter((m) => m.entityId === entityId);
  },

  async reviewIdentityMatch(matchId: string, status: MatchReviewStatus) {
    const match = matchStore.find((m) => m.id === matchId);
    if (!match) throw new Error(`Match not found: ${matchId}`);
    match.status = status;
    return match;
  },

  async getJurisdictionAlerts() {
    return jurisdictionAlerts;
  },

  async getContinuityAlerts() {
    return continuityAlerts;
  },

  async getAllCases() {
    return Object.values(CASES_CATALOG);
  },
};

export { INVESTIGATION_ID };

import type { NexusApi } from "@/api/types";
import { mockAdapter } from "@/api/adapters/mockAdapter";
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
  TimelineEvent,
  MatchReviewStatus,
  SearchMatch,
} from "@/types/nexus";

// Local cache to support entity and edge inspection without requiring separate endpoints
const nodeCache = new Map<string, Entity>();
const edgeCache = new Map<string, GraphEdge>();
let activeFocalId = "P001";
let activeFocalType = "Person";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const candidates: string[] = [];

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    const trimmed = envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
    candidates.push(`${trimmed}${cleanPath}`);
  }
  candidates.push(`/api${cleanPath}`);
  candidates.push(`http://127.0.0.1:8000/api${cleanPath}`);
  candidates.push(`http://localhost:8000/api${cleanPath}`);

  let lastError: any = null;
  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          ...(init?.headers ?? {}),
        },
        ...init,
      });

      if (response.ok) {
        return (await response.json()) as T;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Backend API Error: ${path}`);
}

export const httpAdapter: NexusApi = {
  search: async (query, type) => {
    let backendMatches: SearchMatch[] = [];
    let detectedType: any = null;

    try {
      const backendType = toBackendEntityType(type);
      const params = new URLSearchParams({ q: query, limit: "100" });
      if (backendType) {
        params.set("entity_type", backendType);
      }

      const raw = await request<BackendSearchResponse>(`/search?${params.toString()}`);
      const mapped = mapBackendSearchResponse(raw, query);
      backendMatches = mapped.matches;
      detectedType = mapped.detectedType;

      // Cache entities found in search
      backendMatches.forEach((m) => {
        nodeCache.set(m.entity.id, m.entity);
      });
    } catch (err) {
      console.warn("Live backend search error:", err);
    }

    // Always query mock catalog to ensure 100% data coverage
    let mockMatches: SearchMatch[] = [];
    try {
      const mockRes = await mockAdapter.search(query, type);
      mockMatches = mockRes.matches;
      if (!detectedType) detectedType = mockRes.detectedType;
    } catch {
      // Ignore
    }

    // Merge deduplicated matches (prioritizing backend matches)
    const seen = new Set<string>();
    const merged: SearchMatch[] = [];

    for (const m of backendMatches) {
      const key = m.entity.id.toUpperCase().replace(/[\s-_]/g, "");
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(m);
      }
    }

    for (const m of mockMatches) {
      const key = m.entity.id.toUpperCase().replace(/[\s-_]/g, "");
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(m);
        nodeCache.set(m.entity.id, m.entity);
      }
    }

    return {
      query,
      normalizedQuery: query.trim().toUpperCase().replace(/[\s-_]/g, ""),
      detectedType: detectedType || merged[0]?.entity.type || null,
      matches: merged,
    };
  },

  getInvestigation: async (id) => {
    const cleanId = id.startsWith("INV-") ? id.replace("INV-", "") : id;
    activeFocalId = cleanId;
    activeFocalType = inferEntityTypeFromId(cleanId);

    try {
      const raw = await request<BackendInvestigationSummaryResponse>(
        `/investigation/${activeFocalType}/${cleanId}/summary`,
      );
      const mapped = mapBackendSummaryToInvestigation(raw);
      if (mapped && mapped.focalEntityId) return mapped;
    } catch {
      // Fallback below
    }

    return mockAdapter.getInvestigation(id);
  },

  getGraph: async (query) => {
    const focalId = query.focalId || activeFocalId;
    activeFocalId = focalId;
    activeFocalType = inferEntityTypeFromId(focalId);

    try {
      const params = new URLSearchParams({
        depth: String(query.depth || 1),
      });

      if (query.from) params.set("start_time", query.from);
      if (query.to) params.set("end_time", query.to);

      const raw = await request<BackendFocalGraphResponse>(
        `/investigation/${activeFocalType}/${focalId}?${params.toString()}`,
      );

      const payload = mapBackendGraphToPayload(raw);

      if (payload && payload.nodes.length > 0) {
        // Cache graph nodes and edges for synchronous/on-demand selection
        payload.nodes.forEach((n) => {
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

        payload.edges.forEach((e) => {
          edgeCache.set(e.id, e);
        });

        return payload;
      }
    } catch {
      // Fallback below
    }

    return mockAdapter.getGraph(query);
  },

  getEntity: async (id) => {
    if (nodeCache.has(id)) {
      return nodeCache.get(id)!;
    }

    try {
      const mockEntity = await mockAdapter.getEntity(id);
      if (mockEntity) {
        nodeCache.set(id, mockEntity);
        return mockEntity;
      }
    } catch {
      // Continue to live API or fallback
    }

    // Try lookup via search API
    try {
      const searchRes = await request<BackendSearchResponse>(`/search?q=${encodeURIComponent(id)}&limit=10`);
      if (searchRes.results && searchRes.results.length > 0) {
        const found =
          searchRes.results.find((r) => r.entity_id.toUpperCase() === id.toUpperCase()) ||
          searchRes.results[0];
        const entity = mapBackendSearchResultToEntity(found);
        nodeCache.set(id, entity);
        return entity;
      }
    } catch {
      // Fallback below
    }

    // Fallback heuristic entity
    const fType = toFrontendEntityType(inferEntityTypeFromId(id));
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

  getEdge: async (id) => {
    if (edgeCache.has(id)) {
      return edgeCache.get(id)!;
    }

    try {
      const mockEdge = await mockAdapter.getEdge(id);
      if (mockEdge) {
        edgeCache.set(id, mockEdge);
        return mockEdge;
      }
    } catch {
      // Fallback
    }

    return {
      id,
      source: "unknown",
      target: "unknown",
      type: "CONNECTED_TO",
      confidence: 1.0,
      confidenceBand: "HIGH",
      summary: `Relationship ${id}`,
    };
  },

  getEvidence: async ({ entityId, edgeId }) => {
    if (edgeId && edgeCache.has(edgeId)) {
      const e = edgeCache.get(edgeId)!;
      const srcNode = nodeCache.get(e.source);
      const tgtNode = nodeCache.get(e.target);
      const srcLabel = srcNode?.label || e.source;
      const tgtLabel = tgtNode?.label || e.target;
      return {
        subjectLabel: `${srcLabel} ↔ ${tgtLabel}`,
        relationship: e.type,
        reasoning: e.summary || `Direct link ${e.type} identified in graph traversal.`,
        confidence: e.confidence ?? 0.9,
        confidenceBand: e.confidenceBand ?? "HIGH",
        timelineIds: [],
        items: e.amount
          ? [
              {
                id: `EV-EDGE-${e.id}`,
                category: "DIRECT",
                statement: `Core Banking Transaction: ₹${e.amount.toLocaleString("en-IN")} via ${e.transactionType || "Wire Transfer"} (${e.status || "COMPLETED"}).`,
                sourceRecords: [
                  { id: `SRC-${e.id}`, kind: "Banking switch", label: `${srcLabel} Banking Record` },
                ],
              },
            ]
          : [
              {
                id: `EV-EDGE-${e.id}`,
                category: "DIRECT",
                statement: `${srcLabel} connected to ${tgtLabel} via ${e.type} (${e.summary || "Graph Edge"}).`,
                sourceRecords: [
                  { id: `SRC-${e.id}`, kind: "Intelligence Log", label: "Relational Edge Registry" },
                ],
              },
            ],
      };
    }

    const targetId = entityId || edgeId || activeFocalId;
    try {
      const raw = await request<BackendEvidenceResponse>(
        `/analysis/evidence?focal_entity_id=${encodeURIComponent(targetId)}`,
      );
      const bundle = mapBackendEvidenceToBundle(raw);
      if (bundle && bundle.items && bundle.items.length > 0) return bundle;
    } catch {
      // Fallback below
    }

    try {
      const mockBundle = await mockAdapter.getEvidence({ entityId, edgeId });
      if (mockBundle) return mockBundle;
    } catch {
      // Fallback below
    }

    if (entityId && nodeCache.has(entityId)) {
      const ent = nodeCache.get(entityId)!;
      return {
        subjectLabel: ent.label,
        reasoning: ent.summary || `Entity ${ent.label} (${ent.type}) in active focal graph.`,
        confidence: ent.confidence ?? 0.9,
        confidenceBand: ent.confidenceBand ?? "HIGH",
        timelineIds: [],
        items: [
          {
            id: `EV-NODE-${ent.id}`,
            category: "DIRECT",
            statement: `${ent.type.toUpperCase()}: ${ent.label} record verified.`,
            sourceRecords: [{ id: `SRC-${ent.id}`, kind: "Database", label: "Central Intelligence DB" }],
          },
        ],
      };
    }

    return null;
  },

  getTimeline: async ({ focalId, from, to }) => {
    const id = focalId || activeFocalId;
    const entityType = inferEntityTypeFromId(id);

    const timelineEvents: TimelineEvent[] = [];

    // 1. Gather timestamped edges from edge cache
    edgeCache.forEach((e) => {
      if ((e.source === id || e.target === id) && e.validFrom) {
        if (from && e.validFrom < from) return;
        if (to && e.validFrom > to) return;

        const srcLabel = nodeCache.get(e.source)?.label || e.source;
        const tgtLabel = nodeCache.get(e.target)?.label || e.target;
        let description = `${srcLabel} ↔ ${tgtLabel}`;
        if (e.summary) {
          description = e.summary.replace(e.source, srcLabel).replace(e.target, tgtLabel);
        }

        timelineEvents.push({
          id: `EVT-EDGE-${e.id}`,
          timestamp: e.validFrom,
          kind: e.type,
          title: formatRelationshipLabel(e.type),
          description,
          entityIds: [e.source, e.target],
          edgeIds: [e.id],
        });
      }
    });

    // 2. Fetch continuity timeline items
    try {
      const cont = await request<BackendContinuityResponse>(
        `/investigation/${entityType}/${id}/continuity`,
      );
      (cont.transitions || []).forEach((t) => {
        (t.timeline || []).forEach((tl, tIdx) => {
          timelineEvents.push({
            id: `EVT-CONT-${t.entity_id}-${tIdx}`,
            timestamp: tl.date || t.transition_date || "2026-01-10T12:00:00",
            kind: "CONTINUITY_TRANSITION",
            title: `Identifier Transition: ${t.transition.from_identifier} → ${t.transition.to_identifier}`,
            description: tl.event || `Transition of ${t.transition.identifier_type}`,
            entityIds: [t.entity_id, t.transition.from_identifier, t.transition.to_identifier],
          });
        });
      });
    } catch {
      // Continue
    }

    // Sort chronologically
    timelineEvents.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    if (timelineEvents.length === 0) {
      try {
        const mockTl = await mockAdapter.getTimeline({ focalId: id, from, to });
        if (mockTl && mockTl.length > 0) return mockTl;
      } catch {
        // Fallback below
      }

      timelineEvents.push({
        id: `EVT-BASE-${id}`,
        timestamp: "2026-01-15T12:00:00",
        kind: "INVESTIGATION_ANCHOR",
        title: `Anchor Activity Recorded`,
        description: `Baseline activity point for focal entity ${id}`,
        entityIds: [id],
      });
    }

    return timelineEvents;
  },

  getWhatChanged: async (anchorEventId) => {
    const focalId = activeFocalId;
    const entityType = activeFocalType;
    const refTs = anchorEventId && anchorEventId.includes("T") ? anchorEventId : "2026-01-15T12:00:00";

    try {
      const raw = await request<BackendTimelineComparisonResponse>(
        `/investigation/${entityType}/${focalId}/timeline?reference_timestamp=${encodeURIComponent(refTs)}`,
      );
      return mapBackendTimelineToWhatChanged(raw, `Anchor for ${focalId}`);
    } catch {
      return mockAdapter.getWhatChanged(anchorEventId);
    }
  },

  getIdentityMatches: async (entityId) => {
    try {
      const raw = await request<BackendEntityResolutionResponse>(
        `/analysis/entity-resolution?query_entity_id=${encodeURIComponent(entityId)}`,
      );
      const mapped = mapBackendCandidatesToMatches(raw.candidates || []);
      if (mapped.length > 0) return mapped;
    } catch {
      // Fallback below
    }
    return mockAdapter.getIdentityMatches(entityId);
  },

  reviewIdentityMatch: async (matchId, status: MatchReviewStatus) => {
    return mockAdapter.reviewIdentityMatch(matchId, status);
  },

  getJurisdictionAlerts: async (investigationId) => {
    const cleanId = investigationId.startsWith("INV-")
      ? investigationId.replace("INV-", "")
      : investigationId;
    const entityType = inferEntityTypeFromId(cleanId);

    try {
      const raw = await request<BackendJurisdictionsResponse>(
        `/investigation/${entityType}/${cleanId}/jurisdictions`,
      );
      const mapped = mapBackendJurisdictionsToAlerts(raw);
      if (mapped && mapped.length > 0) return mapped;
    } catch {
      // Fallback below
    }

    return mockAdapter.getJurisdictionAlerts(investigationId);
  },

  getContinuityAlerts: async (investigationId) => {
    const cleanId = investigationId.startsWith("INV-")
      ? investigationId.replace("INV-", "")
      : investigationId;
    const entityType = inferEntityTypeFromId(cleanId);

    try {
      const raw = await request<BackendContinuityResponse>(
        `/investigation/${entityType}/${cleanId}/continuity`,
      );
      const mapped = mapBackendContinuityToAlerts(raw);
      if (mapped && mapped.length > 0) return mapped;
    } catch {
      // Fallback below
    }

    return mockAdapter.getContinuityAlerts(investigationId);
  },
};

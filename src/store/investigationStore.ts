import { create } from "zustand";
import { api } from "@/api/client";
import { hopDistances } from "@/lib/graph";
import { INVESTIGATION_ID } from "@/mock/investigationData";
import type {
  ContinuityAlert,
  Entity,
  EvidenceBundle,
  GraphEdge,
  GraphNode,
  GraphPayload,
  IdentityMatch,
  InvestigationSummary,
  JurisdictionAlert,
  MatchReviewStatus,
  RelFilterGroup,
  SearchStatus,
  SearchType,
  TimelineEvent,
  WhatChangedInsight,
  WorkspaceFocus,
} from "@/types/nexus";

export interface InvestigationState {
  workspaceFocus: WorkspaceFocus;
  searchQuery: string;
  searchType: SearchType;
  searchStatus: SearchStatus;
  searchPhase: string | null;
  searchError: string | null;
  matches: Entity[];
  investigation: InvestigationSummary | null;
  focalEntityId: string | null;
  graph: GraphPayload | null;
  depth: 1 | 2 | 3;
  relFilters: RelFilterGroup[];
  timeFrom: string;
  timeTo: string;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  selectedEntity: Entity | null;
  selectedEdge: GraphEdge | null;
  evidence: EvidenceBundle | null;
  timeline: TimelineEvent[];
  whatChanged: WhatChangedInsight | null;
  identityMatches: IdentityMatch[];
  jurisdictionAlerts: JurisdictionAlert[];
  continuityAlerts: ContinuityAlert[];
  graphBusy: boolean;
  systemStatus: "ONLINE" | "DEGRADED";
  setWorkspaceFocus: (focus: WorkspaceFocus) => void;
  setSearchQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  setDepth: (depth: 1 | 2 | 3) => Promise<void>;
  toggleRelFilter: (group: RelFilterGroup) => Promise<void>;
  setTimeRange: (from: string, to: string) => Promise<void>;
  runSearch: (query?: string) => Promise<void>;
  selectMatch: (entityId: string) => Promise<void>;
  selectNode: (nodeId: string | null) => Promise<void>;
  selectEdge: (edgeId: string | null) => Promise<void>;
  reviewMatch: (matchId: string, status: MatchReviewStatus) => Promise<void>;
  loadInvestigation: () => Promise<void>;
  refreshGraph: () => Promise<void>;
}

const SEARCH_PHASES = [
  "RESOLVING CLUE",
  "NORMALIZING IDENTIFIER",
  "SEARCHING NETWORK",
  "BUILDING FOCAL GRAPH",
] as const;

async function loadContext(
  set: (partial: Partial<InvestigationState>) => void,
  focalId: string,
  selectedNodeId: string | null,
  selectedEdgeId: string | null,
) {
  const [timelineEvents, whatChanged, jurisdictionAlerts, continuityAlerts] = await Promise.all([
    api.getTimeline({ focalId }),
    api.getWhatChanged(focalId),
    api.getJurisdictionAlerts(focalId),
    api.getContinuityAlerts(focalId),
  ]);
  set({ timeline: timelineEvents, whatChanged, jurisdictionAlerts, continuityAlerts });

  if (selectedEdgeId) {
    const [edge, evidence] = await Promise.all([
      api.getEdge(selectedEdgeId),
      api.getEvidence({ edgeId: selectedEdgeId }),
    ]);
    set({ selectedEdge: edge, evidence, selectedEntity: null, identityMatches: [] });
    return;
  }
  if (selectedNodeId) {
    const [entity, evidence, identityMatches] = await Promise.all([
      api.getEntity(selectedNodeId),
      api.getEvidence({ entityId: selectedNodeId }),
      api.getIdentityMatches(selectedNodeId),
    ]);
    set({ selectedEntity: entity, evidence, identityMatches, selectedEdge: null });
  }
}

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  workspaceFocus: "investigation",
  searchQuery: "",
  searchType: "auto",
  searchStatus: "idle",
  searchPhase: null,
  searchError: null,
  matches: [],
  investigation: null,
  focalEntityId: null,
  graph: null,
  depth: 1,
  relFilters: [],
  timeFrom: "2026-01-01",
  timeTo: "2026-06-30",
  selectedNodeId: null,
  selectedEdgeId: null,
  selectedEntity: null,
  selectedEdge: null,
  evidence: null,
  timeline: [],
  whatChanged: null,
  identityMatches: [],
  jurisdictionAlerts: [],
  continuityAlerts: [],
  graphBusy: false,
  systemStatus: "ONLINE",

  setWorkspaceFocus: (workspaceFocus) => set({ workspaceFocus }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchType: (searchType) => set({ searchType }),

  loadInvestigation: async () => {
    const investigation = await api.getInvestigation(INVESTIGATION_ID);
    set({ investigation });
  },

  refreshGraph: async () => {
    const { focalEntityId, depth, relFilters, timeFrom, timeTo, selectedNodeId, selectedEdgeId } =
      get();
    if (!focalEntityId) return;
    set({ graphBusy: true });
    try {
      const graph = await api.getGraph({
        focalId: focalEntityId,
        depth,
        relTypes: relFilters.length ? relFilters : undefined,
        from: timeFrom,
        to: timeTo,
      });
      set({ graph, graphBusy: false });
      await loadContext(set, focalEntityId, selectedNodeId, selectedEdgeId);
    } catch {
      set({ graphBusy: false, systemStatus: "DEGRADED" });
    }
  },

  setDepth: async (depth) => {
    set({ depth });
    await get().refreshGraph();
  },

  toggleRelFilter: async (group) => {
    const current = get().relFilters;
    const relFilters = current.includes(group)
      ? current.filter((g) => g !== group)
      : [...current, group];
    set({ relFilters });
    await get().refreshGraph();
  },

  setTimeRange: async (timeFrom, timeTo) => {
    set({ timeFrom, timeTo });
    await get().refreshGraph();
  },

  runSearch: async (query) => {
    const q = (query ?? get().searchQuery).trim();
    set({
      searchQuery: q,
      searchStatus: "searching",
      searchError: null,
      searchPhase: SEARCH_PHASES[0],
      workspaceFocus: "investigation",
    });
    if (!q) {
      set({ searchStatus: "idle", searchPhase: null });
      return;
    }
    try {
      set({ searchPhase: SEARCH_PHASES[1] });
      const result = await api.search(q, get().searchType);
      set({ searchPhase: SEARCH_PHASES[2] });
      if (result.matches.length === 0) {
        set({ searchStatus: "empty", matches: [], searchPhase: null, graph: null, focalEntityId: null });
        return;
      }
      if (result.matches.length > 1) {
        set({
          searchStatus: "multiple",
          matches: result.matches.map((m) => m.entity),
          searchPhase: null,
        });
        return;
      }
      set({ searchPhase: SEARCH_PHASES[3], matches: result.matches.map((m) => m.entity) });
      await get().selectMatch(result.matches[0].entity.id);
    } catch (error) {
      set({
        searchStatus: "error",
        searchPhase: null,
        searchError: error instanceof Error ? error.message : "Search failed",
      });
    }
  },

  selectMatch: async (entityId) => {
    set({
      focalEntityId: entityId,
      selectedNodeId: entityId,
      selectedEdgeId: null,
      depth: 1,
      searchStatus: "found",
      searchPhase: "BUILDING FOCAL GRAPH",
    });
    try {
      const investigation = await api.getInvestigation(entityId);
      set({ investigation: { ...investigation, focalEntityId: entityId } });
    } catch {
      // Fallback resilience
    }
    await get().refreshGraph();
    set({ searchPhase: null });
  },

  selectNode: async (nodeId) => {
    set({ selectedNodeId: nodeId, selectedEdgeId: null, selectedEdge: null });
    const focal = get().focalEntityId;
    if (!nodeId || !focal) {
      set({ selectedEntity: null, evidence: null, identityMatches: [] });
      return;
    }
    await loadContext(set, focal, nodeId, null);
  },

  selectEdge: async (edgeId) => {
    set({ selectedEdgeId: edgeId, selectedNodeId: null, selectedEntity: null, identityMatches: [] });
    const focal = get().focalEntityId;
    if (!edgeId || !focal) {
      set({ selectedEdge: null, evidence: null });
      return;
    }
    await loadContext(set, focal, null, edgeId);
  },

  reviewMatch: async (matchId, status) => {
    const updated = await api.reviewIdentityMatch(matchId, status);
    set({
      identityMatches: get().identityMatches.map((m) => (m.id === matchId ? updated : m)),
    });
  },
}));

export function graphHops(graph: GraphPayload | null): Map<string, number> {
  if (!graph) return new Map();
  return hopDistances(graph.focalId, graph.edges);
}

export function findNode(graph: GraphPayload | null, id: string | null): GraphNode | undefined {
  if (!graph || !id) return undefined;
  return graph.nodes.find((n) => n.id === id);
}

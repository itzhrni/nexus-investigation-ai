import { create } from "zustand";
import { api } from "@/api/client";
import { hopDistances } from "@/lib/graph";
import { CASES_CATALOG } from "@/mock/investigationData";
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
  availableCases: InvestigationSummary[];
  activeCaseId: string;
  focalEntityId: string | null;
  graph: GraphPayload | null;
  depth: 1 | 2 | 3 | 4 | 5;
  graphViewMode: "type" | "community";
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
  isOrbiting: boolean;
  systemStatus: "ONLINE" | "DEGRADED";
  setWorkspaceFocus: (focus: WorkspaceFocus) => void;
  setSearchQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  setDepth: (depth: 1 | 2 | 3 | 4 | 5) => Promise<void>;
  toggleGraphViewMode: () => void;
  toggleRelFilter: (group: RelFilterGroup) => Promise<void>;
  setTimeRange: (from: string, to: string) => Promise<void>;
  runSearch: (query?: string) => Promise<void>;
  selectMatch: (entityId: string) => Promise<void>;
  selectNode: (nodeId: string | null) => Promise<void>;
  selectEdge: (edgeId: string | null) => Promise<void>;
  reviewMatch: (matchId: string, status: MatchReviewStatus) => Promise<void>;
  loadInvestigation: () => Promise<void>;
  switchCase: (caseId: string) => Promise<void>;
  toggleOrbit: () => void;
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
  availableCases: Object.values(CASES_CATALOG),
  activeCaseId: "CASE-142",
  focalEntityId: null,
  graph: null,
  depth: 1,
  graphViewMode: "type",
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
  isOrbiting: false,
  systemStatus: "ONLINE",

  toggleOrbit: () => set((s) => ({ isOrbiting: !s.isOrbiting })),
  toggleGraphViewMode: () =>
    set((s) => ({ graphViewMode: s.graphViewMode === "type" ? "community" : "type" })),
  setWorkspaceFocus: (workspaceFocus) => set({ workspaceFocus }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchType: (searchType) => set({ searchType }),

  loadInvestigation: async () => {
    const caseId = get().activeCaseId || "CASE-142";
    let focalId = get().focalEntityId || "V-TN38AB1234";
    try {
      const [investigation, dynamicCases] = await Promise.all([
        api.getInvestigation(caseId),
        api.getAllCases ? api.getAllCases() : Promise.resolve(Object.values(CASES_CATALOG)),
      ]);
      focalId = get().focalEntityId || investigation?.focalEntityId || "V-TN38AB1234";
      set({
        investigation,
        activeCaseId: caseId,
        focalEntityId: focalId,
        selectedNodeId: focalId,
        availableCases: dynamicCases && dynamicCases.length > 0 ? dynamicCases : Object.values(CASES_CATALOG),
      });
    } catch {
      set({
        systemStatus: "DEGRADED",
        activeCaseId: caseId,
        focalEntityId: focalId,
        selectedNodeId: focalId,
        availableCases: Object.values(CASES_CATALOG),
      });
    } finally {
      await get().refreshGraph();
    }
  },

  switchCase: async (caseId: string) => {
    set({ graphBusy: true, activeCaseId: caseId });
    try {
      const investigation = await api.getInvestigation(caseId);
      const focalId = investigation.focalEntityId || "V-TN38AB1234";
      set({
        investigation,
        activeCaseId: caseId,
        focalEntityId: focalId,
        selectedNodeId: focalId,
        selectedEdgeId: null,
        selectedEdge: null,
        depth: 1,
        relFilters: [],
      });
      await get().refreshGraph();
    } catch {
      set({ systemStatus: "DEGRADED" });
    } finally {
      set({ graphBusy: false });
    }
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
    const currentFocus = get().workspaceFocus;
    set({
      searchQuery: q,
      searchStatus: "searching",
      searchError: null,
      searchPhase: SEARCH_PHASES[0],
      workspaceFocus: currentFocus,
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
        set({ searchStatus: "empty", matches: [], searchPhase: null, workspaceFocus: "search" });
        return;
      }
      const matchedEntities = result.matches.map((m) => m.entity);
      if (matchedEntities.length > 1) {
        set({
          searchStatus: "multiple",
          matches: matchedEntities,
          searchPhase: null,
          workspaceFocus: "search",
        });
        return;
      }
      set({ searchPhase: SEARCH_PHASES[3], matches: matchedEntities });
      if (currentFocus !== "search") {
        await get().selectMatch(matchedEntities[0].id);
      } else {
        set({ searchStatus: "multiple", searchPhase: null, workspaceFocus: "search" });
      }
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
      workspaceFocus: "investigation",
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

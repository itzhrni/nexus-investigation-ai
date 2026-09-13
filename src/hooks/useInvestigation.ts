import { useInvestigationStore } from "@/store/investigationStore";

export function useSearch() {
  return useInvestigationStore((s) => ({
    searchQuery: s.searchQuery,
    searchType: s.searchType,
    searchStatus: s.searchStatus,
    searchPhase: s.searchPhase,
    searchError: s.searchError,
    matches: s.matches,
    setSearchQuery: s.setSearchQuery,
    setSearchType: s.setSearchType,
    runSearch: s.runSearch,
    selectMatch: s.selectMatch,
  }));
}

export function useGraphSession() {
  return useInvestigationStore((s) => ({
    graph: s.graph,
    depth: s.depth,
    relFilters: s.relFilters,
    selectedNodeId: s.selectedNodeId,
    selectedEdgeId: s.selectedEdgeId,
    graphBusy: s.graphBusy,
    setDepth: s.setDepth,
    toggleRelFilter: s.toggleRelFilter,
    selectNode: s.selectNode,
    selectEdge: s.selectEdge,
    refreshGraph: s.refreshGraph,
  }));
}

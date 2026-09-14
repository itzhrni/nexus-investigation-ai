import type { GraphEdge, GraphNode, GraphPayload, RelFilterGroup, RelationshipType } from "@/types/nexus";

const REL_GROUPS: Record<RelFilterGroup, RelationshipType[]> = {
  communication: ["CALLED", "MET"],
  financial: ["TRANSFERRED"],
  vehicle: ["OWNS", "USED", "ASSOCIATED_WITH"],
  location: ["SEEN_AT", "LOCATED_AT"],
  case: ["INVOLVED_IN", "APPEARED_IN", "CONNECTED_TO", "WORKS_FOR"],
};

export function edgeEndpoints(edge: GraphEdge): { source: string; target: string } {
  const source = typeof edge.source === "string" ? edge.source : String(edge.source);
  const target = typeof edge.target === "string" ? edge.target : String(edge.target);
  return { source, target };
}

export function hopDistances(focalId: string, edges: GraphEdge[]): Map<string, number> {
  const adj = new Map<string, Set<string>>();
  for (const edge of edges) {
    const { source, target } = edgeEndpoints(edge);
    if (!adj.has(source)) adj.set(source, new Set());
    if (!adj.has(target)) adj.set(target, new Set());
    adj.get(source)!.add(target);
    adj.get(target)!.add(source);
  }
  const dist = new Map<string, number>([[focalId, 0]]);
  const queue = [focalId];
  while (queue.length) {
    const cur = queue.shift()!;
    const d = dist.get(cur)!;
    for (const next of adj.get(cur) ?? []) {
      if (!dist.has(next)) {
        dist.set(next, d + 1);
        queue.push(next);
      }
    }
  }
  return dist;
}

function edgeInTimeRange(edge: GraphEdge, from?: string, to?: string): boolean {
  if (!from && !to) return true;
  const start = edge.validFrom ?? "0000-01-01";
  const end = edge.validTo ?? "9999-12-31";
  if (from && end < from) return false;
  if (to && start > to) return false;
  return true;
}

export function filterGraph(
  payload: GraphPayload,
  options: {
    depth: 1 | 2 | 3;
    relGroups?: RelFilterGroup[];
    from?: string;
    to?: string;
    maxNodes?: number;
  },
): GraphPayload & { hops: Map<string, number> } {
  const relAllow =
    options.relGroups && options.relGroups.length > 0
      ? new Set(options.relGroups.flatMap((g) => REL_GROUPS[g]))
      : null;

  const timeEdges = payload.edges.filter((e) => edgeInTimeRange(e, options.from, options.to));
  const relEdges = relAllow ? timeEdges.filter((e) => relAllow.has(e.type)) : timeEdges;
  const hops = hopDistances(payload.focalId, relEdges);
  const allowedIds = new Set(
    [...hops.entries()].filter(([, d]) => d <= options.depth).map(([id]) => id),
  );
  if (!allowedIds.has(payload.focalId)) allowedIds.add(payload.focalId);

  let nodes = payload.nodes.filter((n) => allowedIds.has(n.id));
  const max = options.maxNodes ?? 150;
  if (nodes.length > max) {
    nodes = [...nodes]
      .sort((a, b) => (hops.get(a.id) ?? 99) - (hops.get(b.id) ?? 99))
      .slice(0, max);
  }
  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges = relEdges.filter((e) => {
    const { source, target } = edgeEndpoints(e);
    return nodeIds.has(source) && nodeIds.has(target);
  });

  return { nodes, edges, focalId: payload.focalId, hops };
}

export function neighborhood(nodeId: string, edges: GraphEdge[]): Set<string> {
  const ids = new Set<string>([nodeId]);
  for (const edge of edges) {
    const { source, target } = edgeEndpoints(edge);
    if (source === nodeId) ids.add(target);
    if (target === nodeId) ids.add(source);
  }
  return ids;
}

export function toForceGraphData(
  nodes: GraphNode[],
  edges: GraphEdge[],
): { nodes: GraphNode[]; links: GraphEdge[] } {
  return { nodes: nodes.map((n) => ({ ...n })), links: edges.map((e) => ({ ...e })) };
}

export { REL_GROUPS };

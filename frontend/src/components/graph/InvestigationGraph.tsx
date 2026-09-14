import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph3D, { type ForceGraphMethods } from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import * as THREE from "three";
import { hopDistances, neighborhood, toForceGraphData } from "@/lib/graph";
import { ENTITY_COLORS } from "@/lib/cn";
import { useInvestigationStore } from "@/store/investigationStore";
import type { GraphEdge, GraphNode } from "@/types/nexus";

type FGNode = GraphNode & { hop: number; x?: number; y?: number; z?: number };
type FGLink = GraphEdge & { source: string | FGNode; target: string | FGNode };

function endpointId(end: string | FGNode): string {
  return typeof end === "string" ? end : end.id;
}

function nodeColor(node: FGNode, selectedId: string | null, neighborIds: Set<string> | null): string {
  const base = ENTITY_COLORS[node.type] ?? "#8b9cb3";
  if (!selectedId || !neighborIds) return base;
  return neighborIds.has(node.id) ? base : "#243040";
}

export function InvestigationGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods | null>(null);
  const [size, setSize] = useState({ width: 800, height: 500 });
  const graph = useInvestigationStore((s) => s.graph);
  const selectedNodeId = useInvestigationStore((s) => s.selectedNodeId);
  const selectedEdgeId = useInvestigationStore((s) => s.selectedEdgeId);
  const selectNode = useInvestigationStore((s) => s.selectNode);
  const selectEdge = useInvestigationStore((s) => s.selectEdge);
  const graphBusy = useInvestigationStore((s) => s.graphBusy);

  const hops = useMemo(
    () => (graph ? hopDistances(graph.focalId, graph.edges) : new Map<string, number>()),
    [graph],
  );

  const data = useMemo(() => {
    if (!graph) return { nodes: [] as FGNode[], links: [] as GraphEdge[] };
    const mapped = toForceGraphData(
      graph.nodes.map((n) => ({
        ...n,
        hop: hops.get(n.id) ?? 3,
        val: n.id === graph.focalId ? 22 : hops.get(n.id) === 1 ? 12 : hops.get(n.id) === 2 ? 7 : 4,
      })),
      graph.edges,
    );
    return mapped as { nodes: FGNode[]; links: GraphEdge[] };
  }, [graph, hops]);

  const neighborIds = useMemo(() => {
    if (!graph) return null;
    if (selectedNodeId) return neighborhood(selectedNodeId, graph.edges);
    if (selectedEdgeId) {
      const edge = graph.edges.find((e) => e.id === selectedEdgeId);
      if (!edge) return null;
      return new Set([edge.source, edge.target]);
    }
    return null;
  }, [graph, selectedNodeId, selectedEdgeId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    });
    obs.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!graph || data.nodes.length === 0) return;
    const t = window.setTimeout(() => fgRef.current?.zoomToFit(400, 80), 500);
    return () => window.clearTimeout(t);
  }, [graph?.focalId, graph?.nodes.length, data.nodes.length]);

  useEffect(() => {
    if (!selectedNodeId) return;
    const node = data.nodes.find((n) => n.id === selectedNodeId);
    if (!node || node.x == null) return;
    const dist = 140;
    fgRef.current?.cameraPosition(
      { x: node.x, y: node.y ?? 0, z: (node.z ?? 0) + dist },
      { x: node.x, y: node.y ?? 0, z: node.z ?? 0 },
      600,
    );
  }, [selectedNodeId, data.nodes]);

  return (
    <div ref={containerRef} className="relative h-full min-h-[320px] w-full overflow-hidden bg-nexus-bg">
      {graph && data.nodes.length > 0 ? (
        <ForceGraph3D
          ref={fgRef}
          width={size.width}
          height={size.height}
          graphData={data}
          backgroundColor="#07090c"
          showNavInfo={false}
          warmupTicks={30}
          cooldownTicks={80}
          enableNodeDrag
          nodeRelSize={4}
          nodeLabel={(n) => {
            const node = n as FGNode;
            return `${node.label} · ${node.type} · hop ${node.hop}`;
          }}
          nodeColor={(n) => nodeColor(n as FGNode, selectedNodeId, neighborIds)}
          nodeThreeObject={(n) => {
            const node = n as FGNode;
            const group = new THREE.Group();
            const hop = node.hop;
            const radius = hop === 0 ? 7 : hop === 1 ? 4.6 : hop === 2 ? 3.2 : 2.2;
            const highlighted = !neighborIds || neighborIds.has(node.id);
            const color = highlighted ? ENTITY_COLORS[node.type] : "#1b2530";
            const geom = new THREE.SphereGeometry(radius, 16, 16);
            const mat = new THREE.MeshLambertMaterial({
              color,
              emissive: node.hop === 0 ? color : "#000000",
              emissiveIntensity: node.hop === 0 ? 0.35 : selectedNodeId === node.id ? 0.25 : 0,
              transparent: true,
              opacity: highlighted ? 1 : 0.18,
            });
            group.add(new THREE.Mesh(geom, mat));
            const showLabel = hop <= 1 || selectedNodeId === node.id || neighborIds?.has(node.id);
            if (showLabel && highlighted) {
              const sprite = new SpriteText(node.label);
              sprite.color = hop === 0 ? "#3dd6f5" : "#d5dee8";
              sprite.textHeight = hop === 0 ? 4.2 : 2.6;
              sprite.fontFace = "Inter";
              sprite.position.y = radius + 5;
              group.add(sprite);
            }
            return group;
          }}
          linkColor={(l) => {
            const link = l as FGLink;
            if (selectedEdgeId && link.id === selectedEdgeId) return "#3dd6f5";
            if (selectedNodeId) {
              const s = endpointId(link.source);
              const t = endpointId(link.target);
              return s === selectedNodeId || t === selectedNodeId ? "#5eead4" : "#1b2733";
            }
            return "#2a3a4d";
          }}
          linkWidth={(l) => ((l as FGLink).id === selectedEdgeId ? 2.2 : 0.7)}
          linkOpacity={0.85}
          linkDirectionalArrowLength={(l) => ((l as GraphEdge).directed ? 4 : 0)}
          linkDirectionalArrowRelPos={1}
          linkDirectionalParticles={(l) => ((l as FGLink).id === selectedEdgeId ? 4 : 0)}
          linkDirectionalParticleWidth={1.4}
          linkLabel={(l) => {
            const link = l as GraphEdge;
            return `${link.type}${link.confidence != null ? ` · ${link.confidence}%` : ""}`;
          }}
          onNodeClick={(n) => {
            void selectNode((n as FGNode).id);
          }}
          onLinkClick={(l) => {
            void selectEdge((l as GraphEdge).id);
          }}
          onBackgroundClick={() => {
            void selectNode(null);
          }}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="max-w-md text-center">
            <div className="text-[11px] tracking-[0.28em] text-nexus-cyan">NEXUS GRAPH</div>
            <h2 className="mt-2 text-xl font-medium">Awaiting a clue</h2>
            <p className="mt-2 text-sm text-nexus-muted">
              Enter any identifier — person, phone, vehicle, case, or location — to build the focal investigation
              network.
            </p>
            <p className="mt-4 font-mono text-xs text-nexus-cyan/80">Try TN38AB1234</p>
          </div>
        </div>
      )}
      {graphBusy && (
        <div className="pointer-events-none absolute right-4 top-4 rounded border border-nexus-line bg-black/50 px-3 py-1 font-mono text-[10px] text-nexus-cyan">
          UPDATING GRAPH
        </div>
      )}
    </div>
  );
}

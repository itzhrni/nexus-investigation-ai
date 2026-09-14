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
  const isOrbiting = useInvestigationStore((s) => s.isOrbiting);
  const focus = useInvestigationStore((s) => s.workspaceFocus);

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
        val: n.id === graph.focalId ? 24 : hops.get(n.id) === 1 ? 14 : hops.get(n.id) === 2 ? 8 : 5,
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
    const updateSize = () => {
      if (el.clientWidth > 0 && el.clientHeight > 0) {
        setSize({ width: el.clientWidth, height: el.clientHeight });
      }
    };
    updateSize();
    const obs = new ResizeObserver(updateSize);
    obs.observe(el);
    window.addEventListener("resize", updateSize);
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // When workspace focus changes (e.g. user clicks "Network" or "Investigation"), recalculate canvas size and zoom to fit
  useEffect(() => {
    if (focus === "investigation" || focus === "network") {
      const el = containerRef.current;
      if (el && el.clientWidth > 0 && el.clientHeight > 0) {
        setSize({ width: el.clientWidth, height: el.clientHeight });
      }
      const t1 = setTimeout(() => {
        if (el && el.clientWidth > 0 && el.clientHeight > 0) {
          setSize({ width: el.clientWidth, height: el.clientHeight });
        }
        fgRef.current?.zoomToFit(400, 80);
      }, 80);
      const t2 = setTimeout(() => {
        if (el && el.clientWidth > 0 && el.clientHeight > 0) {
          setSize({ width: el.clientWidth, height: el.clientHeight });
        }
        fgRef.current?.zoomToFit(400, 80);
      }, 260);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [focus]);

  // Zoom to fit on initial load or case change
  useEffect(() => {
    if (!graph || data.nodes.length === 0) return;
    const t = window.setTimeout(() => fgRef.current?.zoomToFit(500, 80), 300);
    return () => window.clearTimeout(t);
  }, [graph?.focalId, data.nodes.length]);

  // Smooth camera glide to selected node
  useEffect(() => {
    if (!selectedNodeId) return;
    const node = data.nodes.find((n) => n.id === selectedNodeId);
    if (!node || node.x == null) return;
    const dist = 140;
    fgRef.current?.cameraPosition(
      { x: node.x, y: (node.y ?? 0) + 15, z: (node.z ?? 0) + dist },
      { x: node.x, y: node.y ?? 0, z: node.z ?? 0 },
      600,
    );
  }, [selectedNodeId, data.nodes]);

  // Dynamic Surveillance Auto-Orbit Mode
  useEffect(() => {
    if (!isOrbiting) return;
    let angle = 0;
    const radius = 240;
    let animId: number;

    const tick = () => {
      angle += 0.0025;
      if (fgRef.current) {
        fgRef.current.cameraPosition({
          x: radius * Math.sin(angle),
          z: radius * Math.cos(angle),
          y: 45 * Math.sin(angle * 0.5) + 35,
        });
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isOrbiting]);

  const graphWidth =
    size.width > 50
      ? size.width
      : typeof window !== "undefined"
      ? Math.max(window.innerWidth - 240, 600)
      : 800;
  const graphHeight =
    size.height > 50
      ? size.height
      : typeof window !== "undefined"
      ? Math.max(window.innerHeight - 140, 400)
      : 500;

  return (
    <div ref={containerRef} className="relative h-full min-h-[320px] w-full overflow-hidden bg-nexus-bg">
      {graph && data.nodes.length > 0 ? (
        <ForceGraph3D
          ref={fgRef}
          width={graphWidth}
          height={graphHeight}
          graphData={data}
          backgroundColor="#07090c"
          showNavInfo={false}
          warmupTicks={0}
          cooldownTicks={120}
          d3VelocityDecay={0.3}
          d3AlphaDecay={0.02}
          enableNodeDrag
          nodeRelSize={4}
          nodeLabel={(n) => {
            const node = n as FGNode;
            return `${node.label} · ${node.type.toUpperCase()}${node.sublabel ? ` (${node.sublabel})` : ""}`;
          }}
          nodeColor={(n) => nodeColor(n as FGNode, selectedNodeId, neighborIds)}
          nodeThreeObject={(n) => {
            const node = n as FGNode;
            const group = new THREE.Group();
            const hop = node.hop ?? 3;
            const radius = hop === 0 ? 7.2 : hop === 1 ? 4.8 : hop === 2 ? 3.4 : 2.4;
            const highlighted = !neighborIds || neighborIds.has(node.id);
            const color = highlighted ? (ENTITY_COLORS[node.type] ?? "#8b9cb3") : "#1b2530";
            const geom = new THREE.SphereGeometry(radius, 16, 16);
            const mat = new THREE.MeshLambertMaterial({
              color,
              emissive: hop === 0 ? color : node.type === "account" ? "#10b981" : "#000000",
              emissiveIntensity: hop === 0 ? 0.4 : node.type === "account" ? 0.25 : selectedNodeId === node.id ? 0.35 : 0,
              transparent: true,
              opacity: highlighted ? 1 : 0.2,
            });
            group.add(new THREE.Mesh(geom, mat));

            // Pulsing outer halo ring on focal or selected node
            if ((hop === 0 || selectedNodeId === node.id) && highlighted) {
              const haloGeom = new THREE.RingGeometry(radius + 1.2, radius + 2.8, 32);
              const haloMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(color),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.55,
              });
              const haloMesh = new THREE.Mesh(haloGeom, haloMat);
              haloMesh.rotation.x = Math.PI / 2;
              group.add(haloMesh);
            }

            const showLabel = hop <= 1 || selectedNodeId === node.id || neighborIds?.has(node.id);
            if (showLabel && highlighted) {
              const sprite = new SpriteText(node.label || node.id || "");
              sprite.color = hop === 0 ? "#3dd6f5" : node.type === "account" ? "#34d399" : "#d5dee8";
              sprite.textHeight = hop === 0 ? 4.4 : 2.8;
              sprite.fontFace = "Inter, sans-serif";
              sprite.position.y = radius + 5.5;
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
              if (s === selectedNodeId || t === selectedNodeId) {
                return link.type === "TRANSFERRED" ? "#34d399" : "#5eead4";
              }
              return "#15202c";
            }
            if (link.type === "TRANSFERRED") return "#059669";
            if (link.type === "CALLED") return "#0284c7";
            if (link.type === "OWNS") return "#d97706";
            return "#27384a";
          }}
          linkWidth={(l) => {
            const link = l as FGLink;
            if (link.id === selectedEdgeId) return 2.8;
            if (link.type === "TRANSFERRED") return 1.8;
            return 0.8;
          }}
          linkOpacity={0.88}
          linkDirectionalArrowLength={(l: any) => ((l as GraphEdge).directed ? 4.5 : 0)}
          linkDirectionalArrowRelPos={1}
          linkDirectionalParticles={(l: any) => {
            const link = l as FGLink;
            if (selectedEdgeId && link.id === selectedEdgeId) return 6;
            if (link.type === "TRANSFERRED") return 4;
            if (link.type === "CALLED") return 3;
            if (link.type === "OWNS" || link.type === "USED" || link.type === "SEEN_AT") return 2;
            return 1;
          }}
          linkDirectionalParticleWidth={((l: any) => {
            const link = l as FGLink;
            if (selectedEdgeId && link.id === selectedEdgeId) return 2.6;
            if (link.type === "TRANSFERRED") return 2.0;
            if (link.type === "CALLED") return 1.6;
            return 1.2;
          }) as any}
          linkDirectionalParticleSpeed={((l: any) => {
            const link = l as FGLink;
            if (selectedEdgeId && link.id === selectedEdgeId) return 0.012;
            if (link.type === "TRANSFERRED") return 0.007;
            if (link.type === "CALLED") return 0.009;
            return 0.004;
          }) as any}
          linkDirectionalParticleColor={((l: any) => {
            const link = l as FGLink;
            if (selectedEdgeId && link.id === selectedEdgeId) return "#38bdf8";
            if (link.type === "TRANSFERRED") return "#34d399";
            if (link.type === "CALLED") return "#38bdf8";
            if (link.type === "SEEN_AT" || link.type === "LOCATED_AT") return "#fbbf24";
            return "#818cf8";
          }) as any}
          linkLabel={(l) => {
            const link = l as GraphEdge;
            const amountText = link.amount ? ` · ₹${link.amount.toLocaleString("en-IN")}` : "";
            return `${link.type}${amountText}${link.confidence != null ? ` · ${link.confidence}%` : ""}`;
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
              Enter any identifier — person, phone, vehicle, account, case, or location — to build the focal investigation
              network.
            </p>
            <p className="mt-4 font-mono text-xs text-nexus-cyan/80">Try TN38AB1234 or ACC-001</p>
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

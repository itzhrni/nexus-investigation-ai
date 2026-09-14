import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph3D, { type ForceGraphMethods } from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import * as THREE from "three";
import { hopDistances, neighborhood, toForceGraphData } from "@/lib/graph";
import { ENTITY_COLORS } from "@/lib/cn";
import { useInvestigationStore } from "@/store/investigationStore";
import type { GraphEdge, GraphNode } from "@/types/nexus";

type FGNode = GraphNode & {
  hop: number;
  val: number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
};
type FGLink = GraphEdge & { source: string | FGNode; target: string | FGNode };

function endpointId(end: string | FGNode): string {
  return typeof end === "string" ? end : end.id;
}

// Clean badge format: ENTITY NAME \n TYPE · ID
function formatNodeLabel(node: FGNode): string {
  const name = node.label || node.id;
  const idPart = node.id && !name.includes(node.id) ? ` · ${node.id}` : "";
  return `${name}\n${node.type.toUpperCase()}${idPart}`;
}

const LINK_STYLE_CONFIG: Record<string, { line: string; particle: string; bright: string }> = {
  TRANSFERRED: { line: "#059669", particle: "#10b981", bright: "#34d399" }, // FINANCIAL: green
  CALLED: { line: "#0284c7", particle: "#38bdf8", bright: "#7dd3fc" },      // COMMUNICATION: cyan/blue
  MET: { line: "#0284c7", particle: "#38bdf8", bright: "#7dd3fc" },         // COMMUNICATION: cyan/blue
  OWNS: { line: "#d97706", particle: "#f59e0b", bright: "#fbbf24" },        // VEHICLE: amber
  USED: { line: "#d97706", particle: "#f59e0b", bright: "#fbbf24" },        // VEHICLE: amber
  ASSOCIATED_WITH: { line: "#b45309", particle: "#f59e0b", bright: "#fbbf24" },
  SEEN_AT: { line: "#ca8a04", particle: "#eab308", bright: "#fde047" },     // LOCATION: yellow
  LOCATED_AT: { line: "#ca8a04", particle: "#eab308", bright: "#fde047" },  // LOCATION: yellow
  INVOLVED_IN: { line: "#7c3aed", particle: "#c084fc", bright: "#e879f9" }, // CASE/CRIME: muted red/purple
  APPEARED_IN: { line: "#7c3aed", particle: "#c084fc", bright: "#e879f9" },
  CONNECTED_TO: { line: "#475569", particle: "#94a3b8", bright: "#cbd5e1" },
  WORKS_FOR: { line: "#475569", particle: "#94a3b8", bright: "#cbd5e1" },
};

function getLinkStyle(type: string) {
  return LINK_STYLE_CONFIG[type] ?? { line: "#334155", particle: "#94a3b8", bright: "#cbd5e1" };
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
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const isMountedRef = useRef(false);
  const needsFitRef = useRef(true);

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
    if (!graph || !graph.nodes || graph.nodes.length === 0) {
      return { nodes: [] as FGNode[], links: [] as GraphEdge[] };
    }
    const mapped = toForceGraphData(
      graph.nodes.map((n) => {
        const hop = hops.get(n.id) ?? 3;
        const isFocal = n.id === graph.focalId || hop === 0;
        return {
          ...n,
          hop,
          val: isFocal ? 28 : hop === 1 ? 16 : hop === 2 ? 10 : 6,
        };
      }),
      graph.edges || [],
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

  // When workspace focus changes, recalculate canvas size and gently fit
  useEffect(() => {
    if (focus === "investigation" || focus === "network") {
      const el = containerRef.current;
      if (el && el.clientWidth > 0 && el.clientHeight > 0) {
        setSize({ width: el.clientWidth, height: el.clientHeight });
      }
      const t = setTimeout(() => {
        fgRef.current?.zoomToFit(500, 90);
      }, 120);
      return () => clearTimeout(t);
    }
  }, [focus]);

  // Configure D3 forces for hierarchical spacing and repulsion
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg || data.nodes.length === 0) return;

    // Repulsion force (charge)
    const charge = fg.d3Force("charge") as any;
    if (charge) {
      charge.strength((node: any) => {
        const hop = node?.hop ?? 2;
        // Focal node has dominant negative charge to push out all neighbors radially
        if (hop === 0) return -550;
        // Direct connections have strong repulsion to stay clearly separated
        if (hop === 1) return -320;
        // Secondary nodes push outward
        if (hop === 2) return -190;
        // Outer network
        return -120;
      });
      charge.distanceMin(25); // Prevents overlapping spheres
      charge.distanceMax(950);
    }

    // Link distance hierarchy
    const link = fg.d3Force("link") as any;
    if (link) {
      link.distance((l: any) => {
        const sHop = l.source?.hop ?? 1;
        const tHop = l.target?.hop ?? 1;
        const maxHop = Math.max(sHop, tHop);
        // Direct connections have ample breathing room for labels
        if (maxHop <= 1) return 85;
        // Secondary connections push outward into outer orbital layer
        if (maxHop === 2) return 145;
        // Outer network spread
        return 210;
      });
      link.strength((l: any) => {
        const sHop = l.source?.hop ?? 1;
        const tHop = l.target?.hop ?? 1;
        const maxHop = Math.max(sHop, tHop);
        if (maxHop <= 1) return 0.75;
        if (maxHop === 2) return 0.5;
        return 0.35;
      });
    }

    // On subsequent updates (depth change, filters, search), reheat simulation smoothly
    if (isMountedRef.current) {
      needsFitRef.current = true;
      (fg as any).d3ReheatSimulation?.();
    } else {
      isMountedRef.current = true;
      needsFitRef.current = true;
    }
  }, [graph?.focalId, data.nodes.length, data.links.length]);

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
  }, [selectedNodeId]);

  // Dynamic Surveillance Auto-Orbit Mode
  useEffect(() => {
    if (!isOrbiting) return;
    const pos = fgRef.current?.cameraPosition() as { x: number; y: number; z: number } | undefined;
    const r = pos ? Math.sqrt(pos.x * pos.x + pos.z * pos.z) : 260;
    const radius = Math.max(r, 180);
    let angle = pos ? Math.atan2(pos.x, pos.z) : 0;
    const currentY = pos?.y ?? 35;
    let animId: number;

    const tick = () => {
      angle += 0.0025;
      if (fgRef.current) {
        fgRef.current.cameraPosition(
          {
            x: radius * Math.sin(angle),
            z: radius * Math.cos(angle),
            y: currentY + 10 * Math.sin(angle * 0.5),
          },
          { x: 0, y: 0, z: 0 },
        );
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
          numDimensions={3}
          warmupTicks={160}
          cooldownTicks={180}
          d3VelocityDecay={0.25}
          d3AlphaDecay={0.018}
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
            const isFocal = hop === 0 || node.id === graph?.focalId;
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isNeighborOfSelected = neighborIds?.has(node.id) ?? false;

            // 6. Node Sizes based on hierarchy
            const radius = isFocal ? 7.5 : hop === 1 ? 4.8 : hop === 2 ? 3.5 : 2.4;
            const highlighted = !neighborIds || neighborIds.has(node.id);
            const color = highlighted ? (ENTITY_COLORS[node.type] ?? "#8b9cb3") : "#1b2530";

            const geom = new THREE.SphereGeometry(radius, 20, 20);
            const mat = new THREE.MeshLambertMaterial({
              color,
              emissive: isFocal ? "#06b6d4" : isSelected ? color : node.type === "account" ? "#10b981" : "#000000",
              emissiveIntensity: isFocal ? 0.45 : isSelected ? 0.35 : node.type === "account" ? 0.2 : 0,
              transparent: true,
              opacity: highlighted ? 1 : 0.25,
            });
            group.add(new THREE.Mesh(geom, mat));

            // 5. Subtle outer ring on focal or selected node
            if ((isFocal || isSelected) && highlighted) {
              const ringRadius = radius + (isFocal ? 1.8 : 1.4);
              const haloGeom = new THREE.RingGeometry(ringRadius, ringRadius + 1.2, 32);
              const haloMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(isFocal ? "#38bdf8" : color),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: isFocal ? 0.6 : 0.45,
              });
              const haloMesh = new THREE.Mesh(haloGeom, haloMat);
              haloMesh.rotation.x = Math.PI / 2;
              group.add(haloMesh);
            }

            // 7. Label Cleanup:
            // FOCAL: always visible
            // SELECTED: always visible
            // HOP 1: visible
            // HOP 2: visible on hover or selection (or neighbor of selected)
            // HOP 3: hidden unless hovered/selected
            let showLabel = false;
            if (isFocal || isSelected || isHovered) {
              showLabel = true;
            } else if (hop === 1) {
              showLabel = true;
            } else if (hop === 2) {
              showLabel = isNeighborOfSelected;
            }

            if (showLabel && highlighted) {
              const sprite = new SpriteText(formatNodeLabel(node));
              sprite.color = isFocal ? "#38bdf8" : isSelected ? "#5eead4" : hop === 1 ? "#e2e8f0" : "#cbd5e1";
              sprite.textHeight = isFocal ? 3.8 : isSelected ? 3.2 : hop === 1 ? 2.8 : 2.4;
              sprite.fontFace = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
              sprite.fontWeight = isFocal || isSelected ? "bold" : "500";
              sprite.backgroundColor = "rgba(6, 10, 16, 0.75)";
              sprite.borderColor = isFocal ? "rgba(56, 189, 248, 0.5)" : isSelected ? "rgba(94, 234, 212, 0.4)" : "rgba(30, 41, 59, 0.6)";
              sprite.borderWidth = 0.4;
              sprite.borderRadius = 2;
              sprite.padding = [2.5, 1.5];
              sprite.position.y = radius + (isFocal ? 6.2 : 4.8);
              group.add(sprite);
            }

            return group;
          }}
          linkColor={(l) => {
            const link = l as FGLink;
            const style = getLinkStyle(link.type);
            if (selectedEdgeId && link.id === selectedEdgeId) return "#38bdf8";
            if (selectedNodeId) {
              const s = endpointId(link.source);
              const t = endpointId(link.target);
              if (s === selectedNodeId || t === selectedNodeId) {
                return style.bright;
              }
              return "rgba(18, 26, 36, 0.4)";
            }
            if (graph?.focalId) {
              const s = endpointId(link.source);
              const t = endpointId(link.target);
              if (s === graph.focalId || t === graph.focalId) {
                return style.bright;
              }
            }
            return style.line;
          }}
          linkWidth={(l) => {
            const link = l as FGLink;
            if (selectedEdgeId && link.id === selectedEdgeId) return 2.8;
            if (selectedNodeId) {
              const s = endpointId(link.source);
              const t = endpointId(link.target);
              if (s === selectedNodeId || t === selectedNodeId) return 2.0;
              return 0.5;
            }
            if (graph?.focalId) {
              const s = endpointId(link.source);
              const t = endpointId(link.target);
              if (s === graph.focalId || t === graph.focalId) return 1.5;
            }
            return 0.8;
          }}
          linkOpacity={0.88}
          linkDirectionalArrowLength={(l: any) => ((l as GraphEdge).directed ? 4.5 : 0)}
          linkDirectionalArrowRelPos={0.9}
          linkDirectionalParticles={(l: any) => {
            const link = l as FGLink;
            if (selectedEdgeId && link.id === selectedEdgeId) return 6;
            if (selectedNodeId) {
              const s = endpointId(link.source);
              const t = endpointId(link.target);
              if (s === selectedNodeId || t === selectedNodeId) return 4;
              return 0;
            }
            if (graph?.focalId) {
              const s = endpointId(link.source);
              const t = endpointId(link.target);
              if (s === graph.focalId || t === graph.focalId) return 3;
            }
            return 1;
          }}
          linkDirectionalParticleWidth={((l: any) => {
            const link = l as FGLink;
            if (selectedEdgeId && link.id === selectedEdgeId) return 2.6;
            return 1.8;
          }) as any}
          linkDirectionalParticleSpeed={((l: any) => {
            const link = l as FGLink;
            if (selectedEdgeId && link.id === selectedEdgeId) return 0.012;
            if (link.type === "TRANSFERRED") return 0.008;
            if (link.type === "CALLED" || link.type === "MET") return 0.009;
            return 0.005;
          }) as any}
          linkDirectionalParticleColor={((l: any) => {
            const link = l as FGLink;
            if (selectedEdgeId && link.id === selectedEdgeId) return "#38bdf8";
            return getLinkStyle(link.type).particle;
          }) as any}
          linkLabel={(l) => {
            const link = l as GraphEdge;
            const amountText = link.amount ? ` · ₹${link.amount.toLocaleString("en-IN")}` : "";
            return `${link.type}${amountText}${link.confidence != null ? ` · ${link.confidence}%` : ""}`;
          }}
          onNodeClick={(n) => {
            void selectNode((n as FGNode).id);
          }}
          onNodeHover={(n) => {
            setHoveredNodeId(n ? (n as FGNode).id : null);
          }}
          onLinkClick={(l) => {
            void selectEdge((l as GraphEdge).id);
          }}
          onBackgroundClick={() => {
            void selectNode(null);
          }}
          onEngineStop={() => {
            if (needsFitRef.current && fgRef.current) {
              needsFitRef.current = false;
              fgRef.current.zoomToFit(700, 100);
            }
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

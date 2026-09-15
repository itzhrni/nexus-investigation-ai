import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph3D, { type ForceGraphMethods } from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import * as THREE from "three";
import { forceCollide } from "d3-force-3d";
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

// Convert hex color to rgba string for fine-grained alpha control
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const COMMUNITY_COLORS = [
  "#06b6d4", // Cyan
  "#a855f7", // Purple
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#3b82f6", // Blue
  "#84cc16", // Lime
  "#f97316", // Orange
];

function getCommunityColor(communityId?: number): string {
  const idx = Math.abs(communityId ?? 0) % COMMUNITY_COLORS.length;
  return COMMUNITY_COLORS[idx];
}

// Clean badge format: ENTITY NAME \n TYPE · ID
function formatNodeLabel(node: FGNode, graphViewMode: string): string {
  const name = node.label || node.id;
  const bridgeTag = node.isBridge ? " [BRIDGE]" : "";
  const commTag = graphViewMode === "community" ? ` (Comm #${node.communityId ?? 0})` : "";
  return `${name}${bridgeTag}\n${node.type.toUpperCase()}${commTag}`;
}

const LINK_STYLE_CONFIG: Record<string, { hex: string; particle: string }> = {
  TRANSFERRED: { hex: "#10b981", particle: "#34d399" },      // FINANCIAL: green
  CALLED: { hex: "#0284c7", particle: "#38bdf8" },           // COMMUNICATION: cyan/blue
  MET: { hex: "#0ea5e9", particle: "#38bdf8" },              // COMMUNICATION: cyan/blue
  OWNS: { hex: "#d97706", particle: "#f59e0b" },             // VEHICLE: amber
  USED: { hex: "#d97706", particle: "#f59e0b" },             // VEHICLE: amber
  ASSOCIATED_WITH: { hex: "#b45309", particle: "#f59e0b" },
  SEEN_AT: { hex: "#ca8a04", particle: "#eab308" },          // LOCATION: yellow
  LOCATED_AT: { hex: "#ca8a04", particle: "#eab308" },       // LOCATION: yellow
  INVOLVED_IN: { hex: "#a855f7", particle: "#c084fc" },      // CASE/CRIME: muted red/purple
  APPEARED_IN: { hex: "#a855f7", particle: "#c084fc" },
  CONNECTED_TO: { hex: "#64748b", particle: "#94a3b8" },
  WORKS_FOR: { hex: "#64748b", particle: "#94a3b8" },
};

function getLinkStyle(type: string) {
  return LINK_STYLE_CONFIG[type] ?? { hex: "#64748b", particle: "#94a3b8" };
}

function nodeColor(node: FGNode, selectedId: string | null, neighborIds: Set<string> | null, graphViewMode: string): string {
  const base = graphViewMode === "community" ? getCommunityColor(node.communityId) : (ENTITY_COLORS[node.type] ?? "#8b9cb3");
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
  const graphViewMode = useInvestigationStore((s) => s.graphViewMode);

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
          val: isFocal ? 28 : n.isBridge ? 18 : hop === 1 ? 16 : hop === 2 ? 10 : 6,
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
    if (focus === "investigation") {
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
        if (hop === 0) return -600;
        if (hop === 1) return -360;
        if (hop === 2) return -220;
        return -140;
      });
      charge.distanceMin(28);
      charge.distanceMax(1000);
    }

    // Link distance hierarchy
    const link = fg.d3Force("link") as any;
    if (link) {
      link.distance((l: any) => {
        const sHop = l.source?.hop ?? 1;
        const tHop = l.target?.hop ?? 1;
        const maxHop = Math.max(sHop, tHop);
        if (maxHop <= 1) return 95;
        if (maxHop === 2) return 160;
        return 230;
      });
      link.strength((l: any) => {
        const sHop = l.source?.hop ?? 1;
        const tHop = l.target?.hop ?? 1;
        const maxHop = Math.max(sHop, tHop);
        if (maxHop <= 1) return 0.65;
        if (maxHop === 2) return 0.45;
        return 0.30;
      });
    }

    // 3D Collision force to prevent node spheres from intersecting
    try {
      fg.d3Force(
        "collide",
        forceCollide((node: any) => {
          const hop = node?.hop ?? 2;
          if (hop === 0) return 18;
          if (hop === 1) return 14;
          if (hop === 2) return 10;
          return 8;
        }).strength(0.85),
      );
    } catch {
      // Fallback
    }

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
          warmupTicks={150}
          cooldownTicks={240}
          d3VelocityDecay={0.20}
          d3AlphaDecay={0.015}
          enableNodeDrag
          nodeRelSize={4}
          onNodeDrag={(_node) => {
            const fg = fgRef.current as any;
            if (fg) {
              fg.d3AlphaTarget?.(0.35);
              fg.resetCountdown?.();
            }
          }}
          onNodeDragEnd={(node) => {
            const fg = fgRef.current as any;
            const n = node as any;
            delete n.fx;
            delete n.fy;
            delete n.fz;
            if (fg) {
              fg.d3AlphaTarget?.(0);
              fg.d3ReheatSimulation?.();
            }
          }}
          nodeLabel={(n) => {
            const node = n as FGNode;
            const bridgeTag = node.isBridge ? " · [BRIDGE CONNECTOR]" : "";
            const commTag = node.communityId != null ? ` · Community #${node.communityId}` : "";
            const bcTag = node.betweennessCentrality ? ` · Betweenness: ${node.betweennessCentrality}` : "";
            return `${node.label} · ${node.type.toUpperCase()}${commTag}${bridgeTag}${bcTag}`;
          }}
          nodeColor={(n) => nodeColor(n as FGNode, selectedNodeId, neighborIds, graphViewMode)}
          nodeThreeObject={(n) => {
            const node = n as FGNode;
            const group = new THREE.Group();
            const hop = node.hop ?? 3;
            const isFocal = hop === 0 || node.id === graph?.focalId;
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isNeighborOfSelected = neighborIds?.has(node.id) ?? false;
            const isDimmed = !!selectedNodeId && !isSelected && !isNeighborOfSelected;

            // 1. Node Sizes
            const radius = isFocal ? 7.8 : node.isBridge ? 5.6 : hop === 1 ? 4.8 : hop === 2 ? 3.5 : 2.5;
            const baseColor = graphViewMode === "community"
              ? getCommunityColor(node.communityId)
              : (ENTITY_COLORS[node.type] ?? "#8b9cb3");
            const color = isDimmed ? "#2d3748" : baseColor;

            // 2. Opacity hierarchy
            let outerOpacity = isFocal ? 0.90 : hop === 1 ? 0.72 : hop === 2 ? 0.58 : 0.45;
            if (isHovered) outerOpacity = Math.min(0.96, outerOpacity + 0.20);
            if (isSelected) outerOpacity = 0.95;
            if (isDimmed) outerOpacity = 0.18;

            // 3. Outer Sphere Mesh
            const outerGeom = new THREE.SphereGeometry(radius, 24, 24);
            const outerMat = new THREE.MeshPhongMaterial({
              color: new THREE.Color(color),
              specular: new THREE.Color(isFocal ? "#a5f3fc" : node.isBridge ? "#fde68a" : isSelected ? "#ffffff" : "#94a3b8"),
              shininess: isFocal || node.isBridge ? 100 : 85,
              emissive: new THREE.Color(isFocal ? "#0891b2" : node.isBridge ? "#d97706" : isSelected ? color : "#000000"),
              emissiveIntensity: isFocal ? 0.45 : node.isBridge ? 0.40 : isSelected ? 0.35 : 0.05,
              transparent: true,
              opacity: outerOpacity,
              depthWrite: false,
            });
            group.add(new THREE.Mesh(outerGeom, outerMat));

            // 4. Luminous inner nucleus
            const coreRadius = radius * (isFocal ? 0.42 : 0.36);
            const coreGeom = new THREE.SphereGeometry(coreRadius, 16, 16);
            const coreMat = new THREE.MeshBasicMaterial({
              color: new THREE.Color(isFocal ? "#38bdf8" : node.isBridge ? "#fbbf24" : color),
              transparent: true,
              opacity: isDimmed ? 0.20 : isFocal ? 0.95 : isSelected ? 0.90 : outerOpacity * 0.9,
            });
            group.add(new THREE.Mesh(coreGeom, coreMat));

            // 5. Focal Node Ring Halo (Cyan)
            if (isFocal && !isDimmed) {
              const ringRadius = radius + 2.0;
              const haloGeom = new THREE.RingGeometry(ringRadius, ringRadius + 1.4, 32);
              const haloMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color("#38bdf8"),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.65,
              });
              const haloMesh = new THREE.Mesh(haloGeom, haloMat);
              haloMesh.rotation.x = Math.PI / 2;
              group.add(haloMesh);
            }

            // 6. Bridge Node Outer Ring Halo (Amber / Gold)
            if (node.isBridge && !isDimmed) {
              const bridgeRingRadius = radius + (isFocal ? 3.8 : 2.0);
              const bridgeGeom = new THREE.RingGeometry(bridgeRingRadius, bridgeRingRadius + 1.6, 32);
              const bridgeMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color("#f59e0b"),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.85,
              });
              const bridgeMesh = new THREE.Mesh(bridgeGeom, bridgeMat);
              bridgeMesh.rotation.x = Math.PI / 2;
              group.add(bridgeMesh);
            }

            // 7. Label progressive disclosure
            let showLabel = false;
            if (isFocal || isSelected || isHovered || node.isBridge) {
              showLabel = true;
            } else if (hop === 1) {
              showLabel = true;
            } else if (hop === 2) {
              showLabel = isNeighborOfSelected;
            }

            if (showLabel && !isDimmed) {
              const sprite = new SpriteText(formatNodeLabel(node, graphViewMode));
              sprite.color = isFocal
                ? "#38bdf8"
                : node.isBridge
                ? "#fbbf24"
                : isSelected
                ? "#5eead4"
                : isHovered
                ? "#38bdf8"
                : "#e2e8f0";
              sprite.textHeight = isFocal ? 3.8 : node.isBridge ? 3.2 : hop === 1 ? 2.8 : 2.4;
              sprite.fontFace = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
              sprite.fontWeight = isFocal || isSelected || node.isBridge ? "bold" : "500";
              sprite.backgroundColor = node.isBridge ? "rgba(45, 26, 0, 0.85)" : "rgba(6, 10, 16, 0.75)";
              sprite.borderColor = isFocal
                ? "rgba(56, 189, 248, 0.6)"
                : node.isBridge
                ? "rgba(245, 158, 11, 0.7)"
                : "rgba(30, 41, 59, 0.6)";
              sprite.borderWidth = node.isBridge ? 0.8 : 0.4;
              sprite.borderRadius = 2;
              sprite.padding = [2.5, 1.5];
              sprite.position.y = radius + (isFocal ? 6.5 : 5.0);
              group.add(sprite);
            }

            return group;
          }}
          linkOpacity={1.0}
          linkColor={(l) => {
            const link = l as FGLink;
            const style = getLinkStyle(link.type);
            const s = endpointId(link.source);
            const t = endpointId(link.target);

            if (selectedEdgeId && link.id === selectedEdgeId) {
              return "rgba(56, 189, 248, 0.95)";
            }
            if (hoveredNodeId && (s === hoveredNodeId || t === hoveredNodeId)) {
              return hexToRgba(style.hex, 0.85);
            }
            if (selectedNodeId) {
              if (s === selectedNodeId || t === selectedNodeId) {
                return hexToRgba(style.hex, 0.85);
              }
              return "rgba(20, 30, 45, 0.12)";
            }
            if (graph?.focalId && (s === graph.focalId || t === graph.focalId)) {
              return hexToRgba(style.hex, 0.60);
            }
            return hexToRgba(style.hex, 0.35);
          }}
          linkWidth={(l) => {
            const link = l as FGLink;
            const s = endpointId(link.source);
            const t = endpointId(link.target);

            if (selectedEdgeId && link.id === selectedEdgeId) return 2.4;
            if (hoveredNodeId && (s === hoveredNodeId || t === hoveredNodeId)) return 1.4;
            if (selectedNodeId) {
              if (s === selectedNodeId || t === selectedNodeId) return 1.5;
              return 0.4;
            }
            if (graph?.focalId && (s === graph.focalId || t === graph.focalId)) return 1.1;
            return 0.7;
          }}
          linkDirectionalArrowLength={(l: any) => ((l as GraphEdge).directed ? 4.5 : 0)}
          linkDirectionalArrowRelPos={0.9}
          linkDirectionalParticles={(l: any) => {
            const link = l as FGLink;
            const s = endpointId(link.source);
            const t = endpointId(link.target);

            if (selectedEdgeId && link.id === selectedEdgeId) return 6;
            if (hoveredNodeId && (s === hoveredNodeId || t === hoveredNodeId)) return 4;
            if (selectedNodeId) {
              if (s === selectedNodeId || t === selectedNodeId) return 4;
              return 0;
            }
            if (graph?.focalId && (s === graph.focalId || t === graph.focalId)) return 3;
            return 1;
          }}
          linkDirectionalParticleWidth={1.8}
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

declare module "react-force-graph-3d" {
  import type { ComponentType, Ref } from "react";

  export interface ForceGraphMethods {
    zoomToFit: (durationMs?: number, padding?: number) => void;
    cameraPosition: (
      position?: { x: number; y: number; z: number },
      lookAt?: { x: number; y: number; z: number },
      durationMs?: number,
    ) => void;
    d3Force: (name: string, force?: unknown) => unknown;
    d3ReheatSimulation: () => void;
  }

  export interface ForceGraph3DProps {
    ref?: Ref<ForceGraphMethods>;
    graphData: { nodes: object[]; links: object[] };
    width?: number;
    height?: number;
    backgroundColor?: string;
    showNavInfo?: boolean;
    warmupTicks?: number;
    cooldownTicks?: number;
    d3VelocityDecay?: number;
    d3AlphaDecay?: number;
    enableNodeDrag?: boolean;
    enableNavigationControls?: boolean;
    nodeRelSize?: number;
    nodeVal?: string | ((node: object) => number);
    nodeLabel?: string | ((node: object) => string);
    nodeColor?: string | ((node: object) => string);
    nodeOpacity?: number;
    nodeThreeObject?: (node: object) => object;
    nodeThreeObjectExtend?: boolean;
    linkColor?: string | ((link: object) => string);
    linkWidth?: number | ((link: object) => number);
    linkOpacity?: number;
    linkDirectionalArrowLength?: number | ((link: object) => number);
    linkDirectionalArrowRelPos?: number;
    linkDirectionalParticles?: number | ((link: object) => number);
    linkDirectionalParticleWidth?: number | ((link: object) => number);
    linkDirectionalParticleSpeed?: number | ((link: object) => number);
    linkDirectionalParticleColor?: string | ((link: object) => string);
    linkLabel?: string | ((link: object) => string);
    onNodeClick?: (node: object, event: MouseEvent) => void;
    onLinkClick?: (link: object, event: MouseEvent) => void;
    onBackgroundClick?: () => void;
    onEngineStop?: () => void;
  }

  const ForceGraph3D: ComponentType<ForceGraph3DProps>;
  export default ForceGraph3D;
}

declare module "three-spritetext" {
  import type { Sprite } from "three";
  export default class SpriteText extends Sprite {
    constructor(text?: string, textHeight?: number, color?: string);
    text: string;
    textHeight: number;
    color: string;
    fontFace: string;
    fontWeight: string;
    backgroundColor: false | string;
    padding: number;
    borderWidth: number;
    borderColor: string;
  }
}

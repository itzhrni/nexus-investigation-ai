import type { Entity, GraphNode, GraphEdge } from "@/types/nexus";
import data from "./syntheticDb.json";

export const syntheticEntities = data.entities as unknown as Record<string, Entity>;
export const syntheticNodes = data.nodes as unknown as GraphNode[];
export const syntheticEdges = data.edges as unknown as GraphEdge[];

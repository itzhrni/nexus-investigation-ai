import { api } from "@/api/client";
import type { GraphQuery } from "@/types/nexus";

export function fetchGraph(query: GraphQuery) {
  return api.getGraph(query);
}

export function fetchEntity(id: string) {
  return api.getEntity(id);
}

export function fetchEdge(id: string) {
  return api.getEdge(id);
}

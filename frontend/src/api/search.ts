import { api } from "@/api/client";
import type { SearchType } from "@/types/nexus";

export function searchClue(query: string, type: SearchType) {
  return api.search(query, type);
}

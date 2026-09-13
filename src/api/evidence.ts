import { api } from "@/api/client";

export function fetchEvidence(params: { entityId?: string; edgeId?: string }) {
  return api.getEvidence(params);
}

import { api } from "@/api/client";

export function fetchContinuityAlerts(investigationId: string) {
  return api.getContinuityAlerts(investigationId);
}

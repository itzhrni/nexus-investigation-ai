import { api } from "@/api/client";

export function fetchJurisdictionAlerts(investigationId: string) {
  return api.getJurisdictionAlerts(investigationId);
}

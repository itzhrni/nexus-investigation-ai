import { api } from "@/api/client";
import type { MatchReviewStatus } from "@/types/nexus";

export function fetchIdentityMatches(entityId: string) {
  return api.getIdentityMatches(entityId);
}

export function reviewIdentityMatch(matchId: string, status: MatchReviewStatus) {
  return api.reviewIdentityMatch(matchId, status);
}

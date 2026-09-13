import type {
  ContinuityAlert,
  Entity,
  EvidenceBundle,
  GraphQuery,
  IdentityMatch,
  InvestigationSummary,
  JurisdictionAlert,
  MatchReviewStatus,
  SearchResponse,
  SearchType,
  TimelineEvent,
  WhatChangedInsight,
} from "@/types/nexus";
import type { GraphPayload } from "@/types/nexus";

export interface NexusApi {
  search: (query: string, type: SearchType) => Promise<SearchResponse>;
  getInvestigation: (id: string) => Promise<InvestigationSummary>;
  getGraph: (query: GraphQuery) => Promise<GraphPayload>;
  getEntity: (id: string) => Promise<Entity>;
  getEdge: (id: string) => Promise<GraphPayload["edges"][number]>;
  getEvidence: (params: { entityId?: string; edgeId?: string }) => Promise<EvidenceBundle | null>;
  getTimeline: (params: { focalId: string; from?: string; to?: string }) => Promise<TimelineEvent[]>;
  getWhatChanged: (anchorEventId: string) => Promise<WhatChangedInsight>;
  getIdentityMatches: (entityId: string) => Promise<IdentityMatch[]>;
  reviewIdentityMatch: (matchId: string, status: MatchReviewStatus) => Promise<IdentityMatch>;
  getJurisdictionAlerts: (investigationId: string) => Promise<JurisdictionAlert[]>;
  getContinuityAlerts: (investigationId: string) => Promise<ContinuityAlert[]>;
}

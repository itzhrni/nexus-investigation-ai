export type EntityType =
  | "person"
  | "phone"
  | "sim"
  | "device"
  | "vehicle"
  | "account"
  | "location"
  | "organization"
  | "case"
  | "event";

export type SearchType = "auto" | EntityType;

export type ConfidenceBand = "HIGH" | "MEDIUM" | "LOW";

export type EvidenceCategory = "DIRECT" | "CORROBORATED" | "INFERRED" | "UNVERIFIED";

export type RelationshipType =
  | "CALLED"
  | "TRANSFERRED"
  | "MET"
  | "OWNS"
  | "USED"
  | "ASSOCIATED_WITH"
  | "SEEN_AT"
  | "LOCATED_AT"
  | "INVOLVED_IN"
  | "WORKS_FOR"
  | "CONNECTED_TO"
  | "APPEARED_IN";

export type RelFilterGroup = "communication" | "financial" | "vehicle" | "location" | "case";

export type SearchStatus =
  | "idle"
  | "searching"
  | "found"
  | "multiple"
  | "empty"
  | "error";

export type WorkspaceFocus =
  | "investigation"
  | "search"
  | "cases"
  | "network"
  | "timeline"
  | "map"
  | "evidence"
  | "settings";

export type MatchReviewStatus = "pending" | "confirmed" | "rejected" | "review";

export interface JurisdictionMeta {
  state?: string;
  district?: string;
  policeStation?: string;
  country?: string;
}

export interface Entity {
  id: string;
  type: EntityType;
  label: string;
  value: string;
  aliases?: string[];
  scripts?: { locale: string; text: string }[];
  confidence?: number;
  confidenceBand?: ConfidenceBand;
  identifiers?: { kind: string; value: string }[];
  jurisdictions?: JurisdictionMeta[];
  relatedCaseIds?: string[];
  locationIds?: string[];
  summary?: string;
  firstSeen?: string;
  lastSeen?: string;
  // Financial specifics
  accountNumber?: string;
  bankName?: string;
  ifsc?: string;
  accountType?: string;
  balance?: number;
  holderPersonId?: string;
  holderName?: string;
  totalVolume?: number;
  kycStatus?: string;
  flag?: string;
  // Communication & Location specifics
  carrier?: string;
  registeredName?: string;
  state?: string;
  district?: string;
  policeStation?: string;
  canonicalName?: string;
  matchType?: string;
}

export interface GraphNode {
  id: string;
  type: EntityType;
  label: string;
  sublabel?: string;
  val?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  confidence?: number;
  confidenceBand?: ConfidenceBand;
  directed?: boolean;
  validFrom?: string;
  validTo?: string;
  evidenceCount?: number;
  summary?: string;
  // Financial and communication metadata
  amount?: number;
  currency?: string;
  transactionType?: string;
  transactionId?: string;
  status?: string;
  sourceBank?: string;
  targetBank?: string;
}

export interface GraphPayload {
  nodes: GraphNode[];
  edges: GraphEdge[];
  focalId: string;
}

export interface SearchMatch {
  entity: Entity;
  score: number;
  reason: string;
  matchType?: string;
}

export interface SearchResponse {
  query: string;
  normalizedQuery: string;
  detectedType: EntityType | null;
  matches: SearchMatch[];
}

export interface InvestigationSummary {
  id: string;
  label: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  focalEntityId: string;
  focalLabel: string;
  entityCount: number;
  caseCount: number;
  jurisdictionCount: number;
  continuityCount: number;
  eventCount: number;
  jurisdictions: string[];
  crimeType?: string;
  policeStation?: string;
  district?: string;
  state?: string;
  sections?: string;
  registeredDate?: string;
  primarySuspect?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  kind: string;
  title: string;
  description: string;
  entityIds: string[];
  edgeIds?: string[];
  caseId?: string;
  locationId?: string;
}

export interface SourceRecord {
  id: string;
  kind: string;
  label: string;
}

export interface EvidenceItem {
  id: string;
  category: EvidenceCategory;
  statement: string;
  timestamp?: string;
  sourceRecords: SourceRecord[];
}

export interface EvidenceBundle {
  subjectLabel: string;
  relationship?: string;
  reasoning: string;
  items: EvidenceItem[];
  timelineIds: string[];
  confidence?: number;
  confidenceBand?: ConfidenceBand;
}

export interface IdentityMatch {
  id: string;
  entityId: string;
  displayName: string;
  scripts?: { locale: string; text: string }[];
  confidence: number;
  signals: string[];
  status: MatchReviewStatus;
}

export interface JurisdictionAlert {
  id: string;
  fromState: string;
  toState: string;
  sharedEntityId: string;
  sharedEntityLabel: string;
  supporting: string[];
  evidenceStrength: ConfidenceBand;
  recordCount: number;
}

export interface ContinuityAlert {
  id: string;
  fromId: string;
  fromLabel: string;
  toId: string;
  toLabel: string;
  identifierKind: "SIM" | "DEVICE" | "VEHICLE" | "ACCOUNT";
  evidence: string[];
  confidence: number;
  status: "REQUIRES INVESTIGATOR VERIFICATION";
}

export interface WhatChangedPeriod {
  label: string;
  communication: string;
  locations: string[];
  vehicles: string[];
  networkNote?: string;
}

export interface WhatChangedInsight {
  anchorEventId: string;
  anchorLabel: string;
  before: WhatChangedPeriod;
  after: WhatChangedPeriod;
}

export interface GraphQuery {
  focalId: string;
  depth: 1 | 2 | 3;
  relTypes?: RelFilterGroup[];
  from?: string;
  to?: string;
}

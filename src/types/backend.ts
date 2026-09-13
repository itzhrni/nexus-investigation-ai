/**
 * Backend API schemas matching FastAPI Pydantic models in app/models/schemas.py
 */

export interface BackendHealthResponse {
  status: string;
  app_name: string;
  environment: string;
  services: Record<string, any>;
}

export interface BackendEntitySearchResult {
  entity_id: string;
  entity_type: string;
  label: string;
  match_type: "exact" | "alias" | "partial" | "phonetic";
  confidence: number;
  properties: Record<string, any>;
}

export interface BackendSearchResponse {
  query: string;
  total_matches: number;
  results: BackendEntitySearchResult[];
}

export interface BackendNodeSchema {
  id: string;
  type: string;
  label: string;
  properties: Record<string, any>;
}

export interface BackendEdgeSchema {
  id: string;
  source: string;
  target: string;
  type: string;
  properties: Record<string, any>;
  timestamp?: string | null;
  confidence?: number;
  evidence_id?: string | null;
}

export interface BackendCentralEntity {
  entity_id: string;
  label: string;
  entity_type: string;
  degree: number;
  investigation_role: string;
}

export interface BackendGraphMetricsSchema {
  total_nodes: number;
  total_edges: number;
  relationship_distribution: Record<string, number>;
  central_entities: BackendCentralEntity[];
}

export interface BackendFocalGraphResponse {
  focal_entity_id: string;
  focal_entity_type: string;
  depth: number;
  nodes: BackendNodeSchema[];
  relationships: BackendEdgeSchema[];
  metrics?: BackendGraphMetricsSchema | null;
}

export interface BackendEntityResolutionCandidate {
  candidate_id: string;
  candidate_name: string;
  entity_type: string;
  confidence: number;
  signals: string[];
  matched_properties: Record<string, any>;
}

export interface BackendEntityResolutionResponse {
  query_entity_id: string;
  total_candidates: number;
  candidates: BackendEntityResolutionCandidate[];
}

export interface BackendIdentityTransitionDetail {
  from_identifier: string;
  to_identifier: string;
  identifier_type: string;
}

export interface BackendIdentityTransitionSchema {
  entity_id: string;
  transition: BackendIdentityTransitionDetail;
  confidence: number;
  transition_date?: string | null;
  evidence: string[];
  timeline: Array<Record<string, any>>;
}

export interface BackendContinuityResponse {
  entity_id: string;
  entity_type: string;
  transitions: BackendIdentityTransitionSchema[];
}

export interface BackendCrossJurisdictionInsight {
  source_jurisdiction: string;
  target_jurisdiction: string;
  source_state?: string | null;
  target_state?: string | null;
  connected_entities: string[];
  relationship_type: string;
  evidence_summary: string;
  confidence: number;
}

export interface BackendJurisdictionsResponse {
  focal_entity_id: string;
  associated_states: string[];
  associated_jurisdictions: string[];
  insights: BackendCrossJurisdictionInsight[];
}

export interface BackendTemporalWindowMetrics {
  total_calls: number;
  total_transactions: number;
  total_transaction_amount: number;
  unique_locations: string[];
  unique_connections: string[];
}

export interface BackendTemporalChangeItem {
  change_type: string;
  description: string;
  evidence: string[];
}

export interface BackendTimelineComparisonResponse {
  focal_entity_id: string;
  reference_timestamp: string;
  before_window: BackendTemporalWindowMetrics;
  after_window: BackendTemporalWindowMetrics;
  detected_changes: BackendTemporalChangeItem[];
}

export interface BackendDetectedPatternSchema {
  pattern_id: string;
  pattern_type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  involved_entities: string[];
  evidence: string[];
  timestamps: string[];
  explanation: string;
}

export interface BackendPatternDetectionResponse {
  focal_entity_id?: string | null;
  total_patterns: number;
  patterns: BackendDetectedPatternSchema[];
}

export interface BackendExplainableEvidenceItem {
  insight_type: string;
  what: string;
  who: string[];
  when?: string | null;
  where?: string | null;
  why: string;
  confidence: number;
  supporting_records: Array<Record<string, any>>;
}

export interface BackendEvidenceResponse {
  focal_entity_id: string;
  findings_count: number;
  findings: BackendExplainableEvidenceItem[];
}

export interface BackendInvestigationSummaryResponse {
  focal_entity_id: string;
  focal_entity_type: string;
  label: string;
  properties: Record<string, any>;
  graph_metrics: BackendGraphMetricsSchema;
  detected_patterns: BackendDetectedPatternSchema[];
  identity_transitions: BackendIdentityTransitionSchema[];
  cross_jurisdiction_insights: BackendCrossJurisdictionInsight[];
  temporal_summary?: BackendTimelineComparisonResponse | null;
  explainable_evidence: BackendExplainableEvidenceItem[];
}

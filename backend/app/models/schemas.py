from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# Health check schema
class HealthResponse(BaseModel):
    status: str
    app_name: str
    environment: str
    services: Dict[str, Any]

# Search schemas
class EntitySearchQuery(BaseModel):
    query: str = Field(..., description="Clue or identifier to search (Name, Phone, SIM, Vehicle, etc.)")
    entity_type: Optional[str] = Field(None, description="Optional entity type filter")
    limit: int = Field(10, ge=1, le=100)

class EntitySearchResult(BaseModel):
    entity_id: str
    entity_type: str
    label: str
    match_type: str = "exact"  # exact, alias, partial, phonetic
    confidence: float = 1.0
    properties: Dict[str, Any] = {}

class SearchResponse(BaseModel):
    query: str
    total_matches: int
    results: List[EntitySearchResult]

# Graph schemas
class NodeSchema(BaseModel):
    id: str
    type: str
    label: str
    properties: Dict[str, Any] = {}
    community_id: Optional[int] = Field(None, description="Louvain community cluster ID")
    is_bridge: Optional[bool] = Field(False, description="Whether node acts as a bridge/connector between communities")
    betweenness_centrality: Optional[float] = Field(0.0, description="Betweenness centrality score in focal graph")

class EdgeSchema(BaseModel):
    id: str
    source: str
    target: str
    type: str
    properties: Dict[str, Any] = {}
    timestamp: Optional[str] = None
    confidence: Optional[float] = 1.0
    evidence_id: Optional[str] = None

class GraphMetricsSchema(BaseModel):
    total_nodes: int = 0
    total_edges: int = 0
    relationship_distribution: Dict[str, int] = {}
    central_entities: List[Dict[str, Any]] = []
    total_communities: int = 0
    bridge_nodes: List[Dict[str, Any]] = []

class FocalGraphResponse(BaseModel):
    focal_entity_id: str
    focal_entity_type: str
    depth: int
    nodes: List[NodeSchema]
    relationships: List[EdgeSchema]
    metrics: Optional[GraphMetricsSchema] = None

# Entity Resolution Schemas
class EntityResolutionCandidate(BaseModel):
    candidate_id: str
    candidate_name: str
    entity_type: str = "Person"
    confidence: float
    signals: List[str]
    matched_properties: Dict[str, Any] = {}

class EntityResolutionResponse(BaseModel):
    query_entity_id: str
    total_candidates: int
    candidates: List[EntityResolutionCandidate]

# Identity Continuity Schemas
class IdentityTransitionDetail(BaseModel):
    from_identifier: str
    to_identifier: str
    identifier_type: str

class IdentityTransitionSchema(BaseModel):
    entity_id: str
    transition: IdentityTransitionDetail
    confidence: float
    transition_date: Optional[str] = None
    evidence: List[str]
    timeline: List[Dict[str, Any]] = []

class ContinuityResponse(BaseModel):
    entity_id: str
    entity_type: str
    transitions: List[IdentityTransitionSchema]

# Cross Jurisdiction Schemas
class CrossJurisdictionInsight(BaseModel):
    source_jurisdiction: str
    target_jurisdiction: str
    source_state: Optional[str] = None
    target_state: Optional[str] = None
    connected_entities: List[str]
    relationship_type: str
    evidence_summary: str
    confidence: float = 0.9

class JurisdictionsResponse(BaseModel):
    focal_entity_id: str
    associated_states: List[str]
    associated_jurisdictions: List[str]
    insights: List[CrossJurisdictionInsight]

# Temporal Timeline Schemas
class TemporalWindowMetrics(BaseModel):
    total_calls: int = 0
    total_transactions: int = 0
    total_transaction_amount: float = 0.0
    unique_locations: List[str] = []
    unique_connections: List[str] = []

class TemporalChangeItem(BaseModel):
    change_type: str
    description: str
    evidence: List[str]

class TimelineComparisonResponse(BaseModel):
    focal_entity_id: str
    reference_timestamp: str
    before_window: TemporalWindowMetrics
    after_window: TemporalWindowMetrics
    detected_changes: List[TemporalChangeItem]

# Anomaly / Pattern Detection Schemas
class DetectedPatternSchema(BaseModel):
    pattern_id: str
    pattern_type: str
    severity: str = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL
    confidence: float
    involved_entities: List[str]
    evidence: List[str]
    timestamps: List[str] = []
    explanation: str

class PatternDetectionResponse(BaseModel):
    focal_entity_id: Optional[str] = None
    total_patterns: int
    patterns: List[DetectedPatternSchema]

# Explainable Evidence Schemas
class ExplainableEvidenceItem(BaseModel):
    insight_type: str
    what: str
    who: List[str]
    when: Optional[str] = None
    where: Optional[str] = None
    why: str
    confidence: float
    supporting_records: List[Dict[str, Any]] = []

class EvidenceResponse(BaseModel):
    focal_entity_id: str
    findings_count: int
    findings: List[ExplainableEvidenceItem]

# Investigation Summary Response
class InvestigationSummaryResponse(BaseModel):
    focal_entity_id: str
    focal_entity_type: str
    label: str
    properties: Dict[str, Any] = {}
    graph_metrics: GraphMetricsSchema
    detected_patterns: List[DetectedPatternSchema]
    identity_transitions: List[IdentityTransitionSchema]
    cross_jurisdiction_insights: List[CrossJurisdictionInsight]
    temporal_summary: Optional[TimelineComparisonResponse] = None
    explainable_evidence: List[ExplainableEvidenceItem]

# Government Identifier / Aadhaar Forensics Schema
class AadhaarForensicsResponse(BaseModel):
    person_id: str
    has_aadhaar: bool
    aadhaar_masked: Optional[str] = None
    status: str = "UNREGISTERED"
    verhoeff_valid: bool = False
    collision_detected: bool = False
    collision_details: Optional[str] = None
    colliding_person_ids: List[str] = []
    fanout_sim_count: int = 0
    fanout_account_count: int = 0
    total_fanout: int = 0


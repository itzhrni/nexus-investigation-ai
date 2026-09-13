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
    name_or_identifier: str
    confidence: float = 1.0
    properties: Dict[str, Any] = {}
    matched_by: str = "exact_match"

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

class EdgeSchema(BaseModel):
    id: str
    source: str
    target: str
    type: str
    properties: Dict[str, Any] = {}
    timestamp: Optional[str] = None
    confidence: Optional[float] = 1.0
    evidence_id: Optional[str] = None

class FocalGraphResponse(BaseModel):
    focal_entity_id: str
    focal_entity_type: str
    depth: int
    nodes: List[NodeSchema]
    relationships: List[EdgeSchema]

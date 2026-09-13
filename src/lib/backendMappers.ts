import type {
  BackendEntitySearchResult,
  BackendSearchResponse,
  BackendFocalGraphResponse,
  BackendEntityResolutionCandidate,
  BackendContinuityResponse,
  BackendJurisdictionsResponse,
  BackendTimelineComparisonResponse,
  BackendEvidenceResponse,
  BackendInvestigationSummaryResponse,
} from "@/types/backend";

import type {
  Entity,
  EntityType,
  SearchResponse,
  GraphPayload,
  GraphNode,
  GraphEdge,
  RelationshipType,
  ConfidenceBand,
  InvestigationSummary,
  ContinuityAlert,
  JurisdictionAlert,
  WhatChangedInsight,
  EvidenceBundle,
  EvidenceItem,
  IdentityMatch,
} from "@/types/nexus";

export function toFrontendEntityType(backendType: string): EntityType {
  const t = (backendType || "").toLowerCase();
  if (t.includes("bank") || t.includes("account")) return "account";
  if (t.includes("fir") || t.includes("crime") || t.includes("case")) return "case";
  if (t.includes("person")) return "person";
  if (t.includes("phone")) return "phone";
  if (t.includes("sim")) return "sim";
  if (t.includes("dev")) return "device";
  if (t.includes("veh")) return "vehicle";
  if (t.includes("loc")) return "location";
  if (t.includes("org")) return "organization";
  if (t.includes("event")) return "event";
  return "person";
}

export function toBackendEntityType(frontendType?: string): string | undefined {
  if (!frontendType || frontendType === "auto") return undefined;
  switch (frontendType) {
    case "person":
      return "Person";
    case "phone":
      return "Phone";
    case "sim":
      return "SIM";
    case "device":
      return "Device";
    case "vehicle":
      return "Vehicle";
    case "account":
      return "BankAccount";
    case "location":
      return "Location";
    case "organization":
      return "Organization";
    case "case":
      return "FIR";
    case "event":
      return "Event";
    default:
      return undefined;
  }
}

export function inferEntityTypeFromId(id: string): string {
  if (id.startsWith("P") && !id.startsWith("PH") && id.length <= 6) return "Person";
  if (id.startsWith("PH")) return "Phone";
  if (id.startsWith("SIM")) return "SIM";
  if (id.startsWith("DEV")) return "Device";
  if (id.startsWith("V")) return "Vehicle";
  if (id.startsWith("ACC")) return "BankAccount";
  if (id.startsWith("LOC")) return "Location";
  if (id.startsWith("FIR")) return "FIR";
  if (id.startsWith("EVT")) return "Event";
  return "Person";
}

export function toConfidenceBand(conf?: number): ConfidenceBand {
  if (conf === undefined || conf === null) return "HIGH";
  if (conf >= 0.85) return "HIGH";
  if (conf >= 0.6) return "MEDIUM";
  return "LOW";
}

export function mapBackendSearchResultToEntity(r: BackendEntitySearchResult): Entity {
  const fType = toFrontendEntityType(r.entity_type);
  const aliases: string[] = [];
  if (r.properties?.matched_alias) {
    aliases.push(r.properties.matched_alias);
  }
  if (r.properties?.canonical_name && r.properties.canonical_name !== r.label) {
    aliases.push(r.properties.canonical_name);
  }

  const jurisdictions = r.properties?.state
    ? [{ state: r.properties.state, policeStation: r.properties.police_station }]
    : undefined;

  return {
    id: r.entity_id,
    type: fType,
    label: r.label,
    value: r.label,
    aliases: aliases.length > 0 ? aliases : undefined,
    confidence: r.confidence,
    confidenceBand: toConfidenceBand(r.confidence),
    jurisdictions,
    summary: `${r.entity_type} match (${r.match_type}) with confidence ${Math.round(r.confidence * 100)}%`,
  };
}

export function mapBackendSearchResponse(
  raw: BackendSearchResponse,
  originalQuery: string,
): SearchResponse {
  const matches = (raw.results || []).map((r) => {
    const entity = mapBackendSearchResultToEntity(r);
    return {
      entity,
      score: r.confidence,
      reason: `${r.match_type.toUpperCase()} match on ${r.entity_type}`,
    };
  });

  const detectedType = matches.length > 0 ? matches[0].entity.type : null;

  return {
    query: originalQuery,
    normalizedQuery: raw.query,
    detectedType,
    matches,
  };
}

export function mapBackendGraphToPayload(raw: BackendFocalGraphResponse): GraphPayload {
  const nodes: GraphNode[] = (raw.nodes || []).map((n) => {
    const fType = toFrontendEntityType(n.type);
    return {
      id: n.id,
      type: fType,
      label: n.label,
      sublabel: n.type,
      val: n.id === raw.focal_entity_id ? 15 : 8,
    };
  });

  const edges: GraphEdge[] = (raw.relationships || []).map((rel) => {
    const meta = rel.properties || {};
    let summary = `${rel.source} ↔ ${rel.target}`;
    if (meta.amount) {
      summary = `₹${Number(meta.amount).toLocaleString("en-IN")} · ${rel.source} → ${rel.target}`;
    } else if (meta.camera_id) {
      summary = `Camera ${meta.camera_id} · ${rel.source}`;
    }

    return {
      id: rel.id,
      source: rel.source,
      target: rel.target,
      type: (rel.type as RelationshipType) || "CONNECTED_TO",
      confidence: rel.confidence ?? 1.0,
      confidenceBand: toConfidenceBand(rel.confidence),
      directed: true,
      validFrom: rel.timestamp ?? undefined,
      evidenceCount: rel.evidence_id ? 1 : 0,
      summary,
    };
  });

  return {
    focalId: raw.focal_entity_id,
    nodes,
    edges,
  };
}

export function mapBackendSummaryToInvestigation(
  raw: BackendInvestigationSummaryResponse,
): InvestigationSummary {
  const states = new Set<string>();
  (raw.cross_jurisdiction_insights || []).forEach((ins) => {
    if (ins.source_state) states.add(ins.source_state);
    if (ins.target_state) states.add(ins.target_state);
  });
  if (raw.properties?.state) {
    states.add(raw.properties.state);
  }

  return {
    id: `INV-${raw.focal_entity_id}`,
    label: `Investigation: ${raw.label || raw.focal_entity_id}`,
    status: "ACTIVE",
    focalEntityId: raw.focal_entity_id,
    focalLabel: raw.label || raw.focal_entity_id,
    entityCount: raw.graph_metrics?.total_nodes ?? 0,
    caseCount: (raw.detected_patterns || []).length,
    jurisdictionCount: states.size,
    continuityCount: (raw.identity_transitions || []).length,
    eventCount: (raw.explainable_evidence || []).length,
    jurisdictions: Array.from(states),
  };
}

export function mapBackendContinuityToAlerts(raw: BackendContinuityResponse): ContinuityAlert[] {
  return (raw.transitions || []).map((t, idx) => {
    let kind: ContinuityAlert["identifierKind"] = "SIM";
    const typeUpper = t.transition.identifier_type.toUpperCase();
    if (typeUpper.includes("DEV")) kind = "DEVICE";
    else if (typeUpper.includes("VEH")) kind = "VEHICLE";
    else if (typeUpper.includes("ACC")) kind = "ACCOUNT";

    return {
      id: `CONT-${t.entity_id}-${idx}`,
      fromId: t.transition.from_identifier,
      fromLabel: t.transition.from_identifier,
      toId: t.transition.to_identifier,
      toLabel: t.transition.to_identifier,
      identifierKind: kind,
      evidence: t.evidence || [],
      confidence: t.confidence,
      status: "REQUIRES INVESTIGATOR VERIFICATION",
    };
  });
}

export function mapBackendJurisdictionsToAlerts(
  raw: BackendJurisdictionsResponse,
): JurisdictionAlert[] {
  return (raw.insights || []).map((ins, idx) => {
    return {
      id: `JUR-${raw.focal_entity_id}-${idx}`,
      fromState: ins.source_state || ins.source_jurisdiction,
      toState: ins.target_state || ins.target_jurisdiction,
      sharedEntityId: ins.connected_entities[0] || raw.focal_entity_id,
      sharedEntityLabel: ins.connected_entities[0] || raw.focal_entity_id,
      supporting: [ins.evidence_summary],
      evidenceStrength: toConfidenceBand(ins.confidence),
      recordCount: ins.connected_entities.length,
    };
  });
}

export function mapBackendTimelineToWhatChanged(
  raw: BackendTimelineComparisonResponse,
  anchorLabel = "Incident Marker",
): WhatChangedInsight {
  const beforeComm = `Calls: ${raw.before_window.total_calls}, Total Tx: ${raw.before_window.total_transactions} (₹${raw.before_window.total_transaction_amount})`;
  const afterComm = `Calls: ${raw.after_window.total_calls}, Total Tx: ${raw.after_window.total_transactions} (₹${raw.after_window.total_transaction_amount})`;

  const detectedDescriptions = (raw.detected_changes || []).map((c) => c.description).join("; ");

  return {
    anchorEventId: raw.reference_timestamp,
    anchorLabel: `${anchorLabel} (${raw.reference_timestamp})`,
    before: {
      label: "Before Anchor",
      communication: beforeComm,
      locations: raw.before_window.unique_locations || [],
      vehicles: [],
      networkNote: `Connections: ${raw.before_window.unique_connections.length}`,
    },
    after: {
      label: "After Anchor",
      communication: afterComm,
      locations: raw.after_window.unique_locations || [],
      vehicles: [],
      networkNote: detectedDescriptions || `Connections: ${raw.after_window.unique_connections.length}`,
    },
  };
}

export function mapBackendEvidenceToBundle(raw: BackendEvidenceResponse): EvidenceBundle {
  const items: EvidenceItem[] = (raw.findings || []).map((f, idx) => {
    return {
      id: `EVID-${raw.focal_entity_id}-${idx}`,
      category: f.confidence >= 0.9 ? "DIRECT" : f.confidence >= 0.75 ? "CORROBORATED" : "INFERRED",
      statement: `${f.what}. ${f.why}`,
      timestamp: f.when || undefined,
      sourceRecords: (f.supporting_records || []).map((r, rIdx) => ({
        id: r.record_id || `REC-${rIdx}`,
        kind: r.table || "DATABASE_RECORD",
        label: `${r.table || "Record"} (${r.relationship_type || r.record_id || "Ref"})`,
      })),
    };
  });

  const avgConfidence =
    items.length > 0
      ? (raw.findings || []).reduce((acc, curr) => acc + curr.confidence, 0) / items.length
      : 1.0;

  return {
    subjectLabel: raw.focal_entity_id,
    reasoning: `Synthesized ${raw.findings_count} evidence items across relational and graph records.`,
    items,
    timelineIds: items.map((i) => i.id),
    confidence: avgConfidence,
    confidenceBand: toConfidenceBand(avgConfidence),
  };
}

export function mapBackendCandidatesToMatches(
  candidates: BackendEntityResolutionCandidate[],
): IdentityMatch[] {
  return candidates.map((c) => {
    const scripts = c.matched_properties?.phonetic_key
      ? [{ locale: "Phonetic", text: c.matched_properties.phonetic_key }]
      : undefined;

    return {
      id: c.candidate_id,
      entityId: c.candidate_id,
      displayName: c.candidate_name,
      confidence: c.confidence,
      signals: c.signals,
      scripts,
      status: "review",
    };
  });
}

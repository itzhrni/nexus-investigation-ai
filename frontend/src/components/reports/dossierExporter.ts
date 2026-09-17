import { jsPDF } from "jspdf";
import JSZip from "jszip";
import type {
  ContinuityAlert,
  Entity,
  EvidenceBundle,
  GraphPayload,
  InvestigationSummary,
  JurisdictionAlert,
  TimelineEvent,
  WhatChangedInsight,
} from "@/types/nexus";

export interface ReportSectionsState {
  executiveSummary: boolean;
  focalEntity: boolean;
  networkAnalysis: boolean;
  identityContinuity: boolean;
  temporalAnalysis: boolean;
  jurisdictionAnalysis: boolean;
  detectedPatterns: boolean;
  evidenceAnalysis: boolean;
  graphSnapshot: boolean;
  mapSnapshot: boolean;
  appendix: boolean;
}

export interface ReportDataBundle {
  investigation: InvestigationSummary | null;
  focalEntity: Entity | null;
  graph: GraphPayload | null;
  timeline: TimelineEvent[];
  whatChanged: WhatChangedInsight | null;
  jurisdictionAlerts: JurisdictionAlert[];
  continuityAlerts: ContinuityAlert[];
  patternLeads: any[];
  evidence: EvidenceBundle | null;
  activeCaseId: string;
  timeFrom: string;
  timeTo: string;
  depth: number;
}

// Capture current 3D WebGL graph canvas screenshot
export function captureGraphCanvasDataUrl(): string | null {
  try {
    const canvas = document.querySelector(".scene-container canvas") as HTMLCanvasElement;
    if (canvas) {
      return canvas.toDataURL("image/png");
    }
  } catch (e) {
    console.warn("Could not capture graph canvas:", e);
  }
  return null;
}

// Capture current Leaflet Map canvas screenshot if available
export function captureMapCanvasDataUrl(): string | null {
  try {
    const canvas = document.querySelector(".leaflet-container canvas") as HTMLCanvasElement;
    if (canvas) {
      return canvas.toDataURL("image/png");
    }
  } catch (e) {
    console.warn("Could not capture map canvas:", e);
  }
  return null;
}

// Helper to trigger file download in browser
export function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper to format CSV values
function escapeCsv(val: any): string {
  if (val == null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// Helper to build CSV files from report data
export function generateCsvDatasets(data: ReportDataBundle): Record<string, string> {
  const datasets: Record<string, string> = {};

  // 1. Entities CSV
  if (data.graph?.nodes && data.graph.nodes.length > 0) {
    const rows: string[][] = [["ID", "Label", "Type", "Community_ID", "Is_Bridge", "Betweenness_Score", "State", "District"]];
    data.graph.nodes.forEach((n) => {
      rows.push([
        String(n.id),
        String(n.label),
        String(n.type),
        String(n.communityId ?? ""),
        n.isBridge ? "TRUE" : "FALSE",
        String(n.betweennessCentrality ?? 0),
        String(n.state ?? ""),
        String(n.district ?? ""),
      ]);
    });
    datasets["entities.csv"] = rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
  }

  // 2. Relationships CSV
  if (data.graph?.edges && data.graph.edges.length > 0) {
    const rows: string[][] = [["Edge_ID", "Source_ID", "Target_ID", "Relationship_Type", "Confidence", "Summary"]];
    data.graph.edges.forEach((e) => {
      rows.push([
        String(e.id),
        String(e.source),
        String(e.target),
        String(e.type),
        String(e.confidence ?? 1.0),
        String(e.summary ?? ""),
      ]);
    });
    datasets["relationships.csv"] = rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
  }

  // 3. Timeline CSV
  if (data.timeline && data.timeline.length > 0) {
    const rows: string[][] = [["Event_ID", "Timestamp", "Kind", "Title", "Description", "Involved_Entities"]];
    data.timeline.forEach((t) => {
      rows.push([
        String(t.id),
        String(t.timestamp),
        String(t.kind),
        String(t.title),
        String(t.description),
        (t.entityIds || []).join("; "),
      ]);
    });
    datasets["timeline.csv"] = rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
  }

  // 4. Patterns CSV
  if (data.patternLeads && data.patternLeads.length > 0) {
    const rows: string[][] = [["Pattern_ID", "Title", "Type", "Severity", "Confidence", "Explanation", "Involved_Entities"]];
    data.patternLeads.forEach((p) => {
      rows.push([
        String(p.id),
        String(p.title),
        String(p.type),
        String(p.severity),
        String(p.confidence),
        String(p.explanation),
        (p.involvedEntities || []).join("; "),
      ]);
    });
    datasets["patterns.csv"] = rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
  }

  // 5. Identity Transitions CSV
  if (data.continuityAlerts && data.continuityAlerts.length > 0) {
    const rows: string[][] = [["Alert_ID", "From_Entity_ID", "From_Label", "To_Entity_ID", "To_Label", "Identifier_Kind", "Confidence"]];
    data.continuityAlerts.forEach((c) => {
      rows.push([
        String(c.id),
        String(c.fromId),
        String(c.fromLabel),
        String(c.toId),
        String(c.toLabel),
        String(c.identifierKind),
        String(c.confidence),
      ]);
    });
    datasets["identity_transitions.csv"] = rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
  }

  // 6. Jurisdictions CSV
  if (data.jurisdictionAlerts && data.jurisdictionAlerts.length > 0) {
    const rows: string[][] = [["Alert_ID", "From_State", "To_State", "Shared_Entity_ID", "Shared_Entity_Label", "Record_Count"]];
    data.jurisdictionAlerts.forEach((j) => {
      rows.push([
        String(j.id),
        String(j.fromState),
        String(j.toState),
        String(j.sharedEntityId),
        String(j.sharedEntityLabel),
        String(j.recordCount),
      ]);
    });
    datasets["jurisdictions.csv"] = rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
  }

  // 7. Evidence CSV
  if (data.evidence?.items && data.evidence.items.length > 0) {
    const rows = [["Evidence_ID", "Category", "Statement", "Source_Record"]];
    data.evidence.items.forEach((ev) => {
      rows.push([ev.id, ev.category, ev.statement, ev.sourceRecords?.[0]?.label || ""]);
    });
    datasets["evidence.csv"] = rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
  }

  return datasets;
}

// Generate JSON export package
export function generateJsonPackage(data: ReportDataBundle): string {
  const jsonObject = {
    metadata: {
      generatedAt: new Date().toISOString(),
      generator: "NEXUS Investigation Platform v0.1.0",
      caseId: data.investigation?.id || data.activeCaseId,
      investigationTitle: data.investigation?.label || "Focal Investigation",
      focalEntityId: data.investigation?.focalEntityId || data.focalEntity?.id,
      focalEntityLabel: data.investigation?.focalLabel || data.focalEntity?.label,
      filters: {
        timeFrom: data.timeFrom,
        timeTo: data.timeTo,
        depth: data.depth,
      },
    },
    focalEntityProfile: data.focalEntity,
    graphMetrics: {
      totalEntities: data.graph?.nodes.length || 0,
      totalRelationships: data.graph?.edges.length || 0,
    },
    entities: data.graph?.nodes || [],
    relationships: data.graph?.edges || [],
    timeline: data.timeline,
    whatChangedInsight: data.whatChanged,
    patternLeads: data.patternLeads,
    identityTransitions: data.continuityAlerts,
    jurisdictionAlerts: data.jurisdictionAlerts,
    evidenceBundle: data.evidence,
  };

  return JSON.stringify(jsonObject, null, 2);
}

// Generate PDF Dossier using jsPDF
export function generatePdfDossier(
  data: ReportDataBundle,
  sections: ReportSectionsState,
  graphImage?: string | null,
  mapImage?: string | null
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  function checkPageOverflow(needed: number) {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  }

  function drawHeaderFooter() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 165);
    doc.text("NEXUS INVESTIGATION PLATFORM — OFFICIAL INTELLIGENCE DOSSIER", margin, 9);
    doc.text(`CASE: ${data.investigation?.id || data.activeCaseId}`, pageWidth - margin - 30, 9);
    doc.setDrawColor(200, 210, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, 11, pageWidth - margin, 11);
  }

  // COVER PAGE
  doc.setFillColor(15, 23, 34); // Dark Navy / Charcoal
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(79, 142, 247); // Blue accent
  doc.text("NEXUS", margin, 40);

  doc.setFontSize(18);
  doc.setTextColor(240, 245, 255);
  doc.text("INTELLIGENCE INVESTIGATION DOSSIER", margin, 52);

  doc.setDrawColor(79, 142, 247);
  doc.setLineWidth(1);
  doc.line(margin, 58, pageWidth - margin, 58);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 195, 215);

  let coverY = 70;
  doc.text(`CASE / INVESTIGATION ID: ${data.investigation?.id || data.activeCaseId}`, margin, coverY);
  coverY += 8;
  doc.text(`FOCAL SUBJECT: ${data.investigation?.focalLabel || data.focalEntity?.label || "Subject"} (${data.investigation?.focalEntityId || data.focalEntity?.id})`, margin, coverY);
  coverY += 8;
  doc.text(`PRIMARY JURISDICTION: ${data.investigation?.state || "National Scope"} / ${data.investigation?.district || "Central PS"}`, margin, coverY);
  coverY += 8;
  doc.text(`GENERATED TIMESTAMP: ${new Date().toLocaleString()}`, margin, coverY);
  coverY += 8;
  doc.text(`ANALYSIS TIMELINE SCOPE: ${data.timeFrom} to ${data.timeTo} (Depth: ${data.depth}-Hop)`, margin, coverY);

  // Notice box
  coverY += 25;
  doc.setFillColor(25, 35, 50);
  doc.setDrawColor(60, 80, 110);
  doc.roundedRect(margin, coverY, pageWidth - margin * 2, 45, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(220, 140, 60); // Orange warning
  doc.text("LAW ENFORCEMENT & INVESTIGATION-SUPPORT NOTICE", margin + 5, coverY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(190, 205, 220);
  const noticeLines = doc.splitTextToSize(
    "This document contains automated network analysis, identity continuity leads, and explainable pattern intelligence. Information contained herein is compiled for official investigation-support purposes. Network association alone does not constitute proof of liability.",
    pageWidth - margin * 2 - 10
  );
  doc.text(noticeLines, margin + 5, coverY + 16);

  doc.addPage();
  y = margin;
  drawHeaderFooter();

  // EXECUTIVE SUMMARY
  if (sections.executiveSummary) {
    checkPageOverflow(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 34);
    doc.text("1. EXECUTIVE SUMMARY", margin, y);
    y += 6;
    doc.setDrawColor(15, 23, 34);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 60, 75);
    const execText = `This intelligence dossier summarizes network traversal, identity continuity transitions, temporal activity shifts, and multi-jurisdictional movement for investigation ${data.investigation?.id || data.activeCaseId}, centered on focal entity ${data.investigation?.focalLabel || "Focal Subject"}.`;
    doc.text(doc.splitTextToSize(execText, pageWidth - margin * 2), margin, y);
    y += 12;

    // Quick Metrics Table
    doc.setFillColor(240, 244, 250);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 20, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 45, 65);
    const colW = (pageWidth - margin * 2) / 4;
    doc.text(`Entities: ${data.graph?.nodes.length || 0}`, margin + 5, y + 8);
    doc.text(`Relationships: ${data.graph?.edges.length || 0}`, margin + colW + 5, y + 8);
    doc.text(`Detected Patterns: ${data.patternLeads.length}`, margin + colW * 2 + 5, y + 8);
    doc.text(`Transitions: ${data.continuityAlerts.length}`, margin + colW * 3 + 5, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Analyzed Network Nodes", margin + 5, y + 14);
    doc.text("Connected Edges", margin + colW + 5, y + 14);
    doc.text("Anomaly Pattern Leads", margin + colW * 2 + 5, y + 14);
    doc.text("Identity Continuity Shifts", margin + colW * 3 + 5, y + 14);

    y += 28;
  }

  // FOCAL ENTITY PROFILE
  if (sections.focalEntity && data.focalEntity) {
    checkPageOverflow(45);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 34);
    doc.text("2. FOCAL ENTITY PROFILE", margin, y);
    y += 6;
    doc.setDrawColor(15, 23, 34);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.text(`Label: ${data.focalEntity.label}`, margin, y);
    doc.text(`ID: ${data.focalEntity.id}`, margin + 80, y);
    y += 5;
    doc.text(`Type: ${data.focalEntity.type.toUpperCase()}`, margin, y);
    doc.text(`Confidence Score: ${Math.round((data.focalEntity.confidence || 0.95) * 100)}%`, margin + 80, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    if (data.focalEntity.summary) {
      doc.text(`Summary: ${data.focalEntity.summary}`, margin, y);
      y += 6;
    }
    if (data.focalEntity.state || data.focalEntity.district) {
      doc.text(`Jurisdiction: ${data.focalEntity.district || ""}, ${data.focalEntity.state || ""}`, margin, y);
      y += 6;
    }
    y += 4;
  }

  // NETWORK ANALYSIS & GRAPH SNAPSHOT
  if (sections.networkAnalysis) {
    checkPageOverflow(60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 34);
    doc.text("3. NETWORK ANALYSIS & TOPOLOGY", margin, y);
    y += 6;
    doc.setDrawColor(15, 23, 34);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(`Graph depth: ${data.depth}-Hop traversal. Total Nodes: ${data.graph?.nodes.length || 0}, Total Edges: ${data.graph?.edges.length || 0}.`, margin, y);
    y += 8;

    // Top connected entities table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Top Connected Entities (Highest Degree):", margin, y);
    y += 5;

    const topNodes = [...(data.graph?.nodes || [])]
      .map((n) => {
        const degree = (data.graph?.edges || []).filter((e) => e.source === n.id || e.target === n.id).length;
        return { ...n, degree };
      })
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 5);

    topNodes.forEach((node, idx) => {
      checkPageOverflow(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(`${idx + 1}. [${node.type.toUpperCase()}] ${node.label} (${node.id}) — Degree: ${node.degree}`, margin + 3, y);
      y += 5;
    });

    y += 4;

    // Embedded Graph Snapshot
    if (sections.graphSnapshot) {
      checkPageOverflow(70);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("3D Network Graph Visual Snapshot:", margin, y);
      y += 5;

      if (graphImage) {
        try {
          doc.addImage(graphImage, "PNG", margin, y, pageWidth - margin * 2, 60);
          y += 65;
        } catch (e) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8.5);
          doc.setTextColor(120, 130, 140);
          doc.text("[Graph visual snapshot render failed to embed]", margin, y);
          y += 8;
        }
      } else {
        doc.setFillColor(245, 247, 250);
        doc.setDrawColor(210, 220, 230);
        doc.rect(margin, y, pageWidth - margin * 2, 25, "FD");
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 115, 130);
        doc.text("Interactive 3D WebGL Graph visual active in NEXUS Investigation console.", margin + 5, y + 13);
        y += 30;
      }
    }
  }

  // IDENTITY CONTINUITY
  if (sections.identityContinuity && data.continuityAlerts.length > 0) {
    checkPageOverflow(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 34);
    doc.text("4. IDENTITY CONTINUITY & TRANSITION FLOWS", margin, y);
    y += 6;
    doc.setDrawColor(15, 23, 34);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    data.continuityAlerts.forEach((alt, idx) => {
      checkPageOverflow(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(25, 40, 60);
      doc.text(`${idx + 1}. ${alt.identifierKind}: ${alt.fromLabel} (${alt.fromId}) → ${alt.toLabel} (${alt.toId})`, margin, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 95, 110);
      doc.text(`   Confidence: ${Math.round((alt.confidence || 0.9) * 100)}% | Evidence: ${alt.evidence?.[0] || "Shared identifier link"}`, margin, y);
      y += 6;
    });

    y += 4;
  }

  // TEMPORAL ANALYSIS
  if (sections.temporalAnalysis && data.timeline.length > 0) {
    checkPageOverflow(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 34);
    doc.text("5. TEMPORAL ANALYSIS & TIMELINE LOGS", margin, y);
    y += 6;
    doc.setDrawColor(15, 23, 34);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    data.timeline.slice(0, 6).forEach((evt) => {
      checkPageOverflow(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 45, 60);
      doc.text(`[${evt.timestamp || "N/A"}] ${evt.title}`, margin, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(90, 105, 120);
      doc.text(doc.splitTextToSize(evt.description, pageWidth - margin * 2 - 5), margin + 3, y);
      y += 6;
    });

    y += 4;
  }

  // JURISDICTION ANALYSIS & MAP SNAPSHOT
  if (sections.jurisdictionAnalysis) {
    checkPageOverflow(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 34);
    doc.text("6. JURISDICTIONAL FOOTPRINT & MOVEMENT", margin, y);
    y += 6;
    doc.setDrawColor(15, 23, 34);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    if (data.jurisdictionAlerts.length > 0) {
      data.jurisdictionAlerts.forEach((jAlert, idx) => {
        checkPageOverflow(10);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(`${idx + 1}. Inter-State Corridor: ${jAlert.fromState} → ${jAlert.toState} (Shared Entity: ${jAlert.sharedEntityLabel})`, margin + 3, y);
        y += 5;
      });
    }

    if (sections.mapSnapshot) {
      checkPageOverflow(40);
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("Leaflet GIS Map Visual Snapshot:", margin, y);
      y += 5;

      if (mapImage) {
        try {
          doc.addImage(mapImage, "PNG", margin, y, pageWidth - margin * 2, 55);
          y += 60;
        } catch (e) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8.5);
          doc.text("[Map snapshot render failed to embed]", margin, y);
          y += 8;
        }
      } else {
        doc.setFillColor(245, 247, 250);
        doc.setDrawColor(210, 220, 230);
        doc.rect(margin, y, pageWidth - margin * 2, 20, "FD");
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 115, 130);
        doc.text("No GIS coordinates available for this investigation.", margin + 5, y + 12);
        y += 25;
      }
    }
  }

  // DETECTED PATTERNS
  if (sections.detectedPatterns && data.patternLeads.length > 0) {
    checkPageOverflow(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 34);
    doc.text("7. DETECTED PATTERNS & ANOMALY LEADS", margin, y);
    y += 6;
    doc.setDrawColor(15, 23, 34);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    data.patternLeads.forEach((pat, idx) => {
      checkPageOverflow(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(180, 50, 50);
      doc.text(`${idx + 1}. [${pat.severity}] ${pat.title} (${Math.round(pat.confidence * 100)}% Confidence)`, margin, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(50, 65, 80);
      doc.text(doc.splitTextToSize(pat.explanation, pageWidth - margin * 2 - 5), margin + 3, y);
      y += 8;
    });

    y += 4;
  }

  // EXPLAINABLE EVIDENCE (6-W)
  if (sections.evidenceAnalysis && data.evidence?.items) {
    checkPageOverflow(45);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 34);
    doc.text("8. EXPLAINABLE EVIDENCE SYSTEM (6-W)", margin, y);
    y += 6;
    doc.setDrawColor(15, 23, 34);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    data.evidence.items.forEach((ev, idx) => {
      checkPageOverflow(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 45, 60);
      doc.text(`${idx + 1}. [${ev.category}] ${ev.id}:`, margin, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(70, 85, 100);
      doc.text(doc.splitTextToSize(ev.statement, pageWidth - margin * 2 - 5), margin + 3, y);
      y += 7;
    });

    y += 4;
  }

  // APPENDIX
  if (sections.appendix && data.graph?.nodes) {
    checkPageOverflow(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 34);
    doc.text("9. APPENDIX: COMPLETE NODE INDEX", margin, y);
    y += 6;
    doc.setDrawColor(15, 23, 34);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    data.graph.nodes.slice(0, 15).forEach((n, idx) => {
      checkPageOverflow(7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(60, 75, 90);
      doc.text(`${idx + 1}. ${n.id} | ${n.label} | ${n.type.toUpperCase()} | Community: ${n.communityId ?? "1"}`, margin + 3, y);
      y += 4.5;
    });
  }

  return doc;
}

// Generate Complete Case Package ZIP (PDF + JSON + CSVs)
export async function generateCompleteCasePackage(
  data: ReportDataBundle,
  sections: ReportSectionsState,
  graphImage?: string | null,
  mapImage?: string | null
): Promise<Blob> {
  const zip = new JSZip();

  // 1. Add PDF Dossier
  const doc = generatePdfDossier(data, sections, graphImage, mapImage);
  const pdfBlob = doc.output("blob");
  zip.file("Investigation_Dossier.pdf", pdfBlob);

  // 2. Add JSON
  const jsonStr = generateJsonPackage(data);
  zip.file("investigation_data.json", jsonStr);

  // 3. Add CSVs
  const csvMap = generateCsvDatasets(data);
  Object.entries(csvMap).forEach(([filename, csvContent]) => {
    zip.file(filename, csvContent);
  });

  return await zip.generateAsync({ type: "blob" });
}

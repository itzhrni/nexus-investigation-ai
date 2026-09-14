import { useState } from "react";
import {
  FileText,
  Shield,
  MapPin,
  Calendar,
  Network,
  Users,
  ChevronRight,
} from "lucide-react";
import { useInvestigationStore } from "@/store/investigationStore";

interface CaseItem {
  id: string;
  label: string;
  policeStation: string;
  district: string;
  state: string;
  date?: string;
  sections?: string;
  relatedEntities: { id: string; label: string; type: string }[];
}

export function CasesWorkspace() {
  const graph = useInvestigationStore((s) => s.graph);
  const investigation = useInvestigationStore((s) => s.investigation);
  const jurisdictionAlerts = useInvestigationStore((s) => s.jurisdictionAlerts);
  const timeline = useInvestigationStore((s) => s.timeline);
  const selectMatch = useInvestigationStore((s) => s.selectMatch);
  const selectNode = useInvestigationStore((s) => s.selectNode);
  const setWorkspaceFocus = useInvestigationStore((s) => s.setWorkspaceFocus);

  // Extract cases from graph nodes
  const caseNodes = (graph?.nodes || []).filter((n) => n.type === "case");

  // Collect all cases from graph, jurisdiction alerts, and timeline
  const caseMap = new Map<string, CaseItem>();

  // 1. Known primary cases from active investigation session
  caseMap.set("CASE-142", {
    id: "CASE-142",
    label: "FIR #142/2026",
    policeStation: "Ambattur Police Station",
    district: "Chennai",
    state: "Tamil Nadu",
    date: "2026-06-16",
    sections: "IPC 420, 120B (Cheating & Conspiracy)",
    relatedEntities: [],
  });

  caseMap.set("CASE-217", {
    id: "CASE-217",
    label: "FIR #217/2026",
    policeStation: "Cubbon Park PS",
    district: "Bengaluru Urban",
    state: "Karnataka",
    date: "2026-06-18",
    sections: "IPC 379, 411 (Inter-state Stolen Property)",
    relatedEntities: [],
  });

  // 2. Add or enrich with graph case nodes
  caseNodes.forEach((node) => {
    const existing = caseMap.get(node.id) || {
      id: node.id,
      label: node.label,
      policeStation: "Jurisdiction Police Station",
      district: "District HQ",
      state: "State Jurisdiction",
      relatedEntities: [],
    };

    // Find connected entities in graph edges
    const connectedNodeIds = new Set<string>();
    (graph?.edges || []).forEach((e) => {
      if (e.source === node.id) connectedNodeIds.add(e.target);
      if (e.target === node.id) connectedNodeIds.add(e.source);
    });

    const related = (graph?.nodes || [])
      .filter((n) => connectedNodeIds.has(n.id))
      .map((n) => ({ id: n.id, label: n.label, type: n.type }));

    existing.relatedEntities = related;
    caseMap.set(node.id, existing);
  });

  // 3. Connect entities from timeline events
  timeline.forEach((evt) => {
    if (evt.kind === "INVOLVED_IN" || evt.title.toLowerCase().includes("case") || evt.title.toLowerCase().includes("fir")) {
      const matchedCaseId = evt.caseId || (evt.entityIds.find((id) => id.startsWith("CASE") || id.startsWith("FIR")) ?? "CASE-142");
      const c = caseMap.get(matchedCaseId);
      if (c) {
        evt.entityIds.forEach((eid) => {
          if (!eid.startsWith("CASE") && !eid.startsWith("FIR") && !c.relatedEntities.some((r) => r.id === eid)) {
            const node = (graph?.nodes || []).find((n) => n.id === eid);
            c.relatedEntities.push({
              id: eid,
              label: node?.label || eid,
              type: node?.type || "person",
            });
          }
        });
      }
    }
  });

  // 4. Enrich with jurisdiction alerts
  jurisdictionAlerts.forEach((alert) => {
    if (caseMap.has("CASE-142")) {
      const c142 = caseMap.get("CASE-142")!;
      if (!c142.relatedEntities.some((r) => r.id === alert.sharedEntityId)) {
        c142.relatedEntities.push({
          id: alert.sharedEntityId,
          label: alert.sharedEntityLabel,
          type: "person",
        });
      }
    }
  });

  const casesList = Array.from(caseMap.values());
  const [selectedCaseId, setSelectedCaseId] = useState<string>(casesList[0]?.id || "CASE-142");

  const selectedCase = casesList.find((c) => c.id === selectedCaseId) || casesList[0];

  const handleOpenInvestigation = async (caseId: string) => {
    await selectMatch(caseId);
    setWorkspaceFocus("investigation");
  };

  const handleOpenNetwork = async (caseId: string) => {
    await selectMatch(caseId);
    setWorkspaceFocus("network");
  };

  const handleSelectRelatedEntity = async (entityId: string) => {
    await selectNode(entityId);
    setWorkspaceFocus("investigation");
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-nexus-bg p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex shrink-0 flex-col gap-1 border-b border-nexus-line pb-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-nexus-cyan uppercase">
          <span>CASE MANAGEMENT & FIRST INFORMATION REPORTS</span>
          <span className="h-1 w-1 rounded-full bg-nexus-cyan/40" />
          <span className="text-nexus-muted">CRIME & JURISDICTION RECORDS</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-nexus-text">
            FIR & Legal Cases ({casesList.length})
          </h1>
          <span className="font-mono text-xs text-nexus-muted">
            Investigation Session: <span className="text-nexus-text">{investigation?.id ?? "INV-042"}</span>
          </span>
        </div>
        <p className="text-xs text-nexus-muted">
          Law enforcement FIRs, jurisdictional records, and judicial filings linked to suspected targets.
        </p>
      </div>

      {/* Main Content Area: 2-Column Split */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
        {/* Left Column: Cases Table / List (7 cols) */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-nexus-line bg-nexus-raised/90 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-nexus-line bg-nexus-panel/50 px-4 py-3">
            <span className="font-mono text-xs font-semibold tracking-wider text-nexus-cyan uppercase">
              REGISTERED CASES ({casesList.length})
            </span>
            <span className="font-mono text-[10px] text-nexus-muted">
              Select case to inspect evidence and linked entities
            </span>
          </div>

          <div className="flex-1 divide-y divide-nexus-line/40 overflow-y-auto">
            {casesList.map((c) => {
              const isSelected = c.id === selectedCaseId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
                    isSelected
                      ? "bg-nexus-cyan/10 border-l-4 border-l-nexus-cyan"
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <FileText className={`h-4 w-4 shrink-0 ${isSelected ? "text-nexus-cyan" : "text-nexus-muted"}`} />
                      <span className="font-semibold text-sm text-nexus-text">{c.label}</span>
                      <span className="rounded border border-nexus-line bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-nexus-muted">
                        {c.id}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-nexus-muted">
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300">
                        <MapPin className="h-3 w-3 text-nexus-cyan/80" />
                        <span>
                          {c.policeStation}, {c.district} ({c.state})
                        </span>
                      </div>
                      {c.date && (
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <Calendar className="h-3 w-3 text-nexus-muted" />
                          <span>{c.date}</span>
                        </div>
                      )}
                    </div>

                    {c.sections && (
                      <div className="mt-1 text-[11px] text-amber-200/80 font-mono">
                        {c.sections}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 rounded border border-nexus-line bg-black/40 px-2 py-1 font-mono text-[11px] text-nexus-muted">
                      <Users className="h-3 w-3 text-nexus-cyan" />
                      <span>{c.relatedEntities.length}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isSelected ? "text-nexus-cyan" : "text-nexus-muted/50"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Detail Inspector (5 cols) */}
        {selectedCase ? (
          <div className="flex min-h-0 flex-col overflow-y-auto rounded-lg border border-nexus-line bg-nexus-raised/95 p-5 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-nexus-line pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300 uppercase">
                  ACTIVE FIR RECORD
                </span>
                <span className="font-mono text-xs text-nexus-muted">{selectedCase.id}</span>
              </div>
            </div>

            <h2 className="mt-3 text-lg font-bold tracking-tight text-nexus-text">
              {selectedCase.label}
            </h2>

            {/* Jurisdiction Breakdown */}
            <div className="mt-4 rounded-md border border-nexus-line/70 bg-black/30 p-3 space-y-2">
              <div className="font-mono text-[10px] tracking-wider text-nexus-cyan uppercase">
                JURISDICTIONAL DETAILS
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-[10px] font-mono text-nexus-muted uppercase">Police Station</span>
                  <span className="font-medium text-slate-200">{selectedCase.policeStation}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-nexus-muted uppercase">District</span>
                  <span className="font-medium text-slate-200">{selectedCase.district}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-nexus-muted uppercase">State</span>
                  <span className="font-medium text-slate-200">{selectedCase.state}</span>
                </div>
                {selectedCase.date && (
                  <div>
                    <span className="block text-[10px] font-mono text-nexus-muted uppercase">Incident / Registration</span>
                    <span className="font-medium text-slate-200">{selectedCase.date}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Legal Sections */}
            {selectedCase.sections && (
              <div className="mt-3 rounded-md border border-amber-500/20 bg-amber-500/[0.04] p-3">
                <div className="font-mono text-[10px] tracking-wider text-amber-300 uppercase">
                  CHARGES & SECTIONS
                </div>
                <p className="mt-1 text-xs text-amber-200/90">{selectedCase.sections}</p>
              </div>
            )}

            {/* Connected Entities in Network */}
            <div className="mt-4 flex-1">
              <div className="flex items-center justify-between border-b border-nexus-line/50 pb-1.5">
                <span className="font-mono text-[10px] tracking-wider text-nexus-cyan uppercase">
                  ASSOCIATED ENTITIES ({selectedCase.relatedEntities.length})
                </span>
                <span className="font-mono text-[10px] text-nexus-muted">Click to select</span>
              </div>

              {selectedCase.relatedEntities.length > 0 ? (
                <div className="mt-2.5 space-y-2">
                  {selectedCase.relatedEntities.map((ent) => (
                    <div
                      key={ent.id}
                      onClick={() => void handleSelectRelatedEntity(ent.id)}
                      className="group flex cursor-pointer items-center justify-between rounded border border-nexus-line/60 bg-black/40 px-3 py-2 text-xs transition-colors hover:border-nexus-cyan/50 hover:bg-nexus-panel/70"
                    >
                      <div>
                        <div className="font-medium text-slate-200 group-hover:text-nexus-cyan">
                          {ent.label}
                        </div>
                        <div className="font-mono text-[10px] text-nexus-muted">
                          {ent.type.toUpperCase()} · {ent.id}
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-nexus-muted group-hover:text-nexus-cyan" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded border border-nexus-line/40 bg-black/20 p-3 text-center text-xs text-nexus-muted">
                  No additional entities mapped to this FIR in the current focal depth.
                </div>
              )}
            </div>

            {/* Investigation Actions */}
            <div className="mt-6 flex flex-col gap-2 border-t border-nexus-line pt-4">
              <button
                type="button"
                onClick={() => void handleOpenInvestigation(selectedCase.id)}
                className="flex items-center justify-center gap-2 rounded bg-nexus-cyan/15 px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-nexus-cyan ring-1 ring-nexus-cyan/40 hover:bg-nexus-cyan/25 transition-all"
              >
                <Shield className="h-4 w-4" />
                <span>OPEN IN INVESTIGATION GRAPH</span>
              </button>
              <button
                type="button"
                onClick={() => void handleOpenNetwork(selectedCase.id)}
                className="flex items-center justify-center gap-2 rounded border border-nexus-line bg-black/40 px-4 py-2 font-mono text-xs text-nexus-muted hover:border-nexus-cyan/40 hover:text-nexus-text transition-all"
              >
                <Network className="h-3.5 w-3.5 text-nexus-muted" />
                <span>EXPLORE IN NETWORK MODE</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-nexus-line bg-black/20 p-8 text-center text-xs text-nexus-muted lg:col-span-5">
            Select a case to inspect FIR details and linked subjects.
          </div>
        )}
      </div>
    </div>
  );
}

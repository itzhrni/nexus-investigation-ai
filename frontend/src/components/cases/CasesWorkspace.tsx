import { useState, useMemo } from "react";

import {
  FileText,
  Shield,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowLeft,
  Filter,
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
  crimeType?: string;
  summary?: string;
  relationshipToFocal?: string;
  relatedEntities: { id: string; label: string; type: string }[];
}

export function CasesWorkspace() {
  const graph = useInvestigationStore((s) => s.graph);
  const focalEntityId = useInvestigationStore((s) => s.focalEntityId);
  const selectedEntity = useInvestigationStore((s) => s.selectedEntity);
  const availableCases = useInvestigationStore((s) => s.availableCases);

  const activeCaseId = useInvestigationStore(
    (s) => s.activeCaseId || s.investigation?.id || "CASE-142",
  );

  const switchCase = useInvestigationStore((s) => s.switchCase);
  const selectNode = useInvestigationStore((s) => s.selectNode);
  const setWorkspaceFocus = useInvestigationStore(
    (s) => s.setWorkspaceFocus,
  );

  const [showGlobalBrowser, setShowGlobalBrowser] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const focalName =
    selectedEntity?.label || focalEntityId || "Unknown Entity";

  const hasFocalEntity = Boolean(focalEntityId);

  // ---------------------------------------------------------------------------
  // MODE 1: ENTITY-SCOPED CASES
  // ---------------------------------------------------------------------------

  const entityScopedCases = useMemo<CaseItem[]>(() => {
    if (!focalEntityId || !graph) return [];

    const nodes = graph.nodes || [];
    const edges = graph.edges || [];

    const caseNodes = nodes.filter(
      (n) =>
        n.type === "case" ||
        n.id.startsWith("CASE-") ||
        n.id.startsWith("FIR-") ||
        n.id.startsWith("FIR") ||
        n.id.startsWith("CRM"),
    );

    const result: CaseItem[] = [];

    caseNodes.forEach((node) => {
      const directEdge = edges.find(
        (e) =>
          (e.source === node.id && e.target === focalEntityId) ||
          (e.target === node.id && e.source === focalEntityId),
      );

      const connectedNodeIds = new Set<string>();

      edges.forEach((e) => {
        if (e.source === node.id) connectedNodeIds.add(e.target);
        if (e.target === node.id) connectedNodeIds.add(e.source);
      });

      const isIncident =
        Boolean(directEdge) || connectedNodeIds.has(focalEntityId);

      if (!isIncident) return;

      const props = (node as any).properties || {};

      const relatedEntities = nodes
        .filter(
          (n) => connectedNodeIds.has(n.id) && n.id !== node.id,
        )
        .map((n) => ({
          id: n.id,
          label: n.label,
          type: n.type,
        }));

      const relationshipToFocal = directEdge
        ? directEdge.type
        : "CONNECTED_VIA_NETWORK";

      result.push({
        id: node.id,
        label: props.fir_number || node.label || node.id,
        policeStation:
          props.police_station ||
          props.policeStation ||
          "Jurisdiction Police Station",
        district: props.district || "District HQ",
        state: props.state || "State Police",
        date: props.incident_date || props.date || undefined,
        sections:
          props.sections ||
          props.crime_type ||
          props.crimeType ||
          "Under Investigation",
        crimeType: props.crime_type || props.crimeType,
        summary: props.summary,
        relationshipToFocal,
        relatedEntities,
      });
    });

    return result;
  }, [graph, focalEntityId]);

  // ---------------------------------------------------------------------------
  // MODE 2: GLOBAL CASE BROWSER
  // ---------------------------------------------------------------------------

  const globalCases = useMemo<CaseItem[]>(() => {
    return availableCases.map((c) => ({
      id: c.id,
      label: c.label,
      policeStation: c.policeStation || "Central Police Station",
      district: c.district || "Metropolitan District",
      state: c.state || "State Police",
      date: c.registeredDate,
      sections: c.sections || c.crimeType || "Under Investigation",
      crimeType: c.crimeType,
      relationshipToFocal: undefined,
      relatedEntities: [],
    }));
  }, [availableCases]);

  const isEntityMode = hasFocalEntity && !showGlobalBrowser;

  const displayList = useMemo(() => {
    if (isEntityMode) return entityScopedCases;

    if (!globalSearchQuery.trim()) return globalCases;

    const q = globalSearchQuery.toLowerCase();

    return globalCases.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.policeStation.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        (c.crimeType && c.crimeType.toLowerCase().includes(q)),
    );
  }, [
    isEntityMode,
    entityScopedCases,
    globalCases,
    globalSearchQuery,
  ]);

  const activeSelectedCase =
    displayList.find((c) => c.id === selectedCaseId) ||
    displayList[0] ||
    null;

  const handleOpenInvestigation = async (caseId: string) => {
    await switchCase(caseId);
    setWorkspaceFocus("investigation");
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
          <span className="text-nexus-muted">
            CRIME & JURISDICTION RECORDS
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-nexus-text">
              {isEntityMode ? (
                <>
                  Cases Related to{" "}
                  <span className="text-nexus-cyan">{focalName}</span>{" "}
                  <span className="font-mono text-sm text-nexus-muted font-normal">
                    ({focalEntityId})
                  </span>
                </>
              ) : (
                "All Registered Cases & FIRs"
              )}
            </h1>

            <p className="text-xs text-nexus-muted">
              {isEntityMode
                ? `Showing legal records and FIRs connected in the active graph for ${focalName}.`
                : "Global registry of judicial filings, FIRs, and crime incidents across all jurisdictions."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasFocalEntity && (
              <button
                type="button"
                onClick={() =>
                  setShowGlobalBrowser((prev) => !prev)
                }
                className="flex items-center gap-1.5 rounded border border-nexus-line bg-black/40 px-3 py-1 font-mono text-xs text-nexus-muted transition-colors hover:border-nexus-cyan/50 hover:text-nexus-cyan"
              >
                {showGlobalBrowser ? (
                  <>
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>BACK TO {focalEntityId} CASES</span>
                  </>
                ) : (
                  <>
                    <Filter className="h-3.5 w-3.5" />
                    <span>
                      BROWSE ALL FIRS ({availableCases.length})
                    </span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-nexus-muted">
                Active Case:
              </span>
              <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
                {activeCaseId}
              </span>
            </div>
          </div>
        </div>

        {!isEntityMode && (
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-nexus-muted" />

              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) =>
                  setGlobalSearchQuery(e.target.value)
                }
                placeholder="Filter cases by number, station, crime type, or state..."
                className="w-full rounded border border-nexus-line bg-black/40 py-1.5 pl-9 pr-3 font-mono text-xs text-nexus-text placeholder:text-nexus-muted/60 focus:border-nexus-cyan/60 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
        {/* Cases List */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-nexus-line bg-nexus-raised/90 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-nexus-line bg-nexus-panel/50 px-4 py-3">
            <span className="font-mono text-xs font-semibold tracking-wider text-nexus-cyan uppercase">
              {isEntityMode
                ? `RELATED CASES (${displayList.length})`
                : `REGISTERED CASES (${displayList.length})`}
            </span>

            <span className="font-mono text-[10px] text-nexus-muted">
              Select case to inspect evidence and linked entities
            </span>
          </div>

          <div className="flex-1 divide-y divide-nexus-line/40 overflow-y-auto">
            {displayList.length > 0 ? (
              displayList.map((c) => {
                const isSelected =
                  c.id ===
                  (activeSelectedCase?.id || selectedCaseId);

                const isActive = c.id === activeCaseId;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
                      isSelected
                        ? "border-l-4 border-l-nexus-cyan bg-nexus-cyan/10"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <FileText
                          className={`h-4 w-4 shrink-0 ${
                            isSelected
                              ? "text-nexus-cyan"
                              : "text-nexus-muted"
                          }`}
                        />

                        <span className="text-sm font-semibold text-nexus-text">
                          {c.label}
                        </span>

                        <span className="rounded border border-nexus-line bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-nexus-muted">
                          {c.id}
                        </span>

                        {isActive && (
                          <span className="rounded border border-emerald-500/40 bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-300">
                            ACTIVE CASE
                          </span>
                        )}

                        {c.relationshipToFocal && (
                          <span className="rounded border border-nexus-cyan/30 bg-nexus-cyan/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-nexus-cyan">
                            {c.relationshipToFocal}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-nexus-muted">
                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300">
                          <MapPin className="h-3 w-3 text-nexus-cyan/80" />
                          <span>
                            {c.policeStation}, {c.district} (
                            {c.state})
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
                        <div className="mt-1 font-mono text-[11px] text-amber-200/80">
                          {c.sections}
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex shrink-0 items-center gap-3">
                      <div className="flex items-center gap-1 rounded border border-nexus-line bg-black/40 px-2 py-1 font-mono text-[11px] text-nexus-muted">
                        <Users className="h-3 w-3 text-nexus-cyan" />
                        <span>{c.relatedEntities.length}</span>
                      </div>

                      <ChevronRight
                        className={`h-4 w-4 ${
                          isSelected
                            ? "text-nexus-cyan"
                            : "text-nexus-muted/50"
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-3 rounded-full border border-nexus-line bg-black/40 p-3">
                  <AlertCircle className="h-6 w-6 text-nexus-muted" />
                </div>

                <h3 className="font-mono text-sm font-semibold tracking-wider text-slate-200 uppercase">
                  NO RELATED CASES
                </h3>

                <p className="mt-1.5 max-w-md text-xs text-nexus-muted">
                  No case/FIR relationship was found for this
                  entity in the current dataset.
                </p>

                {hasFocalEntity && (
                  <button
                    type="button"
                    onClick={() => setShowGlobalBrowser(true)}
                    className="mt-4 rounded border border-nexus-line bg-nexus-panel/70 px-4 py-2 font-mono text-xs text-nexus-cyan transition-colors hover:bg-nexus-cyan/10"
                  >
                    Browse All Registered Cases (
                    {availableCases.length})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Case Detail Inspector */}
        {activeSelectedCase ? (
          <div className="flex min-h-0 flex-col overflow-y-auto rounded-lg border border-nexus-line bg-nexus-raised/95 p-5 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-nexus-line pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300 uppercase">
                  ACTIVE FIR RECORD
                </span>

                <span className="font-mono text-xs text-nexus-muted">
                  {activeSelectedCase.id}
                </span>
              </div>

              {activeSelectedCase.id === activeCaseId && (
                <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>LOADED IN WORKSPACE</span>
                </div>
              )}
            </div>

            <h2 className="mt-3 text-lg font-bold tracking-tight text-nexus-text">
              {activeSelectedCase.label}
            </h2>

            {hasFocalEntity &&
              activeSelectedCase.relationshipToFocal && (
                <div className="mt-3 space-y-1.5 rounded-md border border-nexus-cyan/30 bg-nexus-cyan/5 p-3">
                  <div className="font-mono text-[10px] tracking-wider text-nexus-cyan uppercase">
                    FOCAL ENTITY RELATIONSHIP
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="block font-mono text-[10px] text-nexus-muted uppercase">
                        Focal Entity
                      </span>
                      <span className="font-medium text-slate-200">
                        {focalName} ({focalEntityId})
                      </span>
                    </div>

                    <div>
                      <span className="block font-mono text-[10px] text-nexus-muted uppercase">
                        Case
                      </span>
                      <span className="font-medium text-slate-200">
                        {activeSelectedCase.id}
                      </span>
                    </div>

                    <div>
                      <span className="block font-mono text-[10px] text-nexus-muted uppercase">
                        Relationship
                      </span>
                      <span className="font-mono font-semibold text-nexus-cyan">
                        {activeSelectedCase.relationshipToFocal}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {/* Jurisdiction */}
            <div className="mt-4 space-y-2 rounded-md border border-nexus-line/70 bg-black/30 p-3">
              <div className="font-mono text-[10px] tracking-wider text-nexus-cyan uppercase">
                JURISDICTIONAL DETAILS
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block font-mono text-[10px] text-nexus-muted uppercase">
                    Police Station
                  </span>
                  <span className="font-medium text-slate-200">
                    {activeSelectedCase.policeStation}
                  </span>
                </div>

                <div>
                  <span className="block font-mono text-[10px] text-nexus-muted uppercase">
                    District
                  </span>
                  <span className="font-medium text-slate-200">
                    {activeSelectedCase.district}
                  </span>
                </div>

                <div>
                  <span className="block font-mono text-[10px] text-nexus-muted uppercase">
                    State
                  </span>
                  <span className="font-medium text-slate-200">
                    {activeSelectedCase.state}
                  </span>
                </div>

                {activeSelectedCase.date && (
                  <div>
                    <span className="block font-mono text-[10px] text-nexus-muted uppercase">
                      Incident / Registration
                    </span>
                    <span className="font-medium text-slate-200">
                      {activeSelectedCase.date}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Legal Sections */}
            {activeSelectedCase.sections && (
              <div className="mt-3 rounded-md border border-amber-500/20 bg-amber-500/[0.04] p-3">
                <div className="font-mono text-[10px] tracking-wider text-amber-300 uppercase">
                  CHARGES & SECTIONS
                </div>

                <p className="mt-1 text-xs text-amber-200/90">
                  {activeSelectedCase.sections}
                </p>
              </div>
            )}

            {/* Summary */}
            {activeSelectedCase.summary && (
              <div className="mt-3 rounded-md border border-nexus-line/50 bg-black/20 p-3">
                <div className="font-mono text-[10px] tracking-wider text-nexus-muted uppercase">
                  INVESTIGATION SUMMARY
                </div>

                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  {activeSelectedCase.summary}
                </p>
              </div>
            )}

            {/* Connected Entities */}
            <div className="mt-4 flex-1">
              <div className="flex items-center justify-between border-b border-nexus-line/50 pb-1.5">
                <span className="font-mono text-[10px] tracking-wider text-nexus-cyan uppercase">
                  ASSOCIATED ENTITIES (
                  {activeSelectedCase.relatedEntities.length})
                </span>

                <span className="font-mono text-[10px] text-nexus-muted">
                  Click to select
                </span>
              </div>

              {activeSelectedCase.relatedEntities.length > 0 ? (
                <div className="mt-2.5 space-y-2">
                  {activeSelectedCase.relatedEntities.map((ent) => (
                    <div
                      key={ent.id}
                      onClick={() =>
                        void handleSelectRelatedEntity(ent.id)
                      }
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
                  No additional entities mapped to this case
                  record.
                </div>
              )}
            </div>

            {/* Investigation Actions */}
            <div className="mt-6 flex flex-col gap-2 border-t border-nexus-line pt-4">
              <button
                type="button"
                onClick={() =>
                  void handleOpenInvestigation(
                    activeSelectedCase.id,
                  )
                }
                className="flex items-center justify-center gap-2 rounded bg-nexus-cyan/15 px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-nexus-cyan ring-1 ring-nexus-cyan/40 transition-all hover:bg-nexus-cyan/25"
              >
                <Shield className="h-4 w-4" />

                <span>
                  {activeSelectedCase.id === activeCaseId
                    ? "OPEN ACTIVE INVESTIGATION GRAPH"
                    : "SWITCH ACTIVE CASE & INVESTIGATE"}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleOpenInvestigation(
                    activeSelectedCase.id,
                  )
                }
                className="flex items-center justify-center gap-2 rounded border border-nexus-line bg-black/40 px-4 py-2 font-mono text-xs text-nexus-muted transition-all hover:border-nexus-cyan/40 hover:text-nexus-text"
              >
                <Shield className="h-3.5 w-3.5 text-nexus-muted" />
                <span>EXPLORE INVESTIGATION</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-nexus-line bg-black/20 p-8 text-center text-xs text-nexus-muted lg:col-span-5">
            {displayList.length === 0
              ? "Select an entity with related FIRs or browse all registered cases."
              : "Select a case to inspect FIR details and linked subjects."}
          </div>
        )}
      </div>
    </div>
  );
}
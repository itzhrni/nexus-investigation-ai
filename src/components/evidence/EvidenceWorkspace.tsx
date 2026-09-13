import { useState } from "react";
import {
  GitBranch,
  ArrowRight,
  Filter,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useInvestigationStore } from "@/store/investigationStore";
import type { EvidenceCategory } from "@/types/nexus";

type WorkspaceEvidenceCategory =
  | "ALL"
  | "COMMUNICATION"
  | "FINANCIAL"
  | "VEHICLE"
  | "LOCATION"
  | "CASE / CRIME"
  | "IDENTITY CONTINUITY"
  | "CROSS-JURISDICTION";

const CATEGORIES: WorkspaceEvidenceCategory[] = [
  "ALL",
  "COMMUNICATION",
  "FINANCIAL",
  "VEHICLE",
  "LOCATION",
  "CASE / CRIME",
  "IDENTITY CONTINUITY",
  "CROSS-JURISDICTION",
];

interface CategorizedEvidence {
  id: string;
  category: WorkspaceEvidenceCategory;
  rawCategory?: EvidenceCategory;
  title: string;
  statement: string;
  confidence?: number;
  confidenceBand?: string;
  supportingEntities: string[];
  sourceRecords: { id: string; label: string; kind?: string }[];
  verificationStatus: "VERIFIED" | "CORROBORATED" | "INFERRED" | "REQUIRES VERIFICATION";
}

export function EvidenceWorkspace() {
  const evidenceBundle = useInvestigationStore((s) => s.evidence);
  const selectedEntity = useInvestigationStore((s) => s.selectedEntity);
  const focalId = useInvestigationStore((s) => s.focalEntityId);
  const jurisdictionAlerts = useInvestigationStore((s) => s.jurisdictionAlerts);
  const continuityAlerts = useInvestigationStore((s) => s.continuityAlerts);
  const selectNode = useInvestigationStore((s) => s.selectNode);
  const setWorkspaceFocus = useInvestigationStore((s) => s.setWorkspaceFocus);

  const [activeCategory, setActiveCategory] = useState<WorkspaceEvidenceCategory>("ALL");

  const evidenceItems: CategorizedEvidence[] = [];

  // 1. Process items from evidenceBundle
  if (evidenceBundle?.items) {
    evidenceBundle.items.forEach((item, idx) => {
      let group: WorkspaceEvidenceCategory = "COMMUNICATION";
      const s = (item.statement + " " + item.category).toLowerCase();

      if (s.includes("phone") || s.includes("call") || s.includes("sim") || s.includes("communication")) {
        group = "COMMUNICATION";
      } else if (s.includes("fund") || s.includes("transfer") || s.includes("bank") || s.includes("account") || s.includes("financial")) {
        group = "FINANCIAL";
      } else if (s.includes("vehicle") || s.includes("car") || s.includes("plate") || s.includes("chassis")) {
        group = "VEHICLE";
      } else if (s.includes("locat") || s.includes("seen at") || s.includes("spotted") || s.includes("ambattur") || s.includes("bengaluru")) {
        group = "LOCATION";
      } else if (s.includes("fir") || s.includes("case") || s.includes("crime") || s.includes("offense")) {
        group = "CASE / CRIME";
      }

      let verificationStatus: CategorizedEvidence["verificationStatus"] = "VERIFIED";
      if (item.category === "CORROBORATED") verificationStatus = "CORROBORATED";
      if (item.category === "INFERRED") verificationStatus = "INFERRED";
      if (item.category === "UNVERIFIED") verificationStatus = "REQUIRES VERIFICATION";

      evidenceItems.push({
        id: item.id || `EV-ITEM-${idx}`,
        category: group,
        rawCategory: item.category,
        title: `${group} EVIDENCE RECORD`,
        statement: item.statement,
        confidence: evidenceBundle.confidence,
        confidenceBand: evidenceBundle.confidenceBand,
        supportingEntities: [selectedEntity?.label || focalId || "Subject"],
        sourceRecords: item.sourceRecords,
        verificationStatus,
      });
    });
  }

  // 2. Add Identity Continuity items
  continuityAlerts.forEach((alert) => {
    evidenceItems.push({
      id: alert.id,
      category: "IDENTITY CONTINUITY",
      title: `Identifier Transition: ${alert.fromLabel} → ${alert.toLabel}`,
      statement: `Subject replaced ${alert.identifierKind} (${alert.fromId}) with new identifier (${alert.toId}). Supported by ${alert.evidence.join("; ")}.`,
      confidence: alert.confidence,
      confidenceBand: alert.confidence >= 0.85 ? "HIGH" : "MEDIUM",
      supportingEntities: [alert.fromLabel, alert.toLabel],
      sourceRecords: alert.evidence.map((e, i) => ({ id: `REC-CONT-${i}`, label: e })),
      verificationStatus: "REQUIRES VERIFICATION",
    });
  });

  // 3. Add Cross-Jurisdiction items
  jurisdictionAlerts.forEach((j) => {
    evidenceItems.push({
      id: j.id,
      category: "CROSS-JURISDICTION",
      title: `Inter-State Nexus: ${j.fromState} ⟷ ${j.toState}`,
      statement: `Target ${j.sharedEntityLabel} (${j.sharedEntityId}) identified in multi-jurisdiction incidents spanning ${j.fromState} and ${j.toState}.`,
      confidence: j.evidenceStrength === "HIGH" ? 0.92 : 0.75,
      confidenceBand: j.evidenceStrength,
      supportingEntities: [j.sharedEntityLabel],
      sourceRecords: j.supporting.map((s, i) => ({ id: `REC-JUR-${i}`, label: s })),
      verificationStatus: "CORROBORATED",
    });
  });

  const filteredItems = evidenceItems.filter((item) => {
    if (activeCategory === "ALL") return true;
    return item.category === activeCategory;
  });

  const handleEntityClick = async (entityId: string) => {
    await selectNode(entityId);
    setWorkspaceFocus("investigation");
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-nexus-bg p-6 lg:p-8">
      {/* Top Header */}
      <div className="mb-6 flex shrink-0 flex-col gap-1 border-b border-nexus-line pb-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-nexus-cyan uppercase">
          <span>EXPLAINABLE EVIDENCE & MULTI-SOURCE PROVENANCE</span>
          <span className="h-1 w-1 rounded-full bg-nexus-cyan/40" />
          <span className="text-nexus-muted">CORROBORATION REASONING</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-nexus-text">
              Evidence Ledger & Chain of Custody
            </h1>
            <p className="text-xs text-nexus-muted">
              Explainable AI statements, corroboration evidence strength, and underlying multi-source records for{" "}
              <span className="text-nexus-cyan font-mono font-medium">
                {selectedEntity?.label || focalId || "Active Investigation"}
              </span>
            </p>
          </div>

          {/* AI Explainability Badge */}
          <div className="flex items-center gap-2 rounded-lg border border-nexus-cyan/30 bg-nexus-cyan/[0.05] px-3 py-2">
            <Sparkles className="h-4 w-4 text-nexus-cyan" />
            <div className="text-right font-mono text-[10px]">
              <div className="text-nexus-cyan font-semibold">EXPLAINABLE AI ACTIVE</div>
              <div className="text-nexus-muted">No black-box scoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Navigation */}
      <div className="mb-6 flex shrink-0 flex-wrap items-center gap-1.5 border-b border-nexus-line/50 pb-3">
        <Filter className="mr-1 h-3.5 w-3.5 text-nexus-muted" />
        <span className="mr-2 font-mono text-[10px] text-nexus-muted uppercase tracking-wider">
          FILTER CATEGORY:
        </span>
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-mono transition-all",
                active
                  ? "border border-nexus-cyan/50 bg-nexus-cyan/15 text-nexus-cyan shadow-[0_0_8px_rgba(61,214,245,0.15)]"
                  : "border border-nexus-line bg-black/30 text-nexus-muted hover:border-nexus-line/80 hover:text-nexus-text",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Evidence Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredItems.map((item) => {
            const confVal = item.confidence != null
              ? Math.round(item.confidence > 1 ? item.confidence : item.confidence * 100)
              : null;

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-lg border border-nexus-line bg-nexus-raised/90 p-5 shadow-sm transition-all hover:border-nexus-cyan/50 hover:bg-nexus-panel/50"
              >
                <div>
                  {/* Top Bar: Category pill & Verification Status */}
                  <div className="flex items-center justify-between border-b border-nexus-line/40 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-nexus-cyan/40 bg-nexus-cyan/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-nexus-cyan uppercase">
                        {item.category}
                      </span>
                      <span className="font-mono text-[10px] text-nexus-muted">{item.id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {confVal != null && (
                        <span className="font-mono text-xs font-semibold text-emerald-400">
                          {confVal}% {item.confidenceBand ? `· ${item.confidenceBand}` : ""}
                        </span>
                      )}
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase",
                          item.verificationStatus === "VERIFIED" && "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
                          item.verificationStatus === "CORROBORATED" && "bg-sky-500/15 text-sky-300 border border-sky-500/30",
                          item.verificationStatus === "INFERRED" && "bg-amber-500/15 text-amber-300 border border-amber-500/30",
                          item.verificationStatus === "REQUIRES VERIFICATION" && "bg-purple-500/15 text-purple-300 border border-purple-500/30",
                        )}
                      >
                        {item.verificationStatus}
                      </span>
                    </div>
                  </div>

                  {/* Title & Statement */}
                  <h3 className="mt-3 text-sm font-semibold text-nexus-text">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-200">
                    {item.statement}
                  </p>

                  {/* Supporting Entities */}
                  {item.supportingEntities.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[10px] text-nexus-muted uppercase">Linked:</span>
                      {item.supportingEntities.map((ent, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => void handleEntityClick(ent)}
                          className="cursor-pointer rounded border border-nexus-line bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 transition-colors hover:border-nexus-cyan/50 hover:text-nexus-cyan"
                        >
                          {ent}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Supporting Source Records (Provenance) */}
                  {item.sourceRecords.length > 0 && (
                    <div className="mt-3 rounded border border-nexus-line/60 bg-black/30 p-2.5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-nexus-muted block mb-1">
                        PROVENANCE / SOURCE RECORDS ({item.sourceRecords.length}):
                      </span>
                      <div className="space-y-1">
                        {item.sourceRecords.map((rec) => (
                          <div
                            key={rec.id}
                            className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400"
                          >
                            <span className="h-1 w-1 rounded-full bg-nexus-cyan" />
                            <span>{rec.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action */}
                <div className="mt-4 flex items-center justify-between border-t border-nexus-line/40 pt-3">
                  <span className="font-mono text-[10px] text-nexus-muted">Explainable AI Justification</span>
                  <button
                    type="button"
                    onClick={() => setWorkspaceFocus("investigation")}
                    className="flex items-center gap-1 font-mono text-xs text-nexus-cyan hover:underline"
                  >
                    <span>View in Context Rail</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-nexus-line bg-black/20 py-16 text-center">
          <GitBranch className="mb-3 h-8 w-8 text-nexus-muted/60" />
          <h3 className="text-sm font-semibold text-nexus-text">No Evidence in this Category</h3>
          <p className="mt-1 text-xs text-nexus-muted">
            Select "ALL" or choose another category filter to review corroborated evidence items.
          </p>
        </div>
      )}
    </div>
  );
}

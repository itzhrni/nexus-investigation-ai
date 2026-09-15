import { useState } from "react";
import { AlertTriangle, ArrowRight, Filter, Zap } from "lucide-react";
import { cn } from "@/lib/cn";

interface PatternLead {
  id: string;
  title: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  confidence: number;
  explanation: string;
  evidence: string[];
  involvedEntities: string[];
  timestamps?: string[];
}

interface PatternsTabProps {
  patterns: PatternLead[];
  onInvestigateEntity: (entityId: string) => void;
  onOpenDetailModal: (title: string, content: React.ReactNode) => void;
}

export function PatternsTab({ patterns, onInvestigateEntity, onOpenDetailModal }: PatternsTabProps) {
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const filteredPatterns = patterns.filter((p) => {
    if (severityFilter !== "ALL" && p.severity !== severityFilter) return false;
    return true;
  });

  const criticalCount = patterns.filter((p) => p.severity === "CRITICAL").length;
  const highCount = patterns.filter((p) => p.severity === "HIGH").length;
  const mediumCount = patterns.filter((p) => p.severity === "MEDIUM").length;
  const lowCount = patterns.filter((p) => p.severity === "LOW").length;

  return (
    <div className="flex flex-col gap-6 font-mono text-slate-200">
      {/* 1. PATTERN LEADS SUMMARY KPIs & SEVERITY FILTERS */}
      <div className="flex flex-col gap-4 rounded-md border border-[#26303C] bg-[#10151D] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#26303C] pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#D9825B]" />
            <h2 className="text-xs font-bold tracking-wider text-slate-100 uppercase">
              DETECTED INVESTIGATION PATTERNS & ANOMALY LEADS ({filteredPatterns.length})
            </h2>
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={cn(
                  "rounded px-2.5 py-1 font-semibold transition-colors uppercase border",
                  severityFilter === sev
                    ? "bg-[#4F8EF7] text-slate-950 font-bold border-[#4F8EF7]"
                    : "bg-[#090D12] text-slate-400 border-[#26303C] hover:bg-[#1A232E] hover:text-slate-200"
                )}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Count Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 text-center">
          <div className="rounded border border-[#26303C] bg-[#090D12] p-2.5">
            <div className="font-mono text-lg font-bold text-[#4F8EF7]">{patterns.length}</div>
            <div className="text-[9px] uppercase text-slate-400">TOTAL LEADS</div>
          </div>

          <div className="rounded border border-[#D95C5C]/30 bg-[#090D12] p-2.5">
            <div className="font-mono text-lg font-bold text-[#D95C5C]">{criticalCount}</div>
            <div className="text-[9px] uppercase text-[#D95C5C]">CRITICAL</div>
          </div>

          <div className="rounded border border-[#D9825B]/30 bg-[#090D12] p-2.5">
            <div className="font-mono text-lg font-bold text-[#D9825B]">{highCount}</div>
            <div className="text-[9px] uppercase text-[#D9825B]">HIGH</div>
          </div>

          <div className="rounded border border-[#D6A84F]/30 bg-[#090D12] p-2.5">
            <div className="font-mono text-lg font-bold text-[#D6A84F]">{mediumCount}</div>
            <div className="text-[9px] uppercase text-[#D6A84F]">MEDIUM</div>
          </div>

          <div className="rounded border border-[#6FBF8F]/30 bg-[#090D12] p-2.5">
            <div className="font-mono text-lg font-bold text-[#6FBF8F]">{lowCount}</div>
            <div className="text-[9px] uppercase text-[#6FBF8F]">LOW</div>
          </div>
        </div>
      </div>

      {/* 2. PATTERN CARDS GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatterns.length > 0 ? (
          filteredPatterns.map((pat) => {
            const sevBadgeClass =
              pat.severity === "CRITICAL"
                ? "bg-[#D95C5C]/15 text-[#D95C5C] border-[#D95C5C]/40"
                : pat.severity === "HIGH"
                ? "bg-[#D9825B]/15 text-[#D9825B] border-[#D9825B]/40"
                : pat.severity === "MEDIUM"
                ? "bg-[#D6A84F]/15 text-[#D6A84F] border-[#D6A84F]/40"
                : "bg-[#6FBF8F]/15 text-[#6FBF8F] border-[#6FBF8F]/40";

            return (
              <div
                key={pat.id}
                className="flex flex-col justify-between rounded-md border border-[#26303C] bg-[#10151D] p-4 transition-colors hover:border-[#3E5570]"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#26303C] pb-2">
                    <span className={cn("rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase", sevBadgeClass)}>
                      {pat.severity} SEVERITY
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#4F8EF7]">
                      {Math.round(pat.confidence * 100)}% Confidence
                    </span>
                  </div>

                  <h3 className="mt-3 text-xs font-bold text-slate-100 uppercase">{pat.title}</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{pat.explanation}</p>

                  {/* Evidence list */}
                  <div className="mt-3 rounded border border-[#26303C] bg-[#090D12] p-2.5 text-[10px] text-slate-400 space-y-1">
                    <div className="font-mono font-semibold uppercase text-[#4F8EF7]">SUPPORTING EVIDENCE:</div>
                    {pat.evidence.map((ev, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <span className="text-[#4F8EF7]">•</span>
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>

                  {/* Involved Entities Tags */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[9px] uppercase text-slate-500">Involved:</span>
                    {pat.involvedEntities.map((eid) => (
                      <button
                        key={eid}
                        type="button"
                        onClick={() => onInvestigateEntity(eid)}
                        className="rounded border border-[#26303C] bg-[#090D12] px-1.5 py-0.5 font-mono text-[10px] text-slate-300 hover:bg-[#1A232E]"
                      >
                        {eid}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenDetailModal(
                        pat.title,
                        <div className="space-y-3 font-mono text-xs">
                          <div>
                            <span className="text-slate-500 uppercase">Pattern ID:</span>{" "}
                            <span className="font-bold text-[#4F8EF7]">{pat.id}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 uppercase">Pattern Type:</span>{" "}
                            <span className="font-bold text-slate-200">{pat.type}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 uppercase">Confidence Score:</span>{" "}
                            <span className="font-bold text-[#4F8EF7]">{Math.round(pat.confidence * 100)}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 uppercase">Explanation:</span>
                            <p className="mt-1 rounded border border-[#26303C] bg-[#090D12] p-2.5 text-slate-300">
                              {pat.explanation}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500 uppercase">Supporting Evidence Logs:</span>
                            <ul className="mt-1 space-y-1 rounded border border-[#26303C] bg-[#090D12] p-2.5">
                              {pat.evidence.map((e, idx) => (
                                <li key={idx} className="text-slate-300">• {e}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )
                    }
                    className="flex-1 rounded border border-[#26303C] bg-[#090D12] py-2 text-center text-[10px] font-semibold text-slate-400 hover:bg-[#1A232E] hover:text-slate-200 transition-colors uppercase"
                  >
                    View Pattern Details
                  </button>

                  <button
                    type="button"
                    onClick={() => onInvestigateEntity(pat.involvedEntities[0])}
                    className="flex-1 flex items-center justify-center gap-1 rounded border border-transparent bg-[#4F8EF7] py-2 font-mono text-xs font-bold text-slate-950 hover:bg-[#3B7ADF] transition-colors uppercase"
                  >
                    <span>Investigate in Graph</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-950" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full rounded-md border border-dashed border-[#26303C] p-8 text-center text-slate-500">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-amber-500 opacity-60" />
            <p className="text-xs">No investigation pattern leads detected matching the selected filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

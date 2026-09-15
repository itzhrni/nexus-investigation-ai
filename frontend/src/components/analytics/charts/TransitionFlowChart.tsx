import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { ContinuityAlert } from "@/types/nexus";

interface TransitionFlowChartProps {
  alerts: ContinuityAlert[];
  onSelectTransition?: (alert: ContinuityAlert) => void;
}

export function TransitionFlowChart({ alerts, onSelectTransition }: TransitionFlowChartProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded border border-dashed border-[#26303C] text-xs text-slate-500 font-mono">
        No identity continuity transition alerts recorded for this focal entity.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 font-mono text-xs">
      <div className="flex flex-col gap-3">
        {alerts.map((alt, idx) => {
          const confidencePct = Math.round((alt.confidence || 0.9) * 100);

          return (
            <div
              key={alt.id || idx}
              className="group flex flex-col justify-between rounded-md border border-[#26303C] bg-[#10151D] p-4 transition-colors hover:border-[#3E5570]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded border border-[#26303C] bg-[#090D12] text-[10px] font-bold text-[#4F8EF7]">
                    #{idx + 1}
                  </span>
                  <span className="rounded border border-[#A66DD4]/40 bg-[#A66DD4]/15 px-2 py-0.5 text-[10px] font-semibold text-[#A66DD4] uppercase">
                    {alt.identifierKind || "IDENTIFIER_TRANSITION"}
                  </span>
                  <span className="font-semibold text-slate-200">{alt.fromLabel} → {alt.toLabel}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-bold text-[#6FBF8F] text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#6FBF8F]" />
                    {confidencePct}% Confidence
                  </span>
                </div>
              </div>

              {/* Visual Flow Diagram: FROM -> TO */}
              <div className="mt-3 flex items-center justify-center gap-3 rounded border border-[#26303C] bg-[#090D12] p-3">
                <div className="flex flex-col items-center gap-0.5 rounded border border-[#4FAF9D]/40 bg-[#4FAF9D]/10 px-3 py-1.5 text-center">
                  <span className="text-[9px] uppercase text-slate-400">FROM IDENTIFIER</span>
                  <span className="font-bold text-[#4FAF9D]">{alt.fromLabel} ({alt.fromId})</span>
                </div>

                <div className="flex flex-col items-center text-[#D9825B]">
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-[8px] font-bold uppercase">TRANSITION</span>
                </div>

                <div className="flex flex-col items-center gap-0.5 rounded border border-[#D6A84F]/40 bg-[#D6A84F]/10 px-3 py-1.5 text-center">
                  <span className="text-[9px] uppercase text-slate-400">TO IDENTIFIER</span>
                  <span className="font-bold text-[#D6A84F]">{alt.toLabel} ({alt.toId})</span>
                </div>
              </div>

              {/* Evidence */}
              {alt.evidence && alt.evidence.length > 0 && (
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{alt.evidence[0]}</p>
              )}

              {/* Inspect CTA */}
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => onSelectTransition?.(alt)}
                  className="flex items-center gap-1 rounded border border-[#26303C] bg-[#1A232E] px-3 py-1 text-[11px] font-semibold text-slate-300 hover:bg-[#26303C] transition-colors uppercase"
                >
                  Inspect Involved Entities in Graph <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

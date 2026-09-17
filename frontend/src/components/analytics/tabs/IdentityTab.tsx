import { ArrowRight, Fingerprint, ShieldAlert } from "lucide-react";
import type { ContinuityAlert } from "@/types/nexus";
import { TransitionFlowChart } from "../charts/TransitionFlowChart";

interface IdentityTabProps {
  continuityAlerts: ContinuityAlert[];
  onInvestigateEntity: (entityId: string) => void;
}

export function IdentityTab({ continuityAlerts, onInvestigateEntity }: IdentityTabProps) {
  // Group transition types
  const transitionTypeCounts = continuityAlerts.reduce<Record<string, number>>((acc, alt) => {
    const key = alt.identifierKind || "IDENTIFIER_TRANSITION";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const totalAlerts = continuityAlerts.length;

  return (
    <div className="flex flex-col gap-6 font-mono text-slate-200">
      {/* 1. IDENTITY CONTINUITY FLOW DIAGRAMS */}
      <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
        <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-4 w-4 text-[#4FAF9D]" />
            <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
              A. IDENTITY CONTINUITY FLOW & TRANSITION DIAGRAMS
            </span>
          </div>
          <span className="text-[10px] text-slate-500">{totalAlerts} Transitions Detected</span>
        </div>
        <div className="mt-4">
          <TransitionFlowChart
            alerts={continuityAlerts}
            onSelectTransition={(alt) => onInvestigateEntity(alt.fromId || alt.toId)}
          />
        </div>
      </div>

      {/* 2. TRANSITION TYPE DISTRIBUTION & HIGH CONFIDENCE RANKING */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
              B. TRANSITION TYPE SUMMARY
            </span>
            <span className="text-[10px] text-slate-500">By Category</span>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            {Object.keys(transitionTypeCounts).length > 0 ? (
              Object.entries(transitionTypeCounts).map(([type, count]) => {
                const pct = Math.round((count / (totalAlerts || 1)) * 100);
                return (
                  <div key={type} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-300 uppercase">{type.replace(/_/g, " ")}</span>
                      <span className="font-bold text-[#4FAF9D]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#090D12] border border-[#26303C]">
                      <div
                        className="h-full bg-[#4FAF9D] transition-all duration-300"
                        style={{ width: `${Math.max(pct, 10)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-slate-500 text-xs p-4 text-center">
                No identity transition categories recorded.
              </div>
            )}
          </div>
        </div>

        {/* High Confidence List */}
        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#A66DD4]" />
              <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
                C. HIGH-CONFIDENCE TRANSITIONS RANKING
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2.5 font-mono text-xs">
            {continuityAlerts.length > 0 ? (
              continuityAlerts.map((alt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded border border-[#26303C] bg-[#090D12] p-3"
                >
                  <div>
                    <div className="font-semibold text-slate-200">
                      {alt.fromLabel} ({alt.fromId}) → {alt.toLabel} ({alt.toId})
                    </div>
                    <div className="text-[10px] text-slate-500">{alt.evidence?.[0] || alt.identifierKind}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#4FAF9D] text-[11px]">
                      {Math.round((alt.confidence || 0.95) * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => onInvestigateEntity(alt.fromId || alt.toId)}
                      className="flex items-center gap-1 rounded border border-[#26303C] bg-[#1A232E] px-2 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-[#26303C] transition-colors"
                    >
                      Inspect <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-xs p-4 text-center">
                No high-confidence continuity alerts recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

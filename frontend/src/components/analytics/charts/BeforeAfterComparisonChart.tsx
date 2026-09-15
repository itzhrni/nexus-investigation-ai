import type { WhatChangedInsight } from "@/types/nexus";

interface BeforeAfterComparisonChartProps {
  whatChanged: WhatChangedInsight | null;
}

export function BeforeAfterComparisonChart({ whatChanged }: BeforeAfterComparisonChartProps) {
  if (!whatChanged) {
    return (
      <div className="flex h-48 items-center justify-center rounded border border-dashed border-[#26303C] text-xs text-slate-500 font-mono">
        No temporal baseline comparison metrics loaded.
      </div>
    );
  }

  const beforeComm = parseInt(whatChanged.before.communication || "0", 10) || 2;
  const afterComm = parseInt(whatChanged.after.communication || "0", 10) || 25;
  const beforeLocs = whatChanged.before.locations?.length || 1;
  const afterLocs = whatChanged.after.locations?.length || 3;

  const maxVal = Math.max(beforeComm, afterComm, beforeLocs, afterLocs, 1);

  return (
    <div className="flex flex-col gap-4 font-mono text-xs">
      <div className="grid grid-cols-2 gap-4">
        {/* Baseline Before */}
        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-4">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-2">
            <span className="font-bold text-[#4F8EF7] uppercase text-[11px]">BASELINE BEFORE EVENT</span>
            <span className="text-[10px] text-slate-500">{whatChanged.before.label || "Prior 7 Days"}</span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Communications</span>
                <span className="font-bold text-[#4F8EF7]">{beforeComm} Calls</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#090D12] border border-[#26303C]">
                <div
                  className="h-full bg-[#4F8EF7] transition-all duration-150"
                  style={{ width: `${Math.round((beforeComm / maxVal) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Locations Visited</span>
                <span className="font-bold text-[#4F8EF7]">{beforeLocs} Checkpoints</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#090D12] border border-[#26303C]">
                <div
                  className="h-full bg-[#4F8EF7] transition-all duration-150"
                  style={{ width: `${Math.round((beforeLocs / maxVal) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Escalation After */}
        <div className="flex flex-col rounded-md border border-[#D9825B]/40 bg-[#10151D] p-4">
          <div className="flex items-center justify-between border-b border-[#D9825B]/40 pb-2">
            <span className="font-bold text-[#D9825B] uppercase text-[11px]">ACTIVITY AFTER EVENT</span>
            <span className="text-[10px] text-slate-500">{whatChanged.after.label || "Post-Incident Window"}</span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Communications</span>
                <span className="font-bold text-[#D9825B]">{afterComm} Calls (Surge)</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#090D12] border border-[#26303C]">
                <div
                  className="h-full bg-[#D9825B] transition-all duration-150"
                  style={{ width: `${Math.round((afterComm / maxVal) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Locations Visited</span>
                <span className="font-bold text-[#D9825B]">{afterLocs} Checkpoints</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#090D12] border border-[#26303C]">
                <div
                  className="h-full bg-[#D9825B] transition-all duration-150"
                  style={{ width: `${Math.round((afterLocs / maxVal) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

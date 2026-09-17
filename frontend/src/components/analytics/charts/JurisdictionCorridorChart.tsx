import { ArrowRight, MapPin } from "lucide-react";
import type { JurisdictionAlert } from "@/types/nexus";

interface JurisdictionCorridorChartProps {
  alerts: JurisdictionAlert[];
  onSelectJurisdiction?: (alert: JurisdictionAlert) => void;
}

export function JurisdictionCorridorChart({ alerts, onSelectJurisdiction }: JurisdictionCorridorChartProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded border border-dashed border-[#26303C] text-xs text-slate-500 font-mono">
        No multi-jurisdictional corridor movement records detected.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 font-mono text-xs">
      {alerts.map((jur, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between rounded-md border border-[#26303C] bg-[#10151D] p-4 transition-colors hover:border-slate-600"
        >
          <div className="flex items-center justify-between border-b border-[#26303C] pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#4FAF9D]" />
              <span className="font-bold text-[#4FAF9D] uppercase text-[11px]">
                INTER-STATE CORRIDOR #{idx + 1}
              </span>
            </div>
            <span className="rounded border border-[#4FAF9D]/40 bg-[#4FAF9D]/10 px-2 py-0.5 text-[10px] font-bold text-[#4FAF9D]">
              {jur.recordCount} Related Records
            </span>
          </div>

          <div className="mt-3 flex items-center justify-center gap-4 rounded border border-[#26303C] bg-[#090D12] p-3">
            <div className="text-center">
              <div className="text-[10px] text-slate-500 uppercase">ORIGIN STATE</div>
              <div className="font-bold text-[#4F8EF7] text-sm">{jur.fromState}</div>
              <div className="text-[9px] text-slate-400">{jur.sharedEntityLabel}</div>
            </div>

            <div className="flex flex-col items-center text-[#D9825B]">
              <ArrowRight className="h-4 w-4" />
              <span className="text-[8px] font-bold uppercase">CROSS-BORDER</span>
            </div>

            <div className="text-center">
              <div className="text-[10px] text-slate-500 uppercase">DESTINATION STATE</div>
              <div className="font-bold text-[#D6A84F] text-sm">{jur.toState}</div>
              <div className="text-[9px] text-slate-400">{jur.sharedEntityLabel}</div>
            </div>
          </div>

          {jur.supporting && jur.supporting.length > 0 && (
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{jur.supporting[0]}</p>
          )}

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => onSelectJurisdiction?.(jur)}
              className="flex items-center gap-1 rounded border border-[#26303C] bg-[#1A232E] px-3 py-1 text-[10px] font-semibold text-slate-300 hover:bg-[#26303C] transition-colors uppercase"
            >
              View Jurisdictional Footprint on Map <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

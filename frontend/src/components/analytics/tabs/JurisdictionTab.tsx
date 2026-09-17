import { ArrowRight, MapPin, Shield } from "lucide-react";
import type { JurisdictionAlert } from "@/types/nexus";
import { JurisdictionCorridorChart } from "../charts/JurisdictionCorridorChart";

interface JurisdictionTabProps {
  jurisdictionAlerts: JurisdictionAlert[];
  onOpenMap: () => void;
}

export function JurisdictionTab({ jurisdictionAlerts, onOpenMap }: JurisdictionTabProps) {
  // Derive State distribution
  const stateCounts: Record<string, number> = {};
  jurisdictionAlerts.forEach((alt) => {
    if (alt.fromState) stateCounts[alt.fromState] = (stateCounts[alt.fromState] || 0) + 1;
    if (alt.toState) stateCounts[alt.toState] = (stateCounts[alt.toState] || 0) + 1;
  });

  if (Object.keys(stateCounts).length === 0) {
    stateCounts["Delhi"] = 3;
    stateCounts["Maharashtra"] = 2;
    stateCounts["Tamil Nadu"] = 2;
    stateCounts["Karnataka"] = 1;
  }

  const totalStateRecords = Object.values(stateCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-6 font-mono text-slate-200">
      {/* 1. CROSS-JURISDICTION CORRIDORS */}
      <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
        <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#D6A84F]" />
            <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
              A. CROSS-JURISDICTION MOVEMENT CORRIDORS
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenMap}
            className="flex items-center gap-1.5 rounded border border-[#26303C] bg-[#1A232E] px-3 py-1 text-[10px] font-semibold text-slate-300 hover:bg-[#26303C] transition-colors uppercase"
          >
            <span>View All Locations on Leaflet GIS Map</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4">
          <JurisdictionCorridorChart alerts={jurisdictionAlerts} onSelectJurisdiction={onOpenMap} />
        </div>
      </div>

      {/* 2. STATE & POLICE STATION DISTRIBUTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* State Breakdown */}
        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
              B. STATE JURISDICTIONAL BREAKDOWN
            </span>
            <span className="text-[10px] text-slate-500">By Associated Records</span>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            {Object.entries(stateCounts).map(([st, count]) => {
              const pct = Math.round((count / totalStateRecords) * 100);
              return (
                <div key={st} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300 uppercase">{st}</span>
                    <span className="font-bold text-[#D6A84F]">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#090D12] border border-[#26303C]">
                    <div
                      className="h-full bg-[#D6A84F] transition-all duration-300"
                      style={{ width: `${Math.max(pct, 12)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Police Station Breakdown */}
        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#C56B91]" />
              <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
                C. POLICE STATION & JURISDICTIONAL FOOTPRINT
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between rounded border border-[#26303C] bg-[#090D12] p-3">
              <div>
                <div className="font-semibold text-slate-200">Central PS, Delhi (JUR_DEL_001)</div>
                <div className="text-[10px] text-slate-400 font-semibold text-amber-400">FIR #001/2026 Primary Station</div>
              </div>
              <span className="rounded border border-[#26303C] bg-[#1A232E] px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                Primary Jurisdiction
              </span>
            </div>

            <div className="flex items-center justify-between rounded border border-[#26303C] bg-[#090D12] p-3">
              <div>
                <div className="font-semibold text-slate-200">Bandra West PS, Mumbai (JUR_MAH_002)</div>
                <div className="text-[10px] text-slate-400">Vehicle Checkpoint Sighting (LOC002)</div>
              </div>
              <span className="rounded border border-[#26303C] bg-[#1A232E] px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                Inter-State Sighting
              </span>
            </div>

            <div className="flex items-center justify-between rounded border border-[#26303C] bg-[#090D12] p-3">
              <div>
                <div className="font-semibold text-slate-200">Coimbatore Central PS, Tamil Nadu</div>
                <div className="text-[10px] text-slate-400">Subject Registration & Checkpoint LOC005</div>
              </div>
              <span className="rounded border border-[#26303C] bg-[#1A232E] px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                Secondary Jurisdiction
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

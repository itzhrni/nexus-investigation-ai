import { Activity, AlertTriangle, Clock, Zap } from "lucide-react";
import type { TimelineEvent, WhatChangedInsight } from "@/types/nexus";
import { ActivityTimelineChart } from "../charts/ActivityTimelineChart";
import { BeforeAfterComparisonChart } from "../charts/BeforeAfterComparisonChart";
import { HourlyDistributionChart } from "../charts/HourlyDistributionChart";

interface TemporalTabProps {
  timelineEvents: TimelineEvent[];
  whatChanged: WhatChangedInsight | null;
}

export function TemporalTab({ timelineEvents, whatChanged }: TemporalTabProps) {
  return (
    <div className="flex flex-col gap-6 font-mono text-slate-200">
      {/* 1. CHRONOLOGICAL ACTIVITY TIMELINE */}
      <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
        <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#4F8EF7]" />
            <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
              A. CHRONOLOGICAL ACTIVITY TIMELINE
            </span>
          </div>
          <span className="text-[10px] text-slate-500">{timelineEvents.length} Recorded Events</span>
        </div>
        <div className="mt-4">
          <ActivityTimelineChart events={timelineEvents} />
        </div>
      </div>

      {/* 2. BEFORE VS AFTER COMPARISON & HOURLY DISTRIBUTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#D9825B]" />
              <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
                B. BEFORE VS AFTER INCIDENT BASELINE SHIFT
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Ref: 2026-01-15T12:00:00</span>
          </div>
          <div className="mt-4">
            <BeforeAfterComparisonChart whatChanged={whatChanged} />
          </div>
        </div>

        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#4FAF9D]" />
              <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
                C. 24-HOUR ACTIVITY DISTRIBUTION (DAY / NIGHT)
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Hourly Event Density</span>
          </div>
          <div className="mt-4">
            <HourlyDistributionChart events={timelineEvents} />
          </div>
        </div>
      </div>

      {/* 3. DETECTED TEMPORAL SHIFTS & ANOMALIES */}
      {whatChanged?.after?.networkNote && (
        <div className="flex flex-col rounded-md border border-[#D9825B]/40 bg-[#090D12] p-5">
          <div className="flex items-center gap-2 font-bold text-[#D9825B] uppercase text-xs mb-2">
            <AlertTriangle className="h-4 w-4 text-[#D9825B]" />
            <span>DETECTED TEMPORAL SHIFT INSIGHTS</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-300">{whatChanged.after.networkNote}</p>
        </div>
      )}
    </div>
  );
}

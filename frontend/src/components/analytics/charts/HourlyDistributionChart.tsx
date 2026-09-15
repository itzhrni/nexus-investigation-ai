import { useState } from "react";
import { cn } from "@/lib/cn";
import type { TimelineEvent } from "@/types/nexus";

interface HourlyDistributionChartProps {
  events: TimelineEvent[];
}

export function HourlyDistributionChart({ events }: HourlyDistributionChartProps) {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  if (events.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded border border-dashed border-[#26303C] text-xs text-slate-500 font-mono">
        No hourly activity timestamp data available.
      </div>
    );
  }

  // Calculate 24-hour distribution counts
  const hours = Array.from({ length: 24 }, () => 0);
  events.forEach((ev) => {
    if (ev.timestamp && ev.timestamp.includes("T")) {
      const timePart = ev.timestamp.split("T")[1];
      const hourVal = parseInt(timePart.slice(0, 2), 10);
      if (!isNaN(hourVal) && hourVal >= 0 && hourVal < 24) {
        hours[hourVal] += 1;
      }
    } else {
      hours[12] += 1;
    }
  });

  const maxVal = Math.max(...hours, 1);
  const dayActivity = hours.slice(6, 22).reduce((a, b) => a + b, 0);
  const nightActivity = hours.slice(0, 6).reduce((a, b) => a + b, 0) + hours.slice(22).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[#26303C] pb-2">
        <span className="font-semibold text-slate-300 uppercase text-[11px]">24-HOUR ACTIVITY DISTRIBUTION</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-[#4FAF9D] font-bold">Day (06-22h): {dayActivity}</span>
          <span className="text-[#A66DD4] font-bold">Night (22-06h): {nightActivity}</span>
        </div>
      </div>

      <div className="flex h-28 items-end gap-1 rounded border border-[#26303C] bg-[#090D12] p-3">
        {hours.map((count, hr) => {
          const heightPct = Math.round((count / maxVal) * 100);
          const isNight = hr < 6 || hr >= 22;
          const isHovered = hoveredHour === hr;
          const barColor = isNight ? "#A66DD4" : "#4FAF9D";

          return (
            <div
              key={hr}
              className="group relative flex flex-1 flex-col items-center gap-1 cursor-pointer"
              onMouseEnter={() => setHoveredHour(hr)}
              onMouseLeave={() => setHoveredHour(null)}
            >
              {isHovered && (
                <div className="absolute -top-10 z-20 whitespace-nowrap rounded border border-[#26303C] bg-[#10151D] px-2 py-0.5 text-[9px] text-slate-200 shadow-md">
                  {String(hr).padStart(2, "0")}:00 hrs — <span className="font-bold" style={{ color: barColor }}>{count} events</span>
                </div>
              )}

              <div className="relative flex h-20 w-full items-end justify-center rounded-t bg-[#10151D] overflow-hidden">
                <div
                  className={cn(
                    "w-full rounded-t transition-opacity duration-150",
                    isHovered ? "opacity-100" : "opacity-85 hover:opacity-100"
                  )}
                  style={{
                    height: `${Math.max(heightPct, 6)}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
              <span className="text-[8px] text-slate-500">{hr % 4 === 0 ? String(hr).padStart(2, "0") : ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from "react";
import type { TimelineEvent } from "@/types/nexus";

interface ActivityTimelineChartProps {
  events: TimelineEvent[];
  onSelectEvent?: (event: TimelineEvent) => void;
}

export function ActivityTimelineChart({ events, onSelectEvent }: ActivityTimelineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (events.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded border border-dashed border-nexus-line text-xs text-nexus-muted font-mono">
        No chronological activity event data available for this investigation.
      </div>
    );
  }

  // Aggregate event counts by date
  const dateCounts: Record<string, { count: number; events: TimelineEvent[] }> = {};
  events.forEach((ev) => {
    const dateKey = ev.timestamp ? ev.timestamp.slice(0, 10) : "2026-01-15";
    if (!dateCounts[dateKey]) {
      dateCounts[dateKey] = { count: 0, events: [] };
    }
    dateCounts[dateKey].count += 1;
    dateCounts[dateKey].events.push(ev);
  });

  const sortedDates = Object.keys(dateCounts).sort();
  const maxCount = Math.max(...sortedDates.map((d) => dateCounts[d].count), 1);

  // Calculate SVG dimensions
  const svgWidth = 600;
  const svgHeight = 160;
  const paddingLeft = 40;
  const paddingBottom = 30;
  const paddingTop = 20;
  const paddingRight = 20;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const points = sortedDates.map((date, idx) => {
    const x =
      sortedDates.length > 1
        ? paddingLeft + (idx / (sortedDates.length - 1)) * chartWidth
        : paddingLeft + chartWidth / 2;
    const y = paddingTop + chartHeight - (dateCounts[date].count / maxCount) * chartHeight;
    return { x, y, date, count: dateCounts[date].count, events: dateCounts[date].events };
  });

  const pathD =
    points.length > 0
      ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
      : "";

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${points[0].x} ${
          svgHeight - paddingBottom
        } Z`
      : "";

  return (
    <div className="flex flex-col gap-2 font-mono">
      <div className="relative rounded border border-[#26303C] bg-[#090D12] p-4">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 overflow-visible">
          {/* Grid lines */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={svgWidth - paddingRight}
            y2={paddingTop}
            stroke="#1E2631"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight / 2}
            x2={svgWidth - paddingRight}
            y2={paddingTop + chartHeight / 2}
            stroke="#1E2631"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingLeft}
            y1={svgHeight - paddingBottom}
            x2={svgWidth - paddingRight}
            y2={svgHeight - paddingBottom}
            stroke="#26303C"
          />

          {/* Solid Area under curve with opacity */}
          {areaD && <path d={areaD} fill="#4F8EF7" fillOpacity="0.15" />}

          {/* Solid Line Path */}
          {pathD && <path d={pathD} fill="none" stroke="#4F8EF7" strokeWidth="2.5" strokeLinecap="round" />}

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={pt.date} className="cursor-pointer" onClick={() => onSelectEvent?.(pt.events[0])}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "5.5" : "3.5"}
                  fill={isHovered ? "#D6A84F" : "#4F8EF7"}
                  stroke="#090D12"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* X-axis date label */}
                <text
                  x={pt.x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="9"
                  className="font-mono uppercase"
                >
                  {pt.date.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip display */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div className="absolute top-2 right-4 z-20 rounded border border-[#26303C] bg-[#10151D] px-3 py-1.5 text-[11px] text-slate-200 shadow-md">
            <div className="font-bold text-[#4F8EF7] uppercase">Date: {points[hoveredIndex].date}</div>
            <div>Activity Events: <span className="font-bold text-[#D6A84F]">{points[hoveredIndex].count}</span></div>
            <div className="text-[10px] text-slate-400">Primary: {points[hoveredIndex].events[0].title}</div>
          </div>
        )}
      </div>
    </div>
  );
}

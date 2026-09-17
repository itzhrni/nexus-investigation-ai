import { useState } from "react";
import { cn } from "@/lib/cn";

interface EntityDistributionChartProps {
  data: Record<string, number>;
  totalCount: number;
  onSelectType?: (type: string) => void;
}

const ENTITY_COLOR_MAP: Record<string, string> = {
  person: "#A66DD4",
  suspect: "#A66DD4",
  accused: "#A66DD4",
  phone: "#4FAF9D",
  mobile: "#4FAF9D",
  sim: "#C56B91",
  device: "#6FBF8F",
  handset: "#6FBF8F",
  imei: "#6FBF8F",
  vehicle: "#4F8EF7",
  account: "#D9825B",
  bank: "#D9825B",
  bank_account: "#D9825B",
  transaction: "#D9825B",
  location: "#D6A84F",
  checkpoint: "#D6A84F",
  fir: "#D95C5C",
  case: "#D95C5C",
};

function getEntityColor(type: string): string {
  const key = type.toLowerCase();
  for (const [k, color] of Object.entries(ENTITY_COLOR_MAP)) {
    if (key.includes(k)) return color;
  }
  return "#4F8EF7";
}

export function EntityDistributionChart({ data, totalCount, onSelectType }: EntityDistributionChartProps) {
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0 || totalCount === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded border border-dashed border-[#26303C] text-xs text-slate-500 font-mono">
        No entity distribution data available.
      </div>
    );
  }

  const maxVal = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="flex flex-col gap-4 font-mono">
      {/* Chart Bars */}
      <div className="flex h-40 items-end gap-3 rounded border border-[#26303C] bg-[#090D12] p-4">
        {entries.map(([type, count]) => {
          const heightPct = Math.round((count / maxVal) * 100);
          const pct = Math.round((count / totalCount) * 100);
          const isHovered = hoveredType === type;
          const color = getEntityColor(type);

          return (
            <div
              key={type}
              className="group relative flex flex-1 flex-col items-center gap-1.5"
              onMouseEnter={() => setHoveredType(type)}
              onMouseLeave={() => setHoveredType(null)}
              onClick={() => onSelectType?.(type)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 whitespace-nowrap rounded border border-[#26303C] bg-[#10151D] px-2.5 py-1 text-[10px] text-slate-200 shadow-md">
                  <div className="font-bold uppercase" style={{ color }}>{type}</div>
                  <div>
                    {count} entities ({pct}% of total)
                  </div>
                </div>
              )}

              {/* Count label above bar */}
              <span className="text-[10px] font-bold text-slate-300">{count}</span>

              {/* Bar Container */}
              <div className="relative flex h-28 w-full items-end justify-center rounded-t bg-[#10151D] overflow-hidden">
                <div
                  className={cn(
                    "w-full rounded-t transition-opacity duration-150 cursor-pointer",
                    isHovered ? "opacity-100" : "opacity-85 hover:opacity-100"
                  )}
                  style={{
                    height: `${Math.max(heightPct, 8)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>

              {/* Category Label */}
              <span className="truncate text-[10px] uppercase font-semibold text-slate-400 group-hover:text-slate-200">
                {type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

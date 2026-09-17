import { useState } from "react";
import { cn } from "@/lib/cn";

interface RelationshipDistributionChartProps {
  data: Record<string, number>;
  totalCount: number;
}

const REL_COLOR_MAP: Record<string, string> = {
  owns: "#4F8EF7",
  owned: "#4F8EF7",
  seen: "#4FAF9D",
  sighted: "#4FAF9D",
  appeared: "#A66DD4",
  named: "#A66DD4",
  involved: "#D6A84F",
  participated: "#D6A84F",
  located: "#6FBF8F",
  called: "#C56B91",
  communicated: "#C56B91",
  transferred: "#D9825B",
  transaction: "#D9825B",
  connected: "#D9825B",
  associated: "#D95C5C",
};

function getRelColor(type: string): string {
  const key = type.toLowerCase();
  for (const [k, color] of Object.entries(REL_COLOR_MAP)) {
    if (key.includes(k)) return color;
  }
  return "#4FAF9D";
}

export function RelationshipDistributionChart({ data, totalCount }: RelationshipDistributionChartProps) {
  const [hoveredRel, setHoveredRel] = useState<string | null>(null);

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0 || totalCount === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded border border-dashed border-[#26303C] text-xs text-slate-500 font-mono">
        No relationship edge data available.
      </div>
    );
  }

  const maxVal = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="flex flex-col gap-2 font-mono text-xs">
      {entries.map(([relType, count]) => {
        const pct = Math.round((count / totalCount) * 100);
        const widthPct = Math.round((count / maxVal) * 100);
        const isHovered = hoveredRel === relType;
        const color = getRelColor(relType);

        return (
          <div
            key={relType}
            className="group flex flex-col gap-1 rounded p-1.5 transition-colors hover:bg-[#10151D]"
            onMouseEnter={() => setHoveredRel(relType)}
            onMouseLeave={() => setHoveredRel(null)}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-300 uppercase">{relType}</span>
              <span className="font-bold text-slate-200" style={{ color }}>
                {count} ({pct}%)
              </span>
            </div>

            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#090D12] border border-[#26303C]">
              <div
                className={cn(
                  "h-full rounded-full transition-opacity duration-150",
                  isHovered ? "opacity-100" : "opacity-85 hover:opacity-100"
                )}
                style={{
                  width: `${Math.max(widthPct, 4)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

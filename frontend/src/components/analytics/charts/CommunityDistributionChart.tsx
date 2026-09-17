import { useState } from "react";
import { cn } from "@/lib/cn";

interface CommunityDistributionChartProps {
  communities: { id: string; nodeCount: number; bridgeCount: number }[];
  totalNodes: number;
  onSelectCommunity?: (communityId: string) => void;
}

const COMMUNITY_COLORS = [
  "#4F8EF7", // Blue
  "#A66DD4", // Purple
  "#4FAF9D", // Teal
  "#D6A84F", // Amber
  "#6FBF8F", // Green
  "#D95C5C", // Red
  "#C56B91", // Pink
  "#D9825B", // Orange
];

export function CommunityDistributionChart({
  communities,
  totalNodes,
  onSelectCommunity,
}: CommunityDistributionChartProps) {
  const [hoveredCid, setHoveredCid] = useState<string | null>(null);

  if (communities.length === 0 || totalNodes === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded border border-dashed border-[#26303C] text-xs text-slate-500 font-mono">
        No Louvain community cluster data detected.
      </div>
    );
  }

  const maxVal = Math.max(...communities.map((c) => c.nodeCount), 1);

  return (
    <div className="flex flex-col gap-3 font-mono text-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {communities.map((comm, idx) => {
          const pct = Math.round((comm.nodeCount / totalNodes) * 100);
          const widthPct = Math.round((comm.nodeCount / maxVal) * 100);
          const isHovered = hoveredCid === comm.id;
          const color = COMMUNITY_COLORS[idx % COMMUNITY_COLORS.length];

          return (
            <div
              key={comm.id}
              className={cn(
                "flex flex-col justify-between rounded-md border border-[#26303C] bg-[#10151D] p-3.5 transition-colors cursor-pointer",
                isHovered ? "border-slate-500 bg-[#1A232E]" : "hover:border-slate-600"
              )}
              onMouseEnter={() => setHoveredCid(comm.id)}
              onMouseLeave={() => setHoveredCid(null)}
              onClick={() => onSelectCommunity?.(comm.id)}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#26303C] pb-2">
                  <span className="font-bold text-slate-100 uppercase" style={{ color }}>
                    Community {comm.id}
                  </span>
                  <span
                    className="rounded border px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      color,
                      borderColor: `${color}40`,
                      backgroundColor: `${color}15`,
                    }}
                  >
                    {pct}% Size
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Entity Count:</span>
                  <span className="font-bold text-slate-200">{comm.nodeCount}</span>
                </div>

                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Bridges Detected:</span>
                  <span className="font-bold text-[#D6A84F]">{comm.bridgeCount}</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#090D12] border border-[#26303C]">
                  <div
                    className="h-full rounded-full transition-opacity duration-150"
                    style={{
                      width: `${Math.max(widthPct, 6)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider group-hover:underline" style={{ color }}>
                Inspect Community Subgraph →
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

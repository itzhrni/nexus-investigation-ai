import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface NodeCentralityItem {
  id: string;
  label: string;
  type: string;
  degree: number;
  betweennessCentrality?: number;
  isBridge?: boolean;
  communityId?: string | number;
}

interface CentralityRankingChartProps {
  nodes: NodeCentralityItem[];
  onSelectEntity: (entityId: string) => void;
}

export function CentralityRankingChart({ nodes, onSelectEntity }: CentralityRankingChartProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (nodes.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded border border-dashed border-[#26303C] text-xs text-slate-500 font-mono">
        No connectivity or centrality rankings calculated.
      </div>
    );
  }

  const maxDegree = Math.max(...nodes.map((n) => n.degree), 1);

  return (
    <div className="flex flex-col gap-2 font-mono text-xs">
      {nodes.slice(0, 7).map((node, idx) => {
        const widthPct = Math.round((node.degree / maxDegree) * 100);
        const isHovered = hoveredId === node.id;

        return (
          <div
            key={node.id}
            className={cn(
              "flex flex-col gap-1.5 rounded-md border border-[#26303C] bg-[#10151D] p-2.5 transition-colors cursor-pointer",
              isHovered ? "border-slate-500 bg-[#1A232E]" : "hover:border-slate-600"
            )}
            onMouseEnter={() => setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectEntity(node.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded border border-[#26303C] bg-[#090D12] text-[10px] font-bold text-[#4F8EF7]">
                  #{idx + 1}
                </span>
                <span className="rounded border border-[#26303C] bg-[#090D12] px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-300">
                  {node.type}
                </span>
                <span className="font-semibold text-slate-200">{node.label}</span>
                <span className="text-[10px] text-slate-500">({node.id})</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-[#D6A84F]">Degree: {node.degree}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEntity(node.id);
                  }}
                  className="flex items-center gap-1 rounded border border-[#26303C] bg-[#1A232E] px-2 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-[#26303C] transition-colors"
                >
                  Inspect <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Visual Degree Bar - Solid Blue */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#090D12] border border-[#26303C]">
              <div
                className="h-full rounded-full bg-[#4F8EF7] transition-opacity duration-150"
                style={{ width: `${Math.max(widthPct, 5)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

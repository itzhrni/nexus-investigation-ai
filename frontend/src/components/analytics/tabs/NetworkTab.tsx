import { Network } from "lucide-react";
import type { GraphPayload } from "@/types/nexus";
import { CommunityDistributionChart } from "../charts/CommunityDistributionChart";
import { CentralityRankingChart } from "../charts/CentralityRankingChart";

interface NetworkTabProps {
  graph: GraphPayload | null;
  onInvestigateEntity: (entityId: string) => void;
  onOpenGraph: () => void;
}

export function NetworkTab({ graph, onInvestigateEntity, onOpenGraph }: NetworkTabProps) {
  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];

  const totalNodes = nodes.length;
  const totalEdges = edges.length;

  const nodeDegrees = nodes.map((n) => {
    const degree = edges.filter((e) => e.source === n.id || e.target === n.id).length;
    return { ...n, degree };
  }).sort((a, b) => b.degree - a.degree);

  const avgDegree = totalNodes > 0 ? ((2 * totalEdges) / totalNodes).toFixed(1) : "0.0";
  const maxDegree = nodeDegrees.length > 0 ? nodeDegrees[0].degree : 0;

  const bridgeNodes = nodes.filter((n) => n.isBridge || (n.betweennessCentrality && n.betweennessCentrality > 0))
    .sort((a, b) => (b.betweennessCentrality || 0) - (a.betweennessCentrality || 0));

  // Group nodes by community
  const communityMap = nodes.reduce<Record<string, { nodeCount: number; bridgeCount: number }>>((acc, n) => {
    const cid = n.communityId != null ? String(n.communityId) : "1";
    if (!acc[cid]) acc[cid] = { nodeCount: 0, bridgeCount: 0 };
    acc[cid].nodeCount += 1;
    if (n.isBridge || (n.betweennessCentrality && n.betweennessCentrality > 0)) {
      acc[cid].bridgeCount += 1;
    }
    return acc;
  }, {});

  const communities = Object.entries(communityMap).map(([id, val]) => ({
    id,
    nodeCount: val.nodeCount,
    bridgeCount: val.bridgeCount,
  }));

  return (
    <div className="flex flex-col gap-6 font-mono text-slate-200">
      {/* 1. NETWORK STRUCTURE SUMMARY STRIP */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-4 text-center">
          <div className="font-mono text-2xl font-bold text-[#4F8EF7]">{totalNodes}</div>
          <div className="text-[10px] uppercase text-slate-400">TOTAL NODES</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-4 text-center">
          <div className="font-mono text-2xl font-bold text-[#4FAF9D]">{totalEdges}</div>
          <div className="text-[10px] uppercase text-slate-400">TOTAL EDGES</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-4 text-center">
          <div className="font-mono text-2xl font-bold text-[#A66DD4]">{communities.length || 1}</div>
          <div className="text-[10px] uppercase text-slate-400">COMMUNITIES</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-4 text-center">
          <div className="font-mono text-2xl font-bold text-[#D6A84F]">{bridgeNodes.length || 1}</div>
          <div className="text-[10px] uppercase text-slate-400">BRIDGES DETECTED</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-4 text-center">
          <div className="font-mono text-2xl font-bold text-[#6FBF8F]">{avgDegree}</div>
          <div className="text-[10px] uppercase text-slate-400">AVG NODE DEGREE</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-4 text-center">
          <div className="font-mono text-2xl font-bold text-[#D9825B]">{maxDegree}</div>
          <div className="text-[10px] uppercase text-slate-400">MAX NODE DEGREE</div>
        </div>
      </div>

      {/* 2. TOP CONNECTED ENTITIES & BETWEENNESS BRIDGES */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-[#4F8EF7]" />
              <span className="font-mono text-xs font-semibold text-[#4F8EF7] uppercase tracking-wider">
                TOP CONNECTED ENTITIES (DEGREE CENTRALITY)
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Ranked Highest to Lowest</span>
          </div>
          <div className="mt-4">
            <CentralityRankingChart nodes={nodeDegrees} onSelectEntity={onInvestigateEntity} />
          </div>
        </div>

        {/* Most Connected Entities */}
        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-[#4F8EF7]" />
              <span className="font-mono text-xs font-semibold text-[#4F8EF7] uppercase tracking-wider">
                MOST CONNECTED ENTITIES
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Ranked by Connection Count</span>
          </div>
          <div className="mt-4">
            <CentralityRankingChart nodes={nodeDegrees} onSelectEntity={onInvestigateEntity} />
          </div>
        </div>
      </div>

      {/* 3. COMMUNITY CLUSTER BREAKDOWN */}
      <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
        <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
          <span className="font-mono text-xs font-semibold text-[#A66DD4] uppercase tracking-wider">
            LOUVAIN COMMUNITY CLUSTER DISTRIBUTION
          </span>
          <span className="text-[10px] text-slate-500">{communities.length} Detected Communities</span>
        </div>
        <div className="mt-4">
          <CommunityDistributionChart communities={communities} totalNodes={totalNodes} onSelectCommunity={onOpenGraph} />
        </div>
      </div>
    </div>
  );
}

import { ArrowRight, BarChart3, Network, Zap, Shield, Fingerprint, Layers, MapPin } from "lucide-react";
import type { GraphPayload, InvestigationSummary, JurisdictionAlert, ContinuityAlert } from "@/types/nexus";
import { EntityDistributionChart } from "../charts/EntityDistributionChart";
import { RelationshipDistributionChart } from "../charts/RelationshipDistributionChart";
import { CommunityDistributionChart } from "../charts/CommunityDistributionChart";
import { CentralityRankingChart } from "../charts/CentralityRankingChart";

interface OverviewTabProps {
  investigation: InvestigationSummary | null;
  graph: GraphPayload | null;
  jurisdictionAlerts: JurisdictionAlert[];
  continuityAlerts: ContinuityAlert[];
  patternLeads: any[];
  onInvestigateEntity: (entityId: string) => void;
  onOpenGraph: () => void;
  onOpenDetailModal: (title: string, content: React.ReactNode) => void;
}

export function OverviewTab({
  investigation,
  graph,
  jurisdictionAlerts,
  continuityAlerts,
  patternLeads,
  onInvestigateEntity,
  onOpenGraph,
  onOpenDetailModal,
}: OverviewTabProps) {
  const totalNodesCount = graph?.nodes.length || investigation?.entityCount || 0;
  const totalEdgesCount = graph?.edges.length || 0;

  // Derive Entity Type counts
  const entityTypeCounts = (graph?.nodes || []).reduce<Record<string, number>>((acc, n) => {
    const key = n.type.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Derive Relationship Type counts
  const relTypeCounts = (graph?.edges || []).reduce<Record<string, number>>((acc, e) => {
    const key = e.type || "CONNECTED_TO";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Group nodes by community
  const communityMap = (graph?.nodes || []).reduce<Record<string, { nodeCount: number; bridgeCount: number }>>((acc, n) => {
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

  // Top central entities
  const centralNodes = (graph?.nodes || [])
    .map((n) => {
      const degree = (graph?.edges || []).filter((e) => e.source === n.id || e.target === n.id).length;
      return { ...n, degree };
    })
    .sort((a, b) => b.degree - a.degree);

  const bridgeNodes = (graph?.nodes || []).filter((n) => n.isBridge || (n.betweennessCentrality && n.betweennessCentrality > 0));

  const locationsCount = (graph?.nodes || []).filter((n) => n.type.toLowerCase() === "location").length || 2;

  return (
    <div className="flex flex-col gap-6 font-mono text-slate-200">
      {/* 1. TOP 8 KPI CARDS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-3 text-center transition-colors hover:border-slate-600">
          <div className="flex items-center justify-center text-[#4F8EF7] mb-1"><Layers className="h-4 w-4" /></div>
          <div className="font-mono text-xl font-bold text-[#4F8EF7]">{totalNodesCount}</div>
          <div className="text-[9px] uppercase text-slate-400">TOTAL ENTITIES</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-3 text-center transition-colors hover:border-slate-600">
          <div className="flex items-center justify-center text-[#4FAF9D] mb-1"><Network className="h-4 w-4" /></div>
          <div className="font-mono text-xl font-bold text-[#4FAF9D]">{totalEdgesCount}</div>
          <div className="text-[9px] uppercase text-slate-400">RELATIONSHIPS</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-3 text-center transition-colors hover:border-slate-600">
          <div className="flex items-center justify-center text-[#A66DD4] mb-1"><BarChart3 className="h-4 w-4" /></div>
          <div className="font-mono text-xl font-bold text-[#A66DD4]">{communities.length || 1}</div>
          <div className="text-[9px] uppercase text-slate-400">COMMUNITIES</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-3 text-center transition-colors hover:border-slate-600">
          <div className="flex items-center justify-center text-[#D6A84F] mb-1"><Shield className="h-4 w-4" /></div>
          <div className="font-mono text-xl font-bold text-[#D6A84F]">{bridgeNodes.length || 1}</div>
          <div className="text-[9px] uppercase text-slate-400">BRIDGES</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-3 text-center transition-colors hover:border-slate-600">
          <div className="flex items-center justify-center text-[#D95C5C] mb-1"><Zap className="h-4 w-4" /></div>
          <div className="font-mono text-xl font-bold text-[#D95C5C]">{patternLeads.length}</div>
          <div className="text-[9px] uppercase text-slate-400">PATTERNS</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-3 text-center transition-colors hover:border-slate-600">
          <div className="flex items-center justify-center text-[#C56B91] mb-1"><Shield className="h-4 w-4" /></div>
          <div className="font-mono text-xl font-bold text-[#C56B91]">{jurisdictionAlerts.length || 2}</div>
          <div className="text-[9px] uppercase text-slate-400">JURISDICTIONS</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-3 text-center transition-colors hover:border-slate-600">
          <div className="flex items-center justify-center text-[#D9825B] mb-1"><Fingerprint className="h-4 w-4" /></div>
          <div className="font-mono text-xl font-bold text-[#D9825B]">{continuityAlerts.length || 1}</div>
          <div className="text-[9px] uppercase text-slate-400">TRANSITIONS</div>
        </div>

        <div className="rounded-md border border-[#26303C] bg-[#10151D] p-3 text-center transition-colors hover:border-slate-600">
          <div className="flex items-center justify-center text-[#6FBF8F] mb-1"><MapPin className="h-4 w-4" /></div>
          <div className="font-mono text-xl font-bold text-[#6FBF8F]">{locationsCount}</div>
          <div className="text-[9px] uppercase text-slate-400">LOCATIONS</div>
        </div>
      </div>

      {/* 2. ENTITY & RELATIONSHIP DISTRIBUTION VISUALIZATIONS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <span className="font-mono text-xs font-semibold text-[#4F8EF7] uppercase tracking-wider">
              A. ENTITY TYPE DISTRIBUTION
            </span>
            <button
              type="button"
              onClick={() =>
                onOpenDetailModal(
                  "Entity Type Breakdown",
                  <div className="space-y-2 text-xs">
                    {Object.entries(entityTypeCounts).map(([t, c]) => (
                      <div key={t} className="flex justify-between border-b border-[#26303C] py-1">
                        <span className="uppercase font-semibold text-slate-300">{t}</span>
                        <span className="text-[#4F8EF7] font-bold">{c}</span>
                      </div>
                    ))}
                  </div>
                )
              }
              className="text-[10px] text-slate-400 hover:text-slate-200 uppercase"
            >
              View Details →
            </button>
          </div>
          <div className="mt-4">
            <EntityDistributionChart data={entityTypeCounts} totalCount={totalNodesCount} onSelectType={onInvestigateEntity} />
          </div>
        </div>

        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <span className="font-mono text-xs font-semibold text-[#4FAF9D] uppercase tracking-wider">
              B. RELATIONSHIP TYPE DISTRIBUTION
            </span>
            <button
              type="button"
              onClick={() =>
                onOpenDetailModal(
                  "Relationship Type Breakdown",
                  <div className="space-y-2 text-xs">
                    {Object.entries(relTypeCounts).map(([r, c]) => (
                      <div key={r} className="flex justify-between border-b border-[#26303C] py-1">
                        <span className="uppercase font-semibold text-slate-300">{r}</span>
                        <span className="text-[#4FAF9D] font-bold">{c}</span>
                      </div>
                    ))}
                  </div>
                )
              }
              className="text-[10px] text-slate-400 hover:text-slate-200 uppercase"
            >
              View Details →
            </button>
          </div>
          <div className="mt-4">
            <RelationshipDistributionChart data={relTypeCounts} totalCount={totalEdgesCount} />
          </div>
        </div>
      </div>

      {/* 3. COMMUNITY & CENTRALITY RANKINGS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <span className="font-mono text-xs font-semibold text-[#A66DD4] uppercase tracking-wider">
              C. COMMUNITY SIZE DISTRIBUTION (LOUVAIN)
            </span>
          </div>
          <div className="mt-4">
            <CommunityDistributionChart communities={communities} totalNodes={totalNodesCount} onSelectCommunity={() => onOpenGraph()} />
          </div>
        </div>

        <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <span className="font-mono text-xs font-semibold text-[#4F8EF7] uppercase tracking-wider">
              D. MOST CONNECTED ENTITIES
            </span>
          </div>
          <div className="mt-4">
            <CentralityRankingChart nodes={centralNodes} onSelectEntity={onInvestigateEntity} />
          </div>
        </div>
      </div>

      {/* 4. GRAPH EXPLORATION CTA BANNER */}
      <div className="flex items-center justify-between rounded-md border border-[#4F8EF7]/40 bg-[#10151D] p-5">
        <div>
          <div className="font-bold text-[#4F8EF7] uppercase text-sm">EXPLORE INVESTIGATION IN 3D GRAPH WORKSPACE</div>
          <div className="text-xs text-slate-400">
            Seamlessly transition into interactive 3D WebGL graph mode with N-hop expansion, Louvain communities, and bridge node toggles.
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenGraph}
          className="flex items-center gap-2 rounded bg-[#4F8EF7] px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:bg-[#3B78E7] transition-colors uppercase"
        >
          <span>Explore in Investigation Graph</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

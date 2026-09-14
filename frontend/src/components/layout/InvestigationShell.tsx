import { useEffect, useState } from "react";
import { ChevronRight, Network } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { InsightStrip } from "@/components/dashboard/InsightStrip";
import { InvestigationGraph } from "@/components/graph/InvestigationGraph";
import { GraphLegend, GraphToolbar } from "@/components/graph/GraphToolbar";
import { SearchStatus } from "@/components/search/SearchStatus";
import { EntityPanel } from "@/components/entity/EntityPanel";
import { InvestigationTimeline } from "@/components/timeline/InvestigationTimeline";
import { SearchWorkspace } from "@/components/search/SearchWorkspace";
import { CasesWorkspace } from "@/components/cases/CasesWorkspace";
import { TimelineWorkspace } from "@/components/timeline/TimelineWorkspace";
import { MapWorkspace } from "@/components/map/MapWorkspace";
import { EvidenceWorkspace } from "@/components/evidence/EvidenceWorkspace";
import { SettingsWorkspace } from "@/components/settings/SettingsWorkspace";
import { useInvestigationStore } from "@/store/investigationStore";
import { cn } from "@/lib/cn";

export function InvestigationShell() {
  const load = useInvestigationStore((s) => s.loadInvestigation);
  const focus = useInvestigationStore((s) => s.workspaceFocus);
  const graph = useInvestigationStore((s) => s.graph);
  const activeCaseId = useInvestigationStore((s) => s.activeCaseId);
  const [contextPanelOpen, setContextPanelOpen] = useState(true);

  useEffect(() => {
    void load();
  }, [load]);

  const isGraphMode = focus === "investigation" || focus === "network";
  const isDedicatedNetwork = focus === "network";

  // Dispatch window resize events to guarantee 3D WebGL canvas dimensions are pixel-perfect
  useEffect(() => {
    if (isGraphMode) {
      window.dispatchEvent(new Event("resize"));
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [contextPanelOpen, focus, isGraphMode]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-nexus-bg text-nexus-text">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Global Topbar / Search */}
        <Topbar />

        {/* Workspace Body */}
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          {/* Graph & Investigation Workspace (mounted for instant display & WebGL state preservation) */}
          <div
            className={cn(
              "flex min-h-0 min-w-0 flex-1 overflow-hidden",
              !isGraphMode && "hidden",
            )}
          >
            {/* Center Area: Graph + Toolbar + (optional KPIs & bottom Timeline in investigation mode) */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              {/* Quick KPI Strip (Investigation mode only) */}
              {!isDedicatedNetwork && <InsightStrip />}

              {/* Dedicated Network Header Bar (Network mode only) */}
              {isDedicatedNetwork && (
                <div className="flex shrink-0 items-center justify-between border-b border-nexus-line bg-nexus-raised/95 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded border border-nexus-cyan/40 bg-nexus-cyan/10">
                      <Network className="h-4 w-4 text-nexus-cyan" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold tracking-wider text-nexus-text uppercase">
                          NETWORK TOPOLOGY & LINK SURVEILLANCE
                        </span>
                        <span className="rounded bg-nexus-cyan/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-nexus-cyan uppercase">
                          3D CLUSTER
                        </span>
                      </div>
                      <div className="text-[10px] text-nexus-muted">
                        Full relational graph across communications, core banking transfers, and vehicle checkpoints.
                      </div>
                    </div>
                  </div>

                  {/* Network Topology Metrics */}
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 rounded border border-nexus-line bg-black/40 px-2.5 py-1">
                      <span className="text-nexus-muted">NODES:</span>
                      <span className="font-bold text-nexus-cyan">{graph?.nodes.length ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded border border-nexus-line bg-black/40 px-2.5 py-1">
                      <span className="text-nexus-muted">EDGES:</span>
                      <span className="font-bold text-emerald-400">{graph?.edges.length ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded border border-nexus-line bg-black/40 px-2.5 py-1">
                      <span className="text-nexus-muted">FOCAL:</span>
                      <span className="font-bold text-amber-300">{graph?.focalId ?? activeCaseId}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Graph Workspace Container */}
              <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
                <GraphToolbar />
                <InvestigationGraph />
                <GraphLegend />
                <SearchStatus />

                {/* Floating Expand Tab at Far Right Edge (Visible when panel is collapsed) */}
                {!contextPanelOpen && (
                  <button
                    type="button"
                    onClick={() => setContextPanelOpen(true)}
                    title="Show context panel"
                    className="absolute right-0 top-3 z-30 flex h-8 w-8 items-center justify-center rounded-l border border-r-0 border-nexus-line bg-nexus-raised/95 text-nexus-muted shadow-lg transition-all hover:border-nexus-cyan/50 hover:bg-nexus-panel hover:text-nexus-cyan"
                    aria-label="Show context panel"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Horizontal Chronological Timeline (Investigation mode only) */}
              {!isDedicatedNetwork && <InvestigationTimeline />}
            </div>

            {/* Persistent Right Context / Evidence Rail (Collapsible in both modes) */}
            <EntityPanel
              isOpen={contextPanelOpen}
              onToggle={() => setContextPanelOpen((prev) => !prev)}
            />
          </div>

          {/* Dedicated Search Workspace */}
          {focus === "search" && (
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <SearchWorkspace />
            </div>
          )}

          {/* Dedicated Cases Workspace */}
          {focus === "cases" && (
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <CasesWorkspace />
            </div>
          )}

          {/* Dedicated Timeline Workspace */}
          {focus === "timeline" && (
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <TimelineWorkspace />
            </div>
          )}

          {/* Dedicated Map / Location Intelligence Workspace */}
          {focus === "map" && (
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <MapWorkspace />
            </div>
          )}

          {/* Dedicated Evidence Workspace */}
          {focus === "evidence" && (
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <EvidenceWorkspace />
            </div>
          )}

          {/* Dedicated Settings Workspace */}
          {focus === "settings" && (
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <SettingsWorkspace />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

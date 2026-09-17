import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
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
import { IngestionWorkspace } from "@/components/ingestion/IngestionWorkspace";
import { AnalyticsWorkspace } from "@/components/analytics/AnalyticsWorkspace";
import { ReportCenterWorkspace } from "@/components/reports/ReportCenterWorkspace";
import { SettingsWorkspace } from "@/components/settings/SettingsWorkspace";
import { Login } from "@/components/auth/Login";
import { useInvestigationStore } from "@/store/investigationStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/cn";

export function InvestigationShell() {
  const load = useInvestigationStore((s) => s.loadInvestigation);
  const focus = useInvestigationStore((s) => s.workspaceFocus);
  const [contextPanelOpen, setContextPanelOpen] = useState(true);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    void load();
  }, [load]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const isGraphMode = focus === "investigation";

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
            {/* Center Area: Graph + Toolbar + KPIs & bottom Timeline */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              {/* Quick KPI Strip */}
              <InsightStrip />

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

              {/* Horizontal Chronological Timeline */}
              <InvestigationTimeline />
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

          {/* Dedicated Ingestion & Vision Workspace */}
          {focus === "ingestion" && (
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <IngestionWorkspace />
            </div>
          )}

          {/* Dedicated Analytics & Pattern Intelligence Workspace */}
          {focus === "analytics" && (
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <AnalyticsWorkspace />
            </div>
          )}

          {/* Dedicated Report Center Workspace */}
          {focus === "reports" && (
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <ReportCenterWorkspace />
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

import { Shield, Sliders, Server, CheckCircle2, AlertCircle } from "lucide-react";
import { useInvestigationStore } from "@/store/investigationStore";
import { apiMode } from "@/api/client";

export function SettingsWorkspace() {
  const investigation = useInvestigationStore((s) => s.investigation);
  const focalId = useInvestigationStore((s) => s.focalEntityId);
  const selectedEntity = useInvestigationStore((s) => s.selectedEntity);
  const depth = useInvestigationStore((s) => s.depth);
  const setDepth = useInvestigationStore((s) => s.setDepth);
  const relFilters = useInvestigationStore((s) => s.relFilters);
  const timeFrom = useInvestigationStore((s) => s.timeFrom);
  const timeTo = useInvestigationStore((s) => s.timeTo);
  const systemStatus = useInvestigationStore((s) => s.systemStatus);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-nexus-bg p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex shrink-0 flex-col gap-1 border-b border-nexus-line pb-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-nexus-cyan uppercase">
          <span>SYSTEM & INVESTIGATION CONFIGURATION</span>
          <span className="h-1 w-1 rounded-full bg-nexus-cyan/40" />
          <span className="text-nexus-muted">COMMAND TELEMETRY</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-nexus-text">
          Application & Investigation Settings
        </h1>
        <p className="text-xs text-nexus-muted">
          Read-only system parameters, runtime API configuration, and investigation session telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {/* Section 1: Investigation Session */}
        <div className="rounded-lg border border-nexus-line bg-nexus-raised/90 p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-nexus-line/40 pb-3">
            <Shield className="h-4 w-4 text-nexus-cyan" />
            <h2 className="text-sm font-semibold text-nexus-text">
              Investigation Telemetry
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div className="rounded border border-nexus-line/50 bg-black/30 p-3">
              <span className="font-mono text-[10px] text-nexus-muted uppercase block">Investigation ID</span>
              <span className="mt-1 font-mono text-sm font-medium text-nexus-cyan">
                {investigation?.id ?? "INV-042"}
              </span>
            </div>

            <div className="rounded border border-nexus-line/50 bg-black/30 p-3">
              <span className="font-mono text-[10px] text-nexus-muted uppercase block">Data Integration Mode</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-sm font-medium text-slate-200 uppercase">
                  {apiMode === "live" ? "FastAPI Live Backend" : "Synthetic Mock Store"}
                </span>
              </div>
            </div>

            <div className="rounded border border-nexus-line/50 bg-black/30 p-3">
              <span className="font-mono text-[10px] text-nexus-muted uppercase block">Current Focal Subject</span>
              <span className="mt-1 font-mono text-sm font-medium text-slate-200">
                {focalId ?? "P001 (Aarav Sharma)"}
              </span>
            </div>

            <div className="rounded border border-nexus-line/50 bg-black/30 p-3">
              <span className="font-mono text-[10px] text-nexus-muted uppercase block">Currently Inspected Entity</span>
              <span className="mt-1 font-mono text-sm font-medium text-slate-200">
                {selectedEntity ? `${selectedEntity.label} (${selectedEntity.id})` : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Display & Graph Configuration */}
        <div className="rounded-lg border border-nexus-line bg-nexus-raised/90 p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-nexus-line/40 pb-3">
            <Sliders className="h-4 w-4 text-nexus-cyan" />
            <h2 className="text-sm font-semibold text-nexus-text">
              Display & Graph Controls
            </h2>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div>
              <span className="font-mono text-[10px] text-nexus-muted uppercase block mb-1.5">
                Traversal Graph Depth
              </span>
              <div className="flex items-center gap-2">
                {([1, 2, 3] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => void setDepth(d)}
                    className={`rounded px-4 py-1.5 font-mono text-xs transition-all ${
                      depth === d
                        ? "border border-nexus-cyan bg-nexus-cyan/20 text-nexus-cyan font-bold shadow-sm"
                        : "border border-nexus-line bg-black/40 text-nexus-muted hover:text-nexus-text"
                    }`}
                  >
                    {d} {d === 1 ? "Hop" : "Hops"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-mono text-[10px] text-nexus-muted uppercase block mb-1">
                Active Relationship Filters
              </span>
              <div className="flex flex-wrap gap-1.5">
                {relFilters.length > 0 ? (
                  relFilters.map((rf) => (
                    <span
                      key={rf}
                      className="rounded border border-nexus-cyan/40 bg-nexus-cyan/10 px-2 py-0.5 font-mono text-[10px] text-nexus-cyan uppercase"
                    >
                      {rf}
                    </span>
                  ))
                ) : (
                  <span className="font-mono text-[11px] text-nexus-muted">
                    All Relationship Types Active (No Filter Applied)
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="font-mono text-[10px] text-nexus-muted uppercase block mb-1">
                Temporal Range Window
              </span>
              <div className="font-mono text-xs text-slate-300">
                {timeFrom} ⟷ {timeTo}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: System Status */}
        <div className="rounded-lg border border-nexus-line bg-nexus-raised/90 p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-nexus-line/40 pb-3">
            <Server className="h-4 w-4 text-nexus-cyan" />
            <h2 className="text-sm font-semibold text-nexus-text">
              System Health & Architecture
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div className="rounded border border-nexus-line/50 bg-black/30 p-3">
              <span className="font-mono text-[10px] text-nexus-muted uppercase block">API Gateway Status</span>
              <div className="mt-1 flex items-center gap-2">
                {systemStatus === "ONLINE" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="font-mono text-sm font-semibold text-emerald-400">ONLINE</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    <span className="font-mono text-sm font-semibold text-amber-400">DEGRADED</span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded border border-nexus-line/50 bg-black/30 p-3">
              <span className="font-mono text-[10px] text-nexus-muted uppercase block">API Endpoint Base</span>
              <span className="mt-1 font-mono text-sm text-slate-300 block truncate">
                {baseUrl}
              </span>
            </div>

            <div className="rounded border border-nexus-line/50 bg-black/30 p-3">
              <span className="font-mono text-[10px] text-nexus-muted uppercase block">Database Store</span>
              <span className="mt-1 font-mono text-sm text-slate-300 block">
                PostgreSQL / Supabase (Graph Schema)
              </span>
            </div>

            <div className="rounded border border-nexus-line/50 bg-black/30 p-3">
              <span className="font-mono text-[10px] text-nexus-muted uppercase block">Engine & Client</span>
              <span className="mt-1 font-mono text-sm text-slate-300 block">
                FastAPI 0.115 + React 19 + 3D ForceGraph
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

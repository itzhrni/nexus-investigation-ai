import { useInvestigationStore } from "@/store/investigationStore";

export function WhatChanged() {
  const insight = useInvestigationStore((s) => s.whatChanged);
  if (!insight) {
    return (
      <div className="w-[280px] shrink-0 rounded-md border border-nexus-line bg-black/30 p-3 text-xs text-nexus-muted">
        What Changed? appears after a focal graph is built.
      </div>
    );
  }

  return (
    <div className="w-[300px] shrink-0 overflow-y-auto rounded-md border border-nexus-line bg-black/30 p-3">
      <div className="font-mono text-[10px] tracking-wide text-nexus-cyan">WHAT CHANGED?</div>
      <p className="mt-1 text-[11px] text-nexus-muted">Descriptive comparison around {insight.anchorLabel}. Not a forecast.</p>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        {[insight.before, insight.after].map((period) => (
          <div key={period.label}>
            <div className="text-nexus-muted">{period.label}</div>
            <p>Comm: {period.communication}</p>
            <p>Loc: {period.locations.join(", ")}</p>
            <p>Veh: {period.vehicles.join(", ")}</p>
            {period.networkNote && <p>{period.networkNote}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

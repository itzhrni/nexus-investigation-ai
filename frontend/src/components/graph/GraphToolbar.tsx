import { Crosshair, Expand, Focus, Orbit, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { ENTITY_COLORS, ENTITY_LABELS } from "@/lib/cn";
import { useInvestigationStore } from "@/store/investigationStore";
import type { EntityType, RelFilterGroup } from "@/types/nexus";

const REL: { id: RelFilterGroup; label: string }[] = [
  { id: "communication", label: "Communication" },
  { id: "financial", label: "Financial" },
  { id: "vehicle", label: "Vehicle" },
  { id: "location", label: "Location" },
  { id: "case", label: "Case / Crime" },
];

const LEGEND: EntityType[] = ["person", "phone", "sim", "device", "vehicle", "account", "location", "case", "event"];

export function GraphToolbar() {
  const depth = useInvestigationStore((s) => s.depth);
  const setDepth = useInvestigationStore((s) => s.setDepth);
  const relFilters = useInvestigationStore((s) => s.relFilters);
  const toggle = useInvestigationStore((s) => s.toggleRelFilter);
  const selectedNodeId = useInvestigationStore((s) => s.selectedNodeId);
  const selectNode = useInvestigationStore((s) => s.selectNode);
  const focalId = useInvestigationStore((s) => s.focalEntityId);
  const refresh = useInvestigationStore((s) => s.refreshGraph);
  const isOrbiting = useInvestigationStore((s) => s.isOrbiting);
  const toggleOrbit = useInvestigationStore((s) => s.toggleOrbit);

  return (
    <div className="pointer-events-auto absolute left-4 top-4 z-10 flex max-w-[min(760px,calc(100%-2rem))] flex-wrap items-center gap-2 rounded-md border border-nexus-line bg-nexus-raised/85 p-2 backdrop-blur-md">
      <span className="px-1 font-mono text-[10px] text-nexus-muted">DEPTH</span>
      {([1, 2, 3] as const).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => void setDepth(d)}
          className={cn(
            "h-7 w-7 rounded text-xs",
            depth === d ? "bg-nexus-cyan/20 text-nexus-cyan ring-1 ring-nexus-cyan/40" : "text-nexus-muted hover:bg-white/5",
          )}
        >
          {d}
        </button>
      ))}
      <span className="mx-1 h-4 w-px bg-nexus-line" />
      {REL.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => void toggle(r.id)}
          className={cn(
            "rounded px-2 py-1 text-[10px] uppercase tracking-wide",
            relFilters.includes(r.id)
              ? "bg-nexus-cyan/15 text-nexus-cyan"
              : "text-nexus-muted hover:text-nexus-text",
          )}
        >
          {r.label}
        </button>
      ))}
      <span className="mx-1 h-4 w-px bg-nexus-line" />
      <button
        type="button"
        className={cn(
          "flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[10px] tracking-wide transition-colors",
          isOrbiting
            ? "bg-nexus-cyan/20 text-nexus-cyan ring-1 ring-nexus-cyan/50"
            : "text-nexus-muted hover:text-nexus-text hover:bg-white/5"
        )}
        title={isOrbiting ? "Pause 3D auto-orbit" : "Start 3D surveillance auto-orbit"}
        onClick={toggleOrbit}
      >
        <Orbit className={cn("h-3.5 w-3.5", isOrbiting && "animate-spin text-nexus-cyan")} style={{ animationDuration: "8s" }} />
        <span>ORBIT</span>
      </button>
      <button
        type="button"
        className="rounded p-1.5 text-nexus-muted hover:text-nexus-text"
        title="Reset view"
        onClick={() => void refresh()}
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className="rounded p-1.5 text-nexus-muted hover:text-nexus-text"
        title="Focus selected"
        onClick={() => selectedNodeId && void selectNode(selectedNodeId)}
      >
        <Focus className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className="rounded p-1.5 text-nexus-muted hover:text-nexus-text"
        title="Return to focal"
        onClick={() => focalId && void selectNode(focalId)}
      >
        <Crosshair className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className="rounded p-1.5 text-nexus-muted hover:text-nexus-text"
        title="Expand depth"
        onClick={() => void setDepth(Math.min(3, depth + 1) as 1 | 2 | 3)}
      >
        <Expand className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function GraphLegend() {
  return (
    <div className="pointer-events-none absolute bottom-3 left-4 z-10 flex flex-wrap gap-2">
      {LEGEND.map((type) => (
        <div key={type} className="flex items-center gap-1.5 rounded border border-nexus-line/80 bg-black/40 px-1.5 py-0.5">
          <span className="h-2 w-2 rounded-full" style={{ background: ENTITY_COLORS[type] }} />
          <span className="text-[10px] text-nexus-muted">{ENTITY_LABELS[type]}</span>
        </div>
      ))}
    </div>
  );
}

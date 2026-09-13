import { useState } from "react";
import {
  Calendar,
  Filter,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  formatRelationshipLabel,
  formatTimelineDate,
  getCategoryBadge,
} from "@/lib/timelinePresenter";
import { useInvestigationStore } from "@/store/investigationStore";
import type { TimelineEvent } from "@/types/nexus";

const CATEGORY_FILTERS = [
  "ALL",
  "Communication",
  "Financial Transfer",
  "Location Sighting",
  "Vehicle Association",
  "Case / Crime",
  "Ownership",
  "Phone Association",
  "SIM Association",
];

export function TimelineWorkspace() {
  const events = useInvestigationStore((s) => s.timeline);
  const from = useInvestigationStore((s) => s.timeFrom);
  const to = useInvestigationStore((s) => s.timeTo);
  const setRange = useInvestigationStore((s) => s.setTimeRange);
  const whatChanged = useInvestigationStore((s) => s.whatChanged);
  const selectNode = useInvestigationStore((s) => s.selectNode);
  const selectEdge = useInvestigationStore((s) => s.selectEdge);
  const selectedNodeId = useInvestigationStore((s) => s.selectedNodeId);
  const selectedEdgeId = useInvestigationStore((s) => s.selectedEdgeId);
  const setWorkspaceFocus = useInvestigationStore((s) => s.setWorkspaceFocus);

  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const sortedEvents = events
    .slice()
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const filteredEvents = sortedEvents.filter((e) => {
    if (categoryFilter === "ALL") return true;
    const cat = formatRelationshipLabel(e.kind);
    return cat.toLowerCase() === categoryFilter.toLowerCase();
  });

  const activeEvent =
    filteredEvents.find((e) => e.id === selectedEventId) ||
    filteredEvents[0] ||
    null;

  const handleSelectEvent = (event: TimelineEvent) => {
    setSelectedEventId(event.id);
    if (event.edgeIds?.[0]) {
      void selectEdge(event.edgeIds[0]);
    } else if (event.entityIds[0]) {
      void selectNode(event.entityIds[0]);
    }
  };

  const handleEntityClick = async (entityId: string) => {
    await selectNode(entityId);
    setWorkspaceFocus("investigation");
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-nexus-bg p-6 lg:p-8">
      {/* Top Header */}
      <div className="mb-6 flex shrink-0 flex-col gap-1 border-b border-nexus-line pb-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-nexus-cyan uppercase">
          <span>TEMPORAL INTELLIGENCE & CHRONOLOGY</span>
          <span className="h-1 w-1 rounded-full bg-nexus-cyan/40" />
          <span className="text-nexus-muted">SEQUENCE OF VERIFIED EVENTS & CHANGES</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-nexus-text">
              Chronological Timeline & Temporal Analysis
            </h1>
            <p className="text-xs text-nexus-muted">
              Inspect time-series telemetry across communication records, financial routing, and location sightings.
            </p>
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-3 rounded-lg border border-nexus-line bg-nexus-raised/95 px-3 py-1.5">
            <Calendar className="h-4 w-4 text-nexus-cyan" />
            <label className="flex items-center gap-1.5 font-mono text-[10px] text-nexus-muted">
              <span>FROM</span>
              <input
                type="date"
                value={from}
                onChange={(e) => void setRange(e.target.value, to)}
                className="rounded border border-nexus-line bg-black/50 px-2 py-0.5 font-mono text-xs text-nexus-text outline-none focus:border-nexus-cyan/50"
              />
            </label>
            <span className="text-nexus-line">→</span>
            <label className="flex items-center gap-1.5 font-mono text-[10px] text-nexus-muted">
              <span>TO</span>
              <input
                type="date"
                value={to}
                onChange={(e) => void setRange(from, e.target.value)}
                className="rounded border border-nexus-line bg-black/50 px-2 py-0.5 font-mono text-xs text-nexus-text outline-none focus:border-nexus-cyan/50"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Prominent "What Changed?" Temporal Comparison Banner */}
      {whatChanged && (
        <div className="mb-6 shrink-0 rounded-lg border border-nexus-cyan/40 bg-nexus-raised/90 p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-nexus-line/50 pb-2">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-nexus-cyan uppercase">
              <TrendingUp className="h-4 w-4 text-nexus-cyan" />
              <span>TEMPORAL COMPARISON: WHAT CHANGED?</span>
            </div>
            <span className="font-mono text-[11px] text-nexus-muted">
              Anchor: <span className="text-slate-200">{whatChanged.anchorLabel}</span>
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Before Anchor */}
            <div className="rounded border border-nexus-line/60 bg-black/30 p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold text-nexus-muted uppercase">
                  {whatChanged.before.label}
                </span>
                <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-nexus-muted">
                  Baseline Window
                </span>
              </div>
              <div className="mt-2 space-y-1.5 text-xs text-slate-300">
                <div>
                  <span className="text-nexus-muted font-mono text-[10px]">COMMUNICATION: </span>
                  {whatChanged.before.communication}
                </div>
                {whatChanged.before.locations.length > 0 && (
                  <div>
                    <span className="text-nexus-muted font-mono text-[10px]">LOCATIONS: </span>
                    {whatChanged.before.locations.join(", ")}
                  </div>
                )}
                {whatChanged.before.vehicles.length > 0 && (
                  <div>
                    <span className="text-nexus-muted font-mono text-[10px]">VEHICLES: </span>
                    {whatChanged.before.vehicles.join(", ")}
                  </div>
                )}
                {whatChanged.before.networkNote && (
                  <div className="mt-1 font-mono text-[11px] text-slate-400 italic">
                    {whatChanged.before.networkNote}
                  </div>
                )}
              </div>
            </div>

            {/* After Anchor */}
            <div className="rounded border border-amber-500/30 bg-amber-500/[0.03] p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold text-amber-300 uppercase">
                  {whatChanged.after.label}
                </span>
                <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] text-amber-200">
                  Anomaly / Shift
                </span>
              </div>
              <div className="mt-2 space-y-1.5 text-xs text-slate-300">
                <div>
                  <span className="text-amber-300/70 font-mono text-[10px]">COMMUNICATION: </span>
                  {whatChanged.after.communication}
                </div>
                {whatChanged.after.locations.length > 0 && (
                  <div>
                    <span className="text-amber-300/70 font-mono text-[10px]">LOCATIONS: </span>
                    {whatChanged.after.locations.join(", ")}
                  </div>
                )}
                {whatChanged.after.vehicles.length > 0 && (
                  <div>
                    <span className="text-amber-300/70 font-mono text-[10px]">VEHICLES: </span>
                    {whatChanged.after.vehicles.join(", ")}
                  </div>
                )}
                {whatChanged.after.networkNote && (
                  <div className="mt-1 font-mono text-[11px] text-amber-200/90 italic">
                    {whatChanged.after.networkNote}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Chips */}
      <div className="mb-4 flex shrink-0 flex-wrap items-center gap-1.5">
        <Filter className="mr-1.5 h-3.5 w-3.5 text-nexus-muted" />
        <span className="mr-1 font-mono text-[10px] tracking-wider text-nexus-muted uppercase">
          EVENT CATEGORY:
        </span>
        {CATEGORY_FILTERS.map((cat) => {
          const active = categoryFilter.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-mono transition-all",
                active
                  ? "border border-nexus-cyan/50 bg-nexus-cyan/15 text-nexus-cyan shadow-[0_0_8px_rgba(61,214,245,0.15)]"
                  : "border border-nexus-line bg-black/30 text-nexus-muted hover:border-nexus-line/80 hover:text-nexus-text",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Timeline Workspace (2-Column Split: Stream on Left, Event Detail on Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Chronological Event Stream (7 cols) */}
        <div className="flex flex-col rounded-lg border border-nexus-line bg-nexus-raised/90 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-nexus-line bg-nexus-panel/50 px-4 py-2.5">
            <span className="font-mono text-xs font-semibold tracking-wider text-nexus-cyan uppercase">
              CHRONOLOGICAL EVENT STREAM ({filteredEvents.length})
            </span>
            <span className="font-mono text-[10px] text-nexus-muted">
              Earliest to Latest
            </span>
          </div>

          <div className="divide-y divide-nexus-line/40 p-3 space-y-2.5">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((evt) => {
                const { dateStr, timeStr } = formatTimelineDate(evt.timestamp);
                const category = formatRelationshipLabel(evt.kind);
                const badge = getCategoryBadge(category);
                const isSelected =
                  evt.id === activeEvent?.id ||
                  (selectedNodeId && evt.entityIds.includes(selectedNodeId)) ||
                  (selectedEdgeId && evt.edgeIds?.includes(selectedEdgeId));

                return (
                  <div
                    key={evt.id}
                    onClick={() => handleSelectEvent(evt)}
                    className={cn(
                      "flex cursor-pointer items-start justify-between rounded-md border p-3 text-left transition-all",
                      isSelected
                        ? "border-nexus-cyan bg-nexus-cyan/10 shadow-sm"
                        : "border-nexus-line/60 bg-black/30 hover:border-nexus-cyan/40 hover:bg-black/50",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      {/* Top: Date & Category */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-200">
                          {dateStr}
                        </span>
                        {timeStr && (
                          <span className="font-mono text-[11px] text-nexus-muted">
                            {timeStr}
                          </span>
                        )}
                        <span className="h-1 w-1 rounded-full bg-nexus-line" />
                        <span className={cn("inline-flex items-center gap-1 font-sans text-xs font-semibold", badge.text)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
                          {category}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="mt-1 text-sm font-medium text-nexus-text">
                        {evt.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">
                        {evt.description}
                      </p>

                      {/* Participant Entity Pills */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {evt.entityIds.map((eid) => (
                          <span
                            key={eid}
                            className="rounded border border-nexus-line bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-slate-300"
                          >
                            {eid}
                          </span>
                        ))}
                      </div>
                    </div>

                    <ChevronRight className={cn("h-4 w-4 ml-3 shrink-0", isSelected ? "text-nexus-cyan" : "text-nexus-muted/40")} />
                  </div>
                );
              })
            ) : (
              <div className="flex min-h-[200px] items-center justify-center p-8 font-mono text-xs text-nexus-muted">
                No chronological events match the current filter range.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Event Inspector (5 cols) */}
        {activeEvent ? (
          <div className="flex flex-col rounded-lg border border-nexus-line bg-nexus-raised/95 p-5 lg:col-span-5 sticky top-6 self-start">
            <div className="flex items-center justify-between border-b border-nexus-line pb-3">
              <span className="font-mono text-[10px] font-semibold text-nexus-cyan tracking-wider uppercase">
                EVENT INSPECTOR
              </span>
              <span className="font-mono text-[11px] text-nexus-muted">{activeEvent.id}</span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {(() => {
                const category = formatRelationshipLabel(activeEvent.kind);
                const badge = getCategoryBadge(category);
                return (
                  <span className={cn("inline-flex items-center gap-1.5 rounded border border-nexus-line bg-black/40 px-2.5 py-1 text-xs font-semibold", badge.text)}>
                    <span className={cn("h-2 w-2 rounded-full", badge.dot)} />
                    {category}
                  </span>
                );
              })()}
            </div>

            <h2 className="mt-2 text-base font-bold text-nexus-text">
              {activeEvent.title}
            </h2>

            {/* Timestamp block */}
            <div className="mt-3 flex items-center gap-2 rounded border border-nexus-line bg-black/30 p-2.5 font-mono text-xs text-slate-300">
              <Clock className="h-4 w-4 text-nexus-cyan" />
              <span>Timestamp: {activeEvent.timestamp}</span>
            </div>

            {/* Full description */}
            <div className="mt-3 text-xs leading-relaxed text-slate-300">
              <span className="font-mono text-[10px] uppercase text-nexus-muted block mb-1">
                Event Narrative / Log
              </span>
              <div className="rounded border border-nexus-line/50 bg-black/20 p-3">
                {activeEvent.description}
              </div>
            </div>

            {/* Associated Entities List */}
            <div className="mt-4">
              <span className="font-mono text-[10px] uppercase text-nexus-cyan tracking-wider block mb-2">
                LINKED SUBJECTS & IDENTIFIERS ({activeEvent.entityIds.length})
              </span>
              <div className="space-y-1.5">
                {activeEvent.entityIds.map((eid) => (
                  <div
                    key={eid}
                    onClick={() => void handleEntityClick(eid)}
                    className="flex cursor-pointer items-center justify-between rounded border border-nexus-line bg-black/40 px-3 py-2 text-xs transition-colors hover:border-nexus-cyan/40 hover:bg-nexus-panel/60"
                  >
                    <span className="font-mono text-slate-200">{eid}</span>
                    <span className="font-mono text-[10px] text-nexus-cyan flex items-center gap-1">
                      <span>Center in Graph</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action to Jump to Investigation */}
            <button
              type="button"
              onClick={() => setWorkspaceFocus("investigation")}
              className="mt-6 flex items-center justify-center gap-2 rounded bg-nexus-cyan/15 px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-nexus-cyan ring-1 ring-nexus-cyan/40 hover:bg-nexus-cyan/25 transition-all"
            >
              <span>INSPECT IN INVESTIGATION GRAPH</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-nexus-line bg-black/20 p-8 text-center text-xs text-nexus-muted lg:col-span-5">
            Select an event to inspect timestamps, narrative, and connected subjects.
          </div>
        )}
      </div>
    </div>
  );
}

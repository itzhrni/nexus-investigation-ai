import { useInvestigationStore } from "@/store/investigationStore";
import { cn } from "@/lib/cn";
import {
  formatRelationshipLabel,
  formatTimelineDate,
  getCategoryBadge,
  formatEventSubtitle,
} from "@/lib/timelinePresenter";

const MIN = "2026-01-01";
const MAX = "2026-12-31";

export function InvestigationTimeline() {
  const events = useInvestigationStore((s) => s.timeline);
  const from = useInvestigationStore((s) => s.timeFrom);
  const to = useInvestigationStore((s) => s.timeTo);
  const setRange = useInvestigationStore((s) => s.setTimeRange);
  const focus = useInvestigationStore((s) => s.workspaceFocus);
  const selectNode = useInvestigationStore((s) => s.selectNode);
  const selectEdge = useInvestigationStore((s) => s.selectEdge);
  const selectedNodeId = useInvestigationStore((s) => s.selectedNodeId);
  const selectedEdgeId = useInvestigationStore((s) => s.selectedEdgeId);

  const sortedEvents = events
    .slice()
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return (
    <div
      className={cn(
        "flex h-[152px] shrink-0 flex-col border-t border-nexus-line bg-nexus-raised/95 transition-all",
        focus === "timeline" && "ring-1 ring-inset ring-nexus-cyan/30",
      )}
    >
      {/* Timeline Header Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-nexus-line/40 px-4 py-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-nexus-muted uppercase">
            CHRONOLOGICAL TIMELINE
          </span>
          <span className="h-1 w-1 rounded-full bg-nexus-line" />
          <span className="font-mono text-[11px] font-medium text-nexus-cyan">
            {sortedEvents.length} {sortedEvents.length === 1 ? "event" : "events"}
          </span>
        </div>

        {/* Temporal Range Controls */}
        <div className="flex items-center gap-3 text-[11px] text-nexus-muted">
          <label className="flex items-center gap-1.5 font-mono text-[10px]">
            <span>FROM</span>
            <input
              type="date"
              min={MIN}
              max={MAX}
              value={from}
              onChange={(e) => void setRange(e.target.value, to)}
              className="rounded border border-nexus-line bg-black/50 px-2 py-0.5 font-mono text-[11px] text-nexus-text outline-none transition-colors focus:border-nexus-cyan/50"
            />
          </label>
          <label className="flex items-center gap-1.5 font-mono text-[10px]">
            <span>TO</span>
            <input
              type="date"
              min={MIN}
              max={MAX}
              value={to}
              onChange={(e) => void setRange(from, e.target.value)}
              className="rounded border border-nexus-line bg-black/50 px-2 py-0.5 font-mono text-[11px] text-nexus-text outline-none transition-colors focus:border-nexus-cyan/50"
            />
          </label>
        </div>
      </div>

      {/* Horizontal Chronological Track */}
      <div className="flex flex-1 items-stretch gap-2.5 overflow-x-auto px-4 py-2 scrollbar-thin">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => {
            const { dateStr, timeStr } = formatTimelineDate(event.timestamp);
            const category = formatRelationshipLabel(event.kind);
            const badge = getCategoryBadge(category);
            const subtitle = formatEventSubtitle(event);

            const isSelected =
              (selectedNodeId && event.entityIds.includes(selectedNodeId)) ||
              (selectedEdgeId && event.edgeIds?.includes(selectedEdgeId));

            return (
              <button
                key={event.id}
                type="button"
                onClick={() => {
                  if (event.edgeIds?.[0]) {
                    void selectEdge(event.edgeIds[0]);
                  } else if (event.entityIds[0]) {
                    void selectNode(event.entityIds[0]);
                  }
                }}
                className={cn(
                  "group relative flex min-w-[200px] max-w-[230px] shrink-0 flex-col justify-between rounded border p-2.5 text-left transition-all",
                  isSelected
                    ? "border-nexus-cyan bg-nexus-cyan/15 ring-1 ring-nexus-cyan/50 shadow-[0_0_12px_rgba(61,214,245,0.15)]"
                    : "border-nexus-line/70 bg-black/40 hover:border-nexus-cyan/40 hover:bg-black/60",
                )}
              >
                {/* Top: Date & Time */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-1">
                  <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-200">
                    {dateStr}
                  </span>
                  {timeStr && (
                    <span className="font-mono text-[10px] text-nexus-muted">
                      {timeStr}
                    </span>
                  )}
                </div>

                {/* Middle: Category with Status Indicator */}
                <div className="my-1 flex items-center gap-1.5">
                  <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", badge.dot)} />
                  <span
                    className={cn(
                      "truncate font-sans text-xs font-semibold tracking-tight",
                      badge.text,
                    )}
                  >
                    {category}
                  </span>
                </div>

                {/* Bottom: Participant Entities / Details / Amount */}
                <div className="truncate font-mono text-[11px] text-slate-400 group-hover:text-slate-200">
                  {subtitle}
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex flex-1 items-center justify-center font-mono text-xs text-nexus-muted">
            No chronological investigation events recorded in this time range.
          </div>
        )}
      </div>
    </div>
  );
}

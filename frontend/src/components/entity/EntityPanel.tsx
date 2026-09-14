import { ChevronLeft } from "lucide-react";
import { cn, confidenceClass, ENTITY_LABELS, formatPhone } from "@/lib/cn";
import { formatRelationshipLabel } from "@/lib/timelinePresenter";
import { useInvestigationStore } from "@/store/investigationStore";
import { EvidencePanel } from "@/components/evidence/EvidencePanel";
import { WhyThisMatters } from "@/components/dashboard/WhyThisMatters";
import { IdentityMatches } from "@/components/entity/IdentityMatches";
import { JurisdictionAlert } from "@/components/jurisdiction/JurisdictionAlert";
import { ContinuityAlert } from "@/components/continuity/ContinuityAlert";

export interface EntityPanelProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function EntityPanel({ isOpen = true, onToggle }: EntityPanelProps) {
  const entity = useInvestigationStore((s) => s.selectedEntity);
  const edge = useInvestigationStore((s) => s.selectedEdge);
  const graph = useInvestigationStore((s) => s.graph);
  const alerts = useInvestigationStore((s) => s.jurisdictionAlerts);
  const continuity = useInvestigationStore((s) => s.continuityAlerts);
  const focus = useInvestigationStore((s) => s.workspaceFocus);

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-l border-nexus-line bg-nexus-raised/95 z-10 transition-[width,opacity] duration-200 ease-in-out shrink-0",
        isOpen
          ? "w-[350px] opacity-100 xl:w-[380px]"
          : "w-0 opacity-0 overflow-hidden border-l-0 pointer-events-none",
        focus === "evidence" && "ring-1 ring-inset ring-nexus-cyan/30",
      )}
    >
      <div className="flex h-full min-w-[350px] flex-col overflow-hidden xl:min-w-[380px]">
        {/* 1. Header — Visually touches the Topbar */}
        <div className="flex shrink-0 items-center justify-between border-b border-nexus-line bg-nexus-panel/40 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            {onToggle && (
              <button
                type="button"
                onClick={onToggle}
                title="Hide context panel"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-nexus-line bg-black/40 text-nexus-muted transition-colors hover:border-nexus-cyan/40 hover:bg-nexus-panel hover:text-nexus-cyan"
                aria-label="Hide context panel"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <div className="min-w-0">
              <div className="font-mono text-[10px] tracking-[0.2em] text-nexus-muted uppercase">CONTEXT</div>
              <div className="truncate text-sm font-semibold tracking-wide text-nexus-text">Entity / Evidence</div>
            </div>
          </div>
          {entity && (
            <span className="shrink-0 rounded border border-nexus-cyan/30 bg-nexus-cyan/10 px-2 py-0.5 font-mono text-[10px] font-medium text-nexus-cyan uppercase">
              {ENTITY_LABELS[entity.type] || entity.type}
            </span>
          )}
          {edge && !entity && (
            <span className="shrink-0 rounded border border-nexus-line bg-black/40 px-2 py-0.5 font-mono text-[10px] text-nexus-muted uppercase">
              Relationship
            </span>
          )}
        </div>

        {/* Main Continuous Scrollable Context Content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin">
          {/* 2. Selected Relationship Summary */}
          {edge && (
            <section className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold tracking-wider text-nexus-cyan uppercase">
                  SELECTED RELATIONSHIP
                </span>
                {edge.confidence != null && (
                  <span className={cn("font-mono text-[11px]", confidenceClass(edge.confidence))}>
                    {edge.confidence}% {edge.confidenceBand ? `· ${edge.confidenceBand}` : ""}
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-nexus-text">
                {formatRelationshipLabel(edge.type)}
              </h3>
              <p className="font-mono text-xs text-nexus-muted">
                {graph?.nodes.find((n) => n.id === edge.source)?.label ?? edge.source} ↔{" "}
                {graph?.nodes.find((n) => n.id === edge.target)?.label ?? edge.target}
              </p>
              {edge.summary && (
                <p className="pt-1 text-xs leading-relaxed text-slate-300">{edge.summary}</p>
              )}
            </section>
          )}

          {/* 3. Selected Entity Summary */}
          {entity && (
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold tracking-wider text-nexus-cyan uppercase">
                  SELECTED ENTITY
                </span>
                {entity.confidence != null && (
                  <span className={cn("font-mono text-[11px]", confidenceClass(entity.confidence))}>
                    {entity.confidence}% confidence
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold tracking-tight text-nexus-text">
                {entity.type === "phone" ? formatPhone(entity.label) : entity.label}
              </h3>
              <div className="flex items-center gap-2 font-mono text-xs text-nexus-muted">
                <span>{entity.id}</span>
                <span>·</span>
                <span className="uppercase">{ENTITY_LABELS[entity.type] || entity.type}</span>
              </div>

              {entity.summary && (
                <p className="text-xs leading-relaxed text-slate-300">{entity.summary}</p>
              )}

              {/* Identifiers */}
              {entity.identifiers && entity.identifiers.length > 0 && (
                <div className="space-y-1 border-t border-nexus-line/50 pt-2">
                  {entity.identifiers.map((i) => (
                    <div key={i.kind + i.value} className="flex justify-between text-xs">
                      <span className="text-nexus-muted">{i.kind}</span>
                      <span className="font-mono text-nexus-text">
                        {i.kind.toLowerCase().includes("phone") ? formatPhone(i.value) : i.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Aliases */}
              {entity.aliases && entity.aliases.length > 0 && (
                <div className="text-xs">
                  <span className="text-nexus-muted">Aliases: </span>
                  <span className="text-slate-200">{entity.aliases.join(", ")}</span>
                </div>
              )}

              {/* Multilingual scripts */}
              {entity.scripts && entity.scripts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {entity.scripts.map((s) => (
                    <span
                      key={s.locale}
                      className="rounded border border-nexus-line/60 bg-black/30 px-2 py-0.5 font-mono text-[11px] text-slate-300"
                    >
                      {s.text}
                    </span>
                  ))}
                </div>
              )}

              {/* Jurisdictions */}
              {entity.jurisdictions && entity.jurisdictions.length > 0 && (
                <div className="pt-1 text-xs">
                  <div className="font-mono text-[10px] uppercase text-nexus-muted">Jurisdiction</div>
                  <div className="mt-0.5 text-slate-300">
                    {entity.jurisdictions
                      .map((j) => [j.state, j.district, j.policeStation].filter(Boolean).join(" · "))
                      .join(", ")}
                  </div>
                </div>
              )}

              {/* Related cases */}
              {entity.relatedCaseIds && entity.relatedCaseIds.length > 0 && (
                <div className="pt-1 text-xs">
                  <span className="text-nexus-muted">Related Cases: </span>
                  <span className="font-mono text-nexus-cyan">{entity.relatedCaseIds.join(", ")}</span>
                </div>
              )}
            </section>
          )}

          {/* Empty state prompt if neither node nor edge is active */}
          {!entity && !edge && (
            <div className="rounded border border-dashed border-nexus-line/60 p-3 text-xs leading-relaxed text-nexus-muted">
              Select an entity node or relationship link on the graph to inspect 6-W evidence records and investigation context.
            </div>
          )}

          {/* 4. Evidence Items Section */}
          <EvidencePanel />

          {/* Subtle Separator */}
          <div className="my-1 h-px bg-nexus-line/40" />

          {/* 5. WHY THIS MATTERS Section */}
          <WhyThisMatters />

          {/* Subtle Separator */}
          <div className="my-1 h-px bg-nexus-line/40" />

          {/* 6. Optional Entity Details Section */}
          <IdentityMatches />

          {/* Cross-jurisdiction and Continuity Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              <div className="font-mono text-[10px] font-semibold tracking-wider text-nexus-muted uppercase">
                CROSS-STATE FOOTPRINTS
              </div>
              {alerts.map((a) => (
                <JurisdictionAlert key={a.id} alert={a} />
              ))}
            </div>
          )}

          {continuity.length > 0 && (
            <div className="space-y-2">
              <div className="font-mono text-[10px] font-semibold tracking-wider text-nexus-muted uppercase">
                IDENTITY CONTINUITY
              </div>
              {continuity.map((a) => (
                <ContinuityAlert key={a.id} alert={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

import { useInvestigationStore } from "@/store/investigationStore";

export function WhyThisMatters() {
  const whatChanged = useInvestigationStore((s) => s.whatChanged);
  const continuityAlerts = useInvestigationStore((s) => s.continuityAlerts);
  const jurisdictionAlerts = useInvestigationStore((s) => s.jurisdictionAlerts);
  const evidence = useInvestigationStore((s) => s.evidence);

  const insights: { id: string; text: string; tag?: string }[] = [];

  // 1. From whatChanged network note / detected changes
  if (whatChanged?.after?.networkNote) {
    const parts = whatChanged.after.networkNote
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean);
    parts.forEach((p, idx) => {
      insights.push({ id: `wc-note-${idx}`, text: p, tag: "Activity Change" });
    });
  }

  // 2. From whatChanged communication surge
  if (whatChanged?.after?.communication && whatChanged.after.communication !== "Normal") {
    insights.push({
      id: "wc-comm",
      text: `Post-incident activity shift: ${whatChanged.after.communication}`,
      tag: "Temporal Baseline",
    });
  }

  // 3. From continuity transitions
  continuityAlerts.forEach((alert, idx) => {
    const detail =
      alert.evidence?.[0] ||
      `Identifier transition detected: ${alert.fromLabel} → ${alert.toLabel} (${alert.identifierKind}).`;
    insights.push({
      id: `cont-${idx}`,
      text: detail,
      tag: `${alert.identifierKind} Transition`,
    });
  });

  // 4. From cross-jurisdiction operations
  jurisdictionAlerts.forEach((alert, idx) => {
    const detail =
      alert.supporting?.[0] ||
      `Cross-jurisdiction activity detected spanning ${alert.fromState} and ${alert.toState}.`;
    insights.push({
      id: `jur-${idx}`,
      text: detail,
      tag: "Interstate Footprint",
    });
  });

  // 5. From explainable evidence reasoning
  if (evidence?.reasoning && !insights.some((i) => i.text === evidence.reasoning)) {
    insights.push({
      id: "ev-reason",
      text: evidence.reasoning,
      tag: "Network Correlation",
    });
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-semibold tracking-[0.15em] text-nexus-cyan uppercase">
          WHY THIS MATTERS
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-nexus-muted">
          Investigation Insights
        </span>
      </div>
      <div className="h-px bg-nexus-line/60" />

      {insights.length > 0 ? (
        <div className="space-y-2">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="rounded border border-nexus-line/60 bg-black/40 p-2.5 text-xs transition-colors hover:border-nexus-cyan/30"
            >
              {ins.tag && (
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-nexus-cyan" />
                  <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-nexus-cyan">
                    {ins.tag}
                  </span>
                </div>
              )}
              <p className="leading-relaxed text-slate-200">{ins.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded border border-nexus-line/40 bg-black/20 p-2.5 text-xs text-nexus-muted">
          Select an entity or expand the focal graph to reveal cross-jurisdiction, continuity, and temporal insights.
        </div>
      )}
    </section>
  );
}

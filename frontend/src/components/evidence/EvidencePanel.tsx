import { cn, EVIDENCE_LABELS } from "@/lib/cn";
import { useInvestigationStore } from "@/store/investigationStore";
import type { EvidenceCategory } from "@/types/nexus";

const TONE: Record<EvidenceCategory, string> = {
  DIRECT: "text-emerald-300",
  CORROBORATED: "text-sky-300",
  INFERRED: "text-amber-300",
  UNVERIFIED: "text-nexus-muted",
};

export function EvidencePanel() {
  const evidence = useInvestigationStore((s) => s.evidence);
  if (!evidence || !evidence.items || evidence.items.length === 0) return null;

  const confDisplay =
    evidence.confidence != null
      ? Math.round(evidence.confidence > 1 ? evidence.confidence : evidence.confidence * 100)
      : null;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-semibold tracking-[0.15em] text-nexus-cyan uppercase">
          EVIDENCE ITEMS ({evidence.items.length})
        </span>
        {confDisplay != null && (
          <span className="font-mono text-[10px] text-emerald-400">
            {confDisplay}% {evidence.confidenceBand ? `· ${evidence.confidenceBand}` : ""}
          </span>
        )}
      </div>
      <div className="h-px bg-nexus-line/60" />

      <div className="space-y-2.5">
        {evidence.items.map((item) => (
          <div
            key={item.id}
            className="border-l-2 border-nexus-cyan/60 bg-white/[0.02] pl-2.5 py-1 text-xs space-y-1 transition-colors hover:bg-white/[0.04]"
          >
            <div className={cn("font-mono text-[10px] uppercase font-medium", TONE[item.category])}>
              {EVIDENCE_LABELS[item.category]}
            </div>
            <p className="leading-relaxed text-slate-200">{item.statement}</p>
            {item.sourceRecords.length > 0 && (
              <div className="font-mono text-[10px] text-nexus-muted">
                {item.sourceRecords.map((s) => s.label).join(" · ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

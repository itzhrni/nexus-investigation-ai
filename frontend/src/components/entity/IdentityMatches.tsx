import { useInvestigationStore } from "@/store/investigationStore";
import { cn, confidenceClass } from "@/lib/cn";

export function IdentityMatches() {
  const matches = useInvestigationStore((s) => s.identityMatches);
  const review = useInvestigationStore((s) => s.reviewMatch);
  if (matches.length === 0) return null;

  return (
    <section className="rounded-md border border-nexus-line bg-black/30 p-3">
      <div className="font-mono text-[10px] tracking-wide text-amber-300">POSSIBLE IDENTITY MATCH</div>
      <p className="mt-1 text-[11px] text-nexus-muted">Not a confirmed identity. Investigator review required.</p>
      <ul className="mt-3 space-y-3">
        {matches.map((m) => (
          <li key={m.id} className="border-t border-nexus-line/80 pt-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm">{m.displayName}</span>
              <span className={cn("font-mono text-xs", confidenceClass(m.confidence))}>{m.confidence}%</span>
            </div>
            <p className="mt-1 text-[11px] text-nexus-muted">{m.signals.map((s) => `✓ ${s}`).join(" · ")}</p>
            <div className="mt-2 flex gap-1">
              {(["confirmed", "rejected", "review"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => void review(m.id, status)}
                  className={cn(
                    "rounded px-2 py-0.5 text-[10px] uppercase",
                    m.status === status ? "bg-nexus-cyan/20 text-nexus-cyan" : "text-nexus-muted hover:text-nexus-text",
                  )}
                >
                  {status === "confirmed" ? "Confirm match" : status === "rejected" ? "Reject match" : "Review"}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

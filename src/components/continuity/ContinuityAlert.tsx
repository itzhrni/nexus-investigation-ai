import type { ContinuityAlert as Alert } from "@/types/nexus";

export function ContinuityAlert({ alert }: { alert: Alert }) {
  return (
    <section className="rounded-md border border-amber-500/25 bg-amber-500/5 p-3">
      <div className="font-mono text-[10px] tracking-wide text-amber-300">POTENTIAL IDENTIFIER CONTINUITY</div>
      <p className="mt-2 font-mono text-sm">
        {alert.fromLabel}
        <span className="mx-2 text-nexus-muted">↓</span>
        {alert.toLabel}
      </p>
      <ul className="mt-2 space-y-1 text-sm">
        {alert.evidence.map((s) => (
          <li key={s}>✓ {s}</li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-xs text-amber-200">Continuity confidence {alert.confidence}%</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-amber-300">{alert.status}</p>
      <p className="mt-2 text-[11px] text-nexus-muted">
        This does not establish that the later identifier belongs to the same person.
      </p>
    </section>
  );
}

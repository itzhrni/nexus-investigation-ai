import type { JurisdictionAlert as Alert } from "@/types/nexus";

export function JurisdictionAlert({ alert }: { alert: Alert }) {
  return (
    <section className="rounded-md border border-cyan-500/25 bg-cyan-500/5 p-3">
      <div className="font-mono text-[10px] tracking-wide text-nexus-cyan">CROSS-JURISDICTION LINK DETECTED</div>
      <p className="mt-2 text-sm">
        {alert.fromState} ↔ {alert.toState}
      </p>
      <p className="mt-1 text-sm text-nexus-muted">
        Shared entity: <span className="font-mono text-nexus-text">{alert.sharedEntityLabel}</span>
      </p>
      <ul className="mt-2 space-y-1 text-sm">
        {alert.supporting.map((s) => (
          <li key={s}>✓ {s}</li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-[11px] text-emerald-400">
        Evidence strength {alert.evidenceStrength} · Supporting records {alert.recordCount}
      </p>
    </section>
  );
}

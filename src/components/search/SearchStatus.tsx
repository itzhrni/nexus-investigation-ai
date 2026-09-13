import { useInvestigationStore } from "@/store/investigationStore";
import { ENTITY_LABELS } from "@/lib/cn";

export function SearchStatus() {
  const status = useInvestigationStore((s) => s.searchStatus);
  const phase = useInvestigationStore((s) => s.searchPhase);
  const error = useInvestigationStore((s) => s.searchError);
  const matches = useInvestigationStore((s) => s.matches);
  const selectMatch = useInvestigationStore((s) => s.selectMatch);

  if (status === "idle" || status === "found") return null;

  return (
    <div className="pointer-events-auto absolute inset-x-0 top-16 z-20 mx-auto w-[min(520px,calc(100%-2rem))] rounded-md border border-nexus-line bg-nexus-raised/95 p-4 shadow-xl">
      {status === "searching" && (
        <div>
          <div className="font-mono text-[11px] tracking-[0.2em] text-nexus-cyan">{phase ?? "RESOLVING CLUE"}</div>
          <div className="mt-2 h-px w-full overflow-hidden bg-nexus-line">
            <div className="h-full w-1/2 animate-pulse bg-nexus-cyan" />
          </div>
        </div>
      )}
      {status === "empty" && (
        <p className="text-sm text-nexus-muted">No matching entity for that clue. Try a registration, phone, name, or FIR id.</p>
      )}
      {status === "error" && <p className="text-sm text-red-400">{error ?? "Backend error"}</p>}
      {status === "multiple" && (
        <div className="space-y-2">
          <div className="font-mono text-[11px] text-nexus-cyan">MULTIPLE MATCHES</div>
          {matches.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => void selectMatch(m.id)}
              className="flex w-full items-center justify-between rounded border border-nexus-line px-3 py-2 text-left hover:border-nexus-cyan/40"
            >
              <span>
                <span className="block text-sm">{m.label}</span>
                <span className="text-[11px] text-nexus-muted">{ENTITY_LABELS[m.type]} · {m.id}</span>
              </span>
              {m.confidence != null && <span className="font-mono text-xs text-nexus-cyan">{m.confidence}%</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { useInvestigationStore } from "@/store/investigationStore";

export function Topbar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const query = useInvestigationStore((s) => s.searchQuery);
  const setQuery = useInvestigationStore((s) => s.setSearchQuery);
  const runSearch = useInvestigationStore((s) => s.runSearch);
  const investigation = useInvestigationStore((s) => s.investigation);
  const status = useInvestigationStore((s) => s.systemStatus);
  const focus = useInvestigationStore((s) => s.workspaceFocus);

  useEffect(() => {
    if (focus === "search") inputRef.current?.focus();
  }, [focus]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-nexus-line bg-nexus-raised/80 px-4 backdrop-blur-md">
      <form
        className="flex min-w-0 flex-1 items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void runSearch();
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-nexus-line bg-black/40 px-3 py-2 focus-within:border-nexus-cyan/50">
          <Search className="h-4 w-4 shrink-0 text-nexus-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search person, phone, vehicle, case, location…"
            className="min-w-0 flex-1 bg-transparent text-sm text-nexus-text outline-none placeholder:text-nexus-muted"
            aria-label="Any clue search"
          />
          <span className="hidden font-mono text-[10px] text-nexus-muted sm:inline">ANY CLUE</span>
        </div>
        <button
          type="submit"
          className="rounded-md bg-nexus-cyan/15 px-3 py-2 text-xs font-medium tracking-wide text-nexus-cyan ring-1 ring-nexus-cyan/40"
        >
          RESOLVE
        </button>
      </form>
      <div className="hidden items-center gap-4 md:flex">
        <div className="text-right">
          <div className="font-mono text-[10px] text-nexus-muted">INVESTIGATION</div>
          <div className="text-xs text-nexus-text">{investigation?.id ?? "—"}</div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              status === "ONLINE" ? "bg-emerald-400" : "bg-amber-400",
            )}
          />
          <span className="font-mono text-[10px] text-nexus-muted">{status}</span>
        </div>
        <div className="rounded-md border border-nexus-line px-2 py-1">
          <div className="font-mono text-[10px] text-nexus-muted">INVESTIGATOR</div>
          <div className="text-xs">Ops / Demo</div>
        </div>
      </div>
    </header>
  );
}

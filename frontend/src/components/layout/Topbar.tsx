import { useEffect, useRef, useState } from "react";
import { ChevronDown, FileText, FolderKanban, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { useInvestigationStore } from "@/store/investigationStore";

export function Topbar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const query = useInvestigationStore((s) => s.searchQuery);
  const setQuery = useInvestigationStore((s) => s.setSearchQuery);
  const runSearch = useInvestigationStore((s) => s.runSearch);
  const investigation = useInvestigationStore((s) => s.investigation);
  const activeCaseId = useInvestigationStore((s) => s.activeCaseId);
  const availableCases = useInvestigationStore((s) => s.availableCases);
  const switchCase = useInvestigationStore((s) => s.switchCase);
  const status = useInvestigationStore((s) => s.systemStatus);
  const focus = useInvestigationStore((s) => s.workspaceFocus);

  useEffect(() => {
    if (focus === "search") inputRef.current?.focus();
  }, [focus]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCase = async (caseId: string) => {
    setDropdownOpen(false);
    await switchCase(caseId);
  };

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center gap-4 border-b border-nexus-line bg-nexus-raised/90 px-4 backdrop-blur-md">
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
            placeholder="Search person, phone, vehicle, account, case, location…"
            className="min-w-0 flex-1 bg-transparent text-sm text-nexus-text outline-none placeholder:text-nexus-muted"
            aria-label="Any clue search"
          />
          <span className="hidden font-mono text-[10px] text-nexus-muted sm:inline">ANY CLUE</span>
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-md bg-nexus-cyan/15 px-3 py-2 text-xs font-medium tracking-wide text-nexus-cyan ring-1 ring-nexus-cyan/40 hover:bg-nexus-cyan/25 transition-colors"
        >
          RESOLVE
        </button>
      </form>

      {/* Right Topbar Navigation & Interactive Case Switcher */}
      <div className="flex shrink-0 items-center gap-4">
        {/* Interactive Case Switcher Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-md border border-nexus-line/80 bg-black/50 px-3 py-1.5 text-left transition-colors hover:border-nexus-cyan/50 hover:bg-nexus-panel/70"
            title="Switch Active Case / FIR"
            aria-expanded={dropdownOpen}
          >
            <FolderKanban className="h-4 w-4 text-nexus-cyan shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-nexus-cyan">CASE</span>
                <span className="font-mono text-[11px] font-bold text-nexus-text">
                  {investigation?.id || activeCaseId || "CASE-142"}
                </span>
              </div>
              <div className="max-w-[130px] truncate text-[10px] text-nexus-muted">
                {investigation?.label?.split("·")[1]?.trim() || investigation?.crimeType || "Active FIR"}
              </div>
            </div>
            <ChevronDown className={cn("h-3.5 w-3.5 text-nexus-muted transition-transform duration-200", dropdownOpen && "rotate-180 text-nexus-cyan")} />
          </button>

          {/* Floating Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-nexus-line bg-nexus-raised shadow-2xl p-2 space-y-1 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-2 py-1.5 border-b border-nexus-line/60 flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold tracking-wider text-nexus-muted uppercase">
                  SWITCH ACTIVE CASE ({availableCases.length})
                </span>
                <span className="font-mono text-[9px] text-nexus-cyan">NEXUS DB</span>
              </div>
              <div className="max-h-80 overflow-y-auto space-y-1 py-1">
                {availableCases.map((c) => {
                  const isActive = c.id === (investigation?.id || activeCaseId);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => void handleSelectCase(c.id)}
                      className={cn(
                        "w-full rounded p-2 text-left transition-colors flex items-start gap-2.5",
                        isActive
                          ? "bg-nexus-cyan/15 border border-nexus-cyan/40 text-nexus-text"
                          : "hover:bg-white/[0.04] text-slate-300 border border-transparent"
                      )}
                    >
                      <FileText className={cn("h-4 w-4 mt-0.5 shrink-0", isActive ? "text-nexus-cyan" : "text-nexus-muted")} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-nexus-text">{c.id}</span>
                          {isActive && (
                            <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 font-mono text-[9px] text-emerald-400 font-semibold border border-emerald-500/30">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-medium text-slate-200 truncate">{c.label}</div>
                        <div className="font-mono text-[10px] text-nexus-muted truncate mt-0.5">
                          {c.policeStation} · {c.state}
                        </div>
                        {c.crimeType && (
                          <div className="font-mono text-[9px] text-amber-300/80 truncate mt-0.5">
                            {c.crimeType}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* System Online Status */}
        <div className="hidden items-center gap-2 sm:flex">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              status === "ONLINE" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-amber-400",
            )}
          />
          <span className="font-mono text-[10px] text-nexus-muted">{status}</span>
        </div>

        {/* Investigator Profile */}
        <div className="hidden rounded-md border border-nexus-line bg-black/30 px-2.5 py-1 md:block">
          <div className="font-mono text-[9px] text-nexus-muted uppercase">INVESTIGATOR</div>
          <div className="text-xs font-medium text-slate-200">Ops / Demo</div>
        </div>
      </div>
    </header>
  );
}

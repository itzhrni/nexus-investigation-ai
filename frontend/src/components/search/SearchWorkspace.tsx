import { useState, useRef, useEffect } from "react";
import {
  Search,
  User,
  Phone,
  Car,
  CreditCard,
  MapPin,
  FileText,
  Radio,
  Cpu,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn, ENTITY_LABELS } from "@/lib/cn";
import { useInvestigationStore } from "@/store/investigationStore";
import type { SearchType, EntityType, Entity } from "@/types/nexus";

const TYPES: { id: SearchType; label: string; icon: typeof User }[] = [
  { id: "auto", label: "Auto Detect", icon: Sparkles },
  { id: "person", label: "Person", icon: User },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "vehicle", label: "Vehicle", icon: Car },
  { id: "sim", label: "SIM Card", icon: Radio },
  { id: "account", label: "Bank Account", icon: CreditCard },
  { id: "location", label: "Location", icon: MapPin },
  { id: "case", label: "Case / FIR", icon: FileText },
];

function getEntityIcon(type: EntityType) {
  switch (type) {
    case "person":
      return User;
    case "phone":
      return Phone;
    case "vehicle":
      return Car;
    case "account":
      return CreditCard;
    case "location":
      return MapPin;
    case "case":
      return FileText;
    case "sim":
      return Radio;
    case "device":
      return Cpu;
    default:
      return ShieldAlert;
  }
}

export function SearchWorkspace() {
  const query = useInvestigationStore((s) => s.searchQuery);
  const setQuery = useInvestigationStore((s) => s.setSearchQuery);
  const searchType = useInvestigationStore((s) => s.searchType);
  const setType = useInvestigationStore((s) => s.setSearchType);
  const status = useInvestigationStore((s) => s.searchStatus);
  const phase = useInvestigationStore((s) => s.searchPhase);
  const error = useInvestigationStore((s) => s.searchError);
  const matches = useInvestigationStore((s) => s.matches);
  const runSearch = useInvestigationStore((s) => s.runSearch);
  const selectMatch = useInvestigationStore((s) => s.selectMatch);
  const setWorkspaceFocus = useInvestigationStore((s) => s.setWorkspaceFocus);

  const [inputVal, setInputVal] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setInputVal(query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setQuery(inputVal.trim());
    void runSearch(inputVal.trim());
  };

  const handleTypeChange = (typeId: SearchType) => {
    setType(typeId);
    if (inputVal.trim()) {
      void runSearch(inputVal.trim());
    }
  };

  const handleSelectEntity = async (entity: Entity) => {
    await selectMatch(entity.id);
    setWorkspaceFocus("investigation");
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-nexus-bg p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1 border-b border-nexus-line pb-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-nexus-cyan uppercase">
          <span>ANY-CLUE SEARCH & ENTITY RESOLUTION</span>
          <span className="h-1 w-1 rounded-full bg-nexus-cyan/40" />
          <span className="text-nexus-muted">HETEROGENEOUS INTELLIGENCE RETRIEVAL</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-nexus-text">
          Entity Search & Resolution
        </h1>
        <p className="max-w-2xl text-xs text-nexus-muted">
          Resolve names, phone numbers, vehicle registrations, bank accounts, SIM cards, or FIR identifiers
          against multi-source law enforcement records.
        </p>
      </div>

      {/* Main Search Box */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
        <div className="relative flex items-center rounded-lg border border-nexus-line bg-nexus-raised/95 shadow-lg transition-colors focus-within:border-nexus-cyan/60">
          <Search className="ml-4 h-5 w-5 text-nexus-muted" />
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search by Person name, Phone (+91...), Vehicle (TN38...), FIR (#142), Account..."
            className="w-full bg-transparent px-4 py-3.5 text-sm text-nexus-text outline-none placeholder:text-nexus-muted"
          />
          <button
            type="submit"
            disabled={status === "searching" || !inputVal.trim()}
            className="mr-2 flex items-center gap-2 rounded-md bg-nexus-cyan/15 px-4 py-2 font-mono text-xs font-semibold tracking-wider text-nexus-cyan ring-1 ring-nexus-cyan/40 transition-all hover:bg-nexus-cyan/25 hover:ring-nexus-cyan/60 disabled:opacity-40"
          >
            {status === "searching" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>RESOLVING...</span>
              </>
            ) : (
              <>
                <span>RESOLVE</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Entity Type Selector Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-2 font-mono text-[10px] tracking-wider text-nexus-muted uppercase">
            ENTITY TYPE:
          </span>
          {TYPES.map((t) => {
            const Icon = t.icon;
            const active = searchType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTypeChange(t.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs transition-all cursor-pointer",
                  active
                    ? "border-nexus-cyan/50 bg-nexus-cyan/15 text-nexus-cyan shadow-[0_0_10px_rgba(61,214,245,0.15)]"
                    : "border-nexus-line bg-black/30 text-nexus-muted hover:border-nexus-line/80 hover:text-nexus-text",
                )}
              >
                <Icon className={cn("h-3 w-3", active ? "text-nexus-cyan" : "text-nexus-muted")} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </form>

      {/* Search Phase Progress Bar */}
      {status === "searching" && (
        <div className="mb-6 rounded-md border border-nexus-cyan/30 bg-nexus-cyan/[0.04] p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold tracking-wider text-nexus-cyan">
              {phase ?? "RESOLVING CLUE..."}
            </span>
            <Loader2 className="h-4 w-4 animate-spin text-nexus-cyan" />
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-nexus-line/50">
            <div className="h-full w-2/3 animate-pulse bg-nexus-cyan" />
          </div>
        </div>
      )}

      {/* Error Message */}
      {status === "error" && (
        <div className="mb-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-300">
          <span className="font-mono font-semibold text-red-200 uppercase">Search Error: </span>
          {error ?? "Failed to query backend records. Please verify database connectivity."}
        </div>
      )}

      {/* Empty State */}
      {status === "empty" && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-nexus-line bg-black/20 py-16 text-center">
          <Search className="mb-3 h-8 w-8 text-nexus-muted/60" />
          <h3 className="text-sm font-semibold text-nexus-text">No Matching Entities Found</h3>
          <p className="mt-1 max-w-md text-xs text-nexus-muted">
            No records matched query "{query}". Try a registration number, partial phone, FIR ID, or switch the
            entity type filter to "Auto Detect".
          </p>
        </div>
      )}

      {/* Search Results */}
      {matches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-nexus-line/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-nexus-cyan uppercase">
                SEARCH RESULTS
              </span>
              <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-nexus-muted">
                {matches.length} {matches.length === 1 ? "match" : "matches"}
              </span>
            </div>
            <span className="font-mono text-[10px] text-nexus-muted">
              Click any record to launch Investigation Graph
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((entity) => {
              const Icon = getEntityIcon(entity.type);
              const confDisplay =
                entity.confidence != null
                  ? Math.round(entity.confidence > 1 ? entity.confidence : entity.confidence * 100)
                  : null;

              const jurisdiction = entity.jurisdictions?.[0];

              return (
                <div
                  key={entity.id}
                  onClick={() => void handleSelectEntity(entity)}
                  className="group relative flex cursor-pointer flex-col justify-between rounded-md border border-nexus-line bg-nexus-raised/90 p-4 transition-all hover:border-nexus-cyan/60 hover:bg-nexus-panel/70 hover:shadow-lg"
                >
                  <div>
                    {/* Top Row: Type badge & Confidence */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded border border-nexus-line bg-black/40 px-2 py-0.5 font-mono text-[10px] font-medium text-nexus-cyan uppercase">
                        <Icon className="h-3 w-3 text-nexus-cyan" />
                        {ENTITY_LABELS[entity.type] || entity.type}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {entity.matchType && (
                          <span className="rounded border border-nexus-cyan/20 bg-nexus-cyan/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-nexus-cyan uppercase">
                            {entity.matchType}
                          </span>
                        )}
                        {confDisplay != null && (
                          <span className="font-mono text-[10px] font-semibold text-emerald-400">
                            {confDisplay}% Match
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Entity Label & ID */}
                    <h2 className="mt-2.5 text-sm font-semibold tracking-tight text-nexus-text group-hover:text-nexus-cyan">
                      {entity.label}
                    </h2>
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-nexus-muted">
                      <span>ID: {entity.id}</span>
                      {entity.carrier && (
                        <span className="rounded bg-sky-500/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-sky-300">
                          {entity.carrier}
                        </span>
                      )}
                    </div>

                    {/* Registered Name (for Phone / Account / Vehicle) */}
                    {entity.registeredName && (
                      <div className="mt-1.5 text-xs text-slate-300">
                        <span className="text-[10px] uppercase text-nexus-muted">Registered to: </span>
                        <span className="font-medium text-nexus-text">{entity.registeredName}</span>
                      </div>
                    )}

                    {/* Bank Account Specifics */}
                    {entity.type === "account" && (entity.bankName || entity.accountNumber) && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-300">
                        {entity.bankName && <span className="text-nexus-cyan">{entity.bankName}</span>}
                        {entity.accountNumber && <span>A/C: {entity.accountNumber}</span>}
                        {entity.ifsc && <span className="text-nexus-muted">IFSC: {entity.ifsc}</span>}
                      </div>
                    )}

                    {/* Aliases */}
                    {entity.aliases && entity.aliases.length > 0 && (
                      <div className="mt-2 text-xs text-nexus-muted">
                        <span className="text-[10px] uppercase text-nexus-muted/80">Aliases: </span>
                        <span className="text-slate-300">{entity.aliases.join(", ")}</span>
                      </div>
                    )}

                    {/* Jurisdiction / Location info */}
                    {(jurisdiction || entity.state) && (
                      <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                        <MapPin className="h-3 w-3 shrink-0 text-nexus-cyan/70" />
                        <span className="truncate">
                          {jurisdiction?.policeStation ? `${jurisdiction.policeStation} · ` : ""}
                          {jurisdiction?.district ? `${jurisdiction.district}, ` : entity.district ? `${entity.district}, ` : ""}
                          {jurisdiction?.state || entity.state || "Jurisdiction on record"}
                        </span>
                      </div>
                    )}

                    {/* Summary */}
                    {entity.summary && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-nexus-muted">
                        {entity.summary}
                      </p>
                    )}
                  </div>

                  {/* Action Link at Bottom */}
                  <div className="mt-4 flex items-center justify-between border-t border-nexus-line/40 pt-2.5 text-xs text-nexus-cyan group-hover:text-nexus-cyan">
                    <span className="font-mono text-[10px] tracking-wider uppercase">
                      Open in Graph
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Initial Idle Helper when no query has been run yet */}
      {status === "idle" && matches.length === 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-nexus-line bg-black/20 p-4">
            <div className="font-mono text-xs font-semibold text-nexus-cyan">PERSON IDENTIFIER</div>
            <p className="mt-1 text-xs text-nexus-muted">
              Enter target suspect names or national IDs (e.g. Suresh, P001, Ravi Kumar) to trace associations across all registered FIRs.
            </p>
          </div>
          <div className="rounded-lg border border-nexus-line bg-black/20 p-4">
            <div className="font-mono text-xs font-semibold text-nexus-cyan">COMMUNICATION & VEHICLE</div>
            <p className="mt-1 text-xs text-nexus-muted">
              Search mobile numbers (+91 98765...), SIM card IMSIs, or vehicle registration plates (TN38AB1234) to isolate checkpoints.
            </p>
          </div>
          <div className="rounded-lg border border-nexus-line bg-black/20 p-4">
            <div className="font-mono text-xs font-semibold text-nexus-cyan">LEGAL & JURISDICTION</div>
            <p className="mt-1 text-xs text-nexus-muted">
              Query FIR numbers (Case #142, FIR-217) or police station names to trace multi-jurisdictional crime rings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

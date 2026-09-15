import { Filter, X, Calendar, Layers, ShieldAlert, Sparkles, MapPin } from "lucide-react";
import type { AnalyticsFilterState } from "@/types/nexus";

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilterState;
  onFilterChange: (filters: AnalyticsFilterState) => void;
  availableCommunities: string[];
  availableEntityTypes: string[];
  availableStates: string[];
  availablePatternTypes: string[];
}

export function AnalyticsFilterBar({
  filters,
  onFilterChange,
  availableCommunities,
  availableEntityTypes,
  availableStates,
  availablePatternTypes,
}: AnalyticsFilterBarProps) {
  const activeCount = Object.values(filters).filter((v) => v && v !== "ALL").length;

  const handleUpdate = (key: keyof AnalyticsFilterState, value?: string) => {
    const next = { ...filters };
    if (!value || value === "ALL") {
      delete next[key];
    } else {
      next[key] = value;
    }
    onFilterChange(next);
  };

  const handleClear = () => {
    onFilterChange({});
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#26303C] bg-[#10151D] px-4 py-2 font-mono text-xs shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 font-bold text-[#4F8EF7] uppercase tracking-wider text-[11px]">
          <Filter className="h-3.5 w-3.5 text-[#4F8EF7]" />
          <span>ANALYTICS FILTERS</span>
          {activeCount > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#4F8EF7] px-1 text-[9px] font-bold text-slate-950">
              {activeCount}
            </span>
          )}
        </div>

        <div className="h-4 w-[1px] bg-[#26303C] hidden sm:block" />

        {/* Date Range Quick Picker */}
        <div className="flex items-center gap-1 text-[11px]">
          <Calendar className="h-3 w-3 text-slate-500" />
          <input
            type="date"
            value={filters.timeFrom || ""}
            onChange={(e) => handleUpdate("timeFrom", e.target.value)}
            className="rounded border border-[#26303C] bg-[#090D12] px-2 py-0.5 text-[10px] text-slate-300 focus:border-[#5B7FA8] focus:outline-none"
          />
          <span className="text-slate-500">to</span>
          <input
            type="date"
            value={filters.timeTo || ""}
            onChange={(e) => handleUpdate("timeTo", e.target.value)}
            className="rounded border border-[#26303C] bg-[#090D12] px-2 py-0.5 text-[10px] text-slate-300 focus:border-[#5B7FA8] focus:outline-none"
          />
        </div>

        {/* Community Filter */}
        {availableCommunities.length > 0 && (
          <div className="flex items-center gap-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <select
              value={filters.communityId || "ALL"}
              onChange={(e) => handleUpdate("communityId", e.target.value)}
              className="rounded border border-[#26303C] bg-[#090D12] px-2 py-0.5 text-[10px] text-slate-300 focus:border-[#5B7FA8] focus:outline-none uppercase"
            >
              <option value="ALL">All Communities</option>
              {availableCommunities.map((cid) => (
                <option key={cid} value={cid}>
                  Community {cid}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Entity Type Filter */}
        {availableEntityTypes.length > 0 && (
          <select
            value={filters.entityType || "ALL"}
            onChange={(e) => handleUpdate("entityType", e.target.value)}
            className="rounded border border-[#26303C] bg-[#090D12] px-2 py-0.5 text-[10px] text-slate-300 focus:border-[#5B7FA8] focus:outline-none uppercase"
          >
            <option value="ALL">All Entity Types</option>
            {availableEntityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}

        {/* Severity Filter */}
        <div className="flex items-center gap-1">
          <ShieldAlert className="h-3 w-3 text-slate-500" />
          <select
            value={filters.severity || "ALL"}
            onChange={(e) => handleUpdate("severity", e.target.value)}
            className="rounded border border-[#26303C] bg-[#090D12] px-2 py-0.5 text-[10px] text-slate-300 focus:border-[#5B7FA8] focus:outline-none uppercase"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Pattern Type Filter */}
        {availablePatternTypes.length > 0 && (
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-slate-500" />
            <select
              value={filters.patternType || "ALL"}
              onChange={(e) => handleUpdate("patternType", e.target.value)}
              className="rounded border border-[#26303C] bg-[#090D12] px-2 py-0.5 text-[10px] text-slate-300 focus:border-[#5B7FA8] focus:outline-none uppercase"
            >
              <option value="ALL">All Pattern Types</option>
              {availablePatternTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {pt.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* State / Jurisdiction Filter */}
        {availableStates.length > 0 && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-500" />
            <select
              value={filters.state || "ALL"}
              onChange={(e) => handleUpdate("state", e.target.value)}
              className="rounded border border-[#26303C] bg-[#090D12] px-2 py-0.5 text-[10px] text-slate-300 focus:border-[#5B7FA8] focus:outline-none uppercase"
            >
              <option value="ALL">All States</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1 rounded border border-[#26303C] bg-[#1A232E] px-2.5 py-1 text-[10px] font-semibold text-slate-300 hover:bg-[#26303C] transition-colors uppercase"
        >
          <X className="h-3 w-3" />
          <span>Clear Filters ({activeCount})</span>
        </button>
      )}
    </div>
  );
}

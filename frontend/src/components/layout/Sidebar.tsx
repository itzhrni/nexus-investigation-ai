import {
  BarChart3,
  FileText,
  Fingerprint,
  FolderSearch,
  GitBranch,
  MapPinned,
  Search,
  Settings,
  Shield,
  Timer,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useInvestigationStore } from "@/store/investigationStore";
import type { WorkspaceFocus } from "@/types/nexus";

const ITEMS: { id: WorkspaceFocus; label: string; icon: typeof Search }[] = [
  { id: "investigation", label: "Investigation", icon: Shield },
  { id: "search", label: "Search", icon: Search },
  { id: "cases", label: "Cases", icon: FolderSearch },
  { id: "timeline", label: "Timeline", icon: Timer },
  { id: "map", label: "Map", icon: MapPinned },
  { id: "evidence", label: "Evidence", icon: GitBranch },
  { id: "ingestion", label: "Ingestion", icon: Upload },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "reports", label: "Report Center", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const focus = useInvestigationStore((s) => s.workspaceFocus);
  const setFocus = useInvestigationStore((s) => s.setWorkspaceFocus);

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-nexus-line bg-nexus-raised/90">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-nexus-cyan/40 bg-nexus-cyan/10">
          <Fingerprint className="h-5 w-5 text-nexus-cyan" />
        </div>
        <div>
          <div className="text-[11px] tracking-[0.22em] text-nexus-muted">SIH26189</div>
          <div className="text-lg font-semibold tracking-[0.18em] text-nexus-text">NEXUS</div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = focus === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFocus(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-all",
                active
                  ? "border-l-2 border-nexus-cyan bg-nexus-cyan/15 font-semibold text-nexus-cyan shadow-[0_0_12px_rgba(61,214,245,0.12)]"
                  : "border-l-2 border-transparent text-nexus-muted hover:bg-white/5 hover:text-nexus-text",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-nexus-cyan" : "text-nexus-muted")} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-4">
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] tracking-wide text-amber-200">
          DEMO / SYNTHETIC DATA
        </div>
      </div>
    </aside>
  );
}

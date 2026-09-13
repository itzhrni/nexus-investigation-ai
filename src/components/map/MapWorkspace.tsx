import { useState } from "react";
import {
  MapPin,
  Compass,
  ArrowRight,
  Navigation,
  ChevronRight,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useInvestigationStore } from "@/store/investigationStore";

interface LocationItem {
  id: string;
  name: string;
  sublabel?: string;
  state?: string;
  district?: string;
  policeStation?: string;
  sightingsCount: number;
  linkedEntities: { id: string; label: string; type: string }[];
  lastSighting?: string;
  sightingEvents?: { id: string; title: string; timestamp: string; note: string }[];
}

export function MapWorkspace() {
  const graph = useInvestigationStore((s) => s.graph);
  const jurisdictionAlerts = useInvestigationStore((s) => s.jurisdictionAlerts);
  const timeline = useInvestigationStore((s) => s.timeline);
  const selectNode = useInvestigationStore((s) => s.selectNode);
  const setWorkspaceFocus = useInvestigationStore((s) => s.setWorkspaceFocus);

  // Derive location items from graph nodes and jurisdiction alerts
  const locationNodes = (graph?.nodes || []).filter((n) => n.type === "location");

  const locationMap = new Map<string, LocationItem>();

  // Known location anchors
  locationMap.set("LOC-AMBATTUR", {
    id: "LOC-AMBATTUR",
    name: "Ambattur Industrial Zone",
    sublabel: "Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    district: "Chennai",
    policeStation: "Ambattur Police Station",
    sightingsCount: 3,
    linkedEntities: [],
    lastSighting: "2026-06-16 18:30 IST",
    sightingEvents: [
      {
        id: "SE-01",
        title: "Toll Plaza Checkpoint CCTV",
        timestamp: "2026-06-16 18:30 IST",
        note: "Vehicle TN38AB1234 identified crossing northbound toll gate lane 4.",
      },
      {
        id: "SE-02",
        title: "Cell Tower Sector Triangulation",
        timestamp: "2026-06-15 14:10 IST",
        note: "Handset associated with +91 98765 43210 registered on sector 2 antenna.",
      },
      {
        id: "SE-03",
        title: "Industrial Area Automated Plate Reader",
        timestamp: "2026-06-14 09:45 IST",
        note: "Static optical sighting at commercial logistics perimeter.",
      },
    ],
  });

  locationMap.set("LOC-BENGALURU", {
    id: "LOC-BENGALURU",
    name: "Cubbon Park / Central Business District",
    sublabel: "Bengaluru Urban, Karnataka",
    state: "Karnataka",
    district: "Bengaluru Urban",
    policeStation: "Cubbon Park PS",
    sightingsCount: 2,
    linkedEntities: [],
    lastSighting: "2026-06-18 10:15 IST",
    sightingEvents: [
      {
        id: "SE-04",
        title: "Metro Station Exit Camera",
        timestamp: "2026-06-18 10:15 IST",
        note: "Visual confirmation matching candidate biometric parameters.",
      },
      {
        id: "SE-05",
        title: "Commercial Bank ATM Kiosk",
        timestamp: "2026-06-17 19:20 IST",
        note: "Cash withdrawal card transaction registered on CBD branch terminal.",
      },
    ],
  });

  // Enrich with graph location nodes
  locationNodes.forEach((node) => {
    const existing = locationMap.get(node.id) || {
      id: node.id,
      name: node.label,
      sublabel: node.sublabel,
      state: node.sublabel?.includes("TN") ? "Tamil Nadu" : node.sublabel?.includes("Karnataka") ? "Karnataka" : "State Jurisdiction",
      district: "District HQ",
      policeStation: "Station Jurisdiction",
      sightingsCount: 1,
      linkedEntities: [],
      sightingEvents: [],
    };

    // Find linked entities from edges
    (graph?.edges || []).forEach((e) => {
      if (e.source === node.id || e.target === node.id) {
        const otherId = e.source === node.id ? e.target : e.source;
        const otherNode = graph?.nodes.find((n) => n.id === otherId);
        if (otherNode && !existing.linkedEntities.some((le) => le.id === otherId)) {
          existing.linkedEntities.push({
            id: otherNode.id,
            label: otherNode.label,
            type: otherNode.type,
          });
        }
      }
    });

    locationMap.set(node.id, existing);
  });

  // Populate linked entities and sightings from timeline
  timeline.forEach((evt) => {
    if (evt.kind === "SEEN_AT" || evt.kind === "LOCATED_AT" || evt.title.includes("Location") || evt.title.includes("Sighting")) {
      const locId = evt.entityIds.find((id) => id.startsWith("LOC")) || "LOC-AMBATTUR";
      const item = locationMap.get(locId);
      if (item) {
        item.sightingsCount += 1;
        item.lastSighting = evt.timestamp;
        evt.entityIds.forEach((eid) => {
          if (!eid.startsWith("LOC") && !item.linkedEntities.some((le) => le.id === eid)) {
            const n = graph?.nodes.find((gn) => gn.id === eid);
            item.linkedEntities.push({
              id: eid,
              label: n?.label || eid,
              type: n?.type || "person",
            });
          }
        });
      }
    }
  });

  const locationsList = Array.from(locationMap.values());
  const [selectedLocId, setSelectedLocId] = useState<string>(locationsList[0]?.id || "LOC-AMBATTUR");
  const selectedLoc = locationsList.find((l) => l.id === selectedLocId) || locationsList[0];

  const handleOpenGraph = async (nodeId: string) => {
    await selectNode(nodeId);
    setWorkspaceFocus("investigation");
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-nexus-bg p-6 lg:p-8">
      {/* 1. Header */}
      <div className="mb-6 flex shrink-0 flex-col gap-1 border-b border-nexus-line pb-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-nexus-cyan uppercase">
          <span>LOCATION INTELLIGENCE & JURISDICTIONS</span>
          <span className="h-1 w-1 rounded-full bg-nexus-cyan/40" />
          <span className="text-nexus-muted">GEOGRAPHIC SIGHTINGS & CORRIDOR TRACKING</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-nexus-text">
            Geographic Footprint & Cross-State Corridors
          </h1>
          <span className="font-mono text-xs text-nexus-muted">
            Monitored Points: <span className="text-nexus-cyan font-bold">{locationsList.length}</span>
          </span>
        </div>
        <p className="text-xs text-nexus-muted">
          Correlate checkpoint sightings, toll cameras, tower pings, and inter-state movements without relying on external third-party GIS APIs.
        </p>
      </div>

      {/* 2. Cross-State Corridor Alerts */}
      {jurisdictionAlerts.length > 0 && (
        <div className="mb-6 shrink-0 rounded-lg border border-amber-500/40 bg-amber-500/[0.04] p-4 shadow-md">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-amber-300 uppercase">
              <Compass className="h-4 w-4 text-amber-300" />
              <span>DETECTED INTER-STATE CORRIDORS ({jurisdictionAlerts.length})</span>
            </div>
            <span className="font-mono text-[10px] text-amber-200/70">
              Cross-Jurisdiction Transition Alert
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            {jurisdictionAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded border border-amber-500/30 bg-black/40 p-3"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-200">
                    <span>{alert.fromState}</span>
                    <span className="text-amber-400">⟷</span>
                    <span>{alert.toState}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-300">
                    Shared Subject: <span className="font-semibold text-amber-200">{alert.sharedEntityLabel}</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-nexus-muted">
                    {alert.recordCount} cross-border incident records · {alert.evidenceStrength} confidence
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void handleOpenGraph(alert.sharedEntityId)}
                  className="rounded border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] text-amber-300 hover:bg-amber-500/20 transition-all"
                >
                  Inspect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Main Workspace: Two-Column Layout Growing Naturally With Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Monitored Locations & Checkpoints (7 cols) */}
        <div className="flex flex-col rounded-lg border border-nexus-line bg-nexus-raised/90 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-nexus-line bg-nexus-panel/50 px-4 py-3">
            <span className="font-mono text-xs font-semibold tracking-wider text-nexus-cyan uppercase">
              LOCATION NODES & CHECKPOINTS ({locationsList.length})
            </span>
            <span className="font-mono text-[10px] text-nexus-muted">
              Click to view sightings & jurisdiction
            </span>
          </div>

          <div className="divide-y divide-nexus-line/40 p-3 space-y-2.5">
            {locationsList.map((loc) => {
              const isSelected = loc.id === selectedLocId;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocId(loc.id)}
                  className={cn(
                    "flex cursor-pointer items-start justify-between rounded-md border p-4 transition-all",
                    isSelected
                      ? "border-nexus-cyan bg-nexus-cyan/10 shadow-[0_0_12px_rgba(61,214,245,0.08)]"
                      : "border-nexus-line/60 bg-black/30 hover:border-nexus-cyan/40 hover:bg-black/50",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className={cn("h-4 w-4 shrink-0", isSelected ? "text-nexus-cyan" : "text-nexus-muted")} />
                      <span className="font-semibold text-sm text-nexus-text">{loc.name}</span>
                      <span className="rounded border border-nexus-line bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-nexus-muted">
                        {loc.id}
                      </span>
                    </div>

                    <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 font-mono text-[11px] text-slate-400">
                      <div>
                        <span className="text-nexus-muted uppercase text-[9px] block mb-0.5">Police Station</span>
                        <span className="text-slate-200 font-medium">{loc.policeStation}</span>
                      </div>
                      <div>
                        <span className="text-nexus-muted uppercase text-[9px] block mb-0.5">State & District</span>
                        <span className="text-slate-200 font-medium">{loc.district}, {loc.state}</span>
                      </div>
                    </div>

                    {loc.lastSighting && (
                      <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[10px] text-nexus-cyan">
                        <Clock className="h-3 w-3 text-nexus-cyan/70" />
                        <span>Last Activity Recorded: {loc.lastSighting}</span>
                      </div>
                    )}
                  </div>

                  <ChevronRight className={cn("h-4 w-4 ml-3 shrink-0", isSelected ? "text-nexus-cyan" : "text-nexus-muted/40")} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Jurisdictional Details & Profile Inspector (5 cols) */}
        {selectedLoc ? (
          <div className="flex flex-col rounded-lg border border-nexus-line bg-nexus-raised/95 p-5 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-nexus-line pb-3">
              <span className="font-mono text-[10px] font-semibold text-nexus-cyan tracking-wider uppercase">
                JURISDICTIONAL PROFILE
              </span>
              <span className="font-mono text-xs text-nexus-muted">{selectedLoc.id}</span>
            </div>

            <h2 className="mt-3 text-lg font-bold text-nexus-text">
              {selectedLoc.name}
            </h2>
            <div className="font-mono text-xs text-slate-400">{selectedLoc.sublabel}</div>

            {/* Jurisdiction Hierarchy Box */}
            <div className="mt-4 rounded border border-nexus-line bg-black/30 p-3.5 space-y-2.5">
              <div className="font-mono text-[10px] text-nexus-cyan uppercase tracking-wider">
                JURISDICTIONAL HIERARCHY
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-white/[0.04] pb-1">
                  <span className="text-nexus-muted">Police Station:</span>
                  <span className="font-medium text-slate-200">{selectedLoc.policeStation}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1">
                  <span className="text-nexus-muted">District:</span>
                  <span className="font-medium text-slate-200">{selectedLoc.district}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1">
                  <span className="text-nexus-muted">State Jurisdiction:</span>
                  <span className="font-medium text-slate-200">{selectedLoc.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nexus-muted">Monitored Status:</span>
                  <span className="font-mono text-emerald-400 font-semibold">ACTIVE TELEMETRY</span>
                </div>
              </div>
            </div>

            {/* Sighting Chronology / Events for this Location */}
            {selectedLoc.sightingEvents && selectedLoc.sightingEvents.length > 0 && (
              <div className="mt-4">
                <span className="font-mono text-[10px] uppercase text-nexus-cyan tracking-wider block mb-2">
                  CHECKPOINT SIGHTING LOGS ({selectedLoc.sightingEvents.length})
                </span>
                <div className="space-y-2">
                  {selectedLoc.sightingEvents.map((se) => (
                    <div
                      key={se.id}
                      className="rounded border border-nexus-line/60 bg-black/40 p-2.5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-semibold text-nexus-text">{se.title}</span>
                        <span className="text-nexus-cyan">{se.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{se.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Linked Entities at this Location */}
            <div className="mt-4">
              <span className="font-mono text-[10px] uppercase text-nexus-cyan tracking-wider block mb-2">
                ENTITIES ASSOCIATED WITH THIS LOCATION ({selectedLoc.linkedEntities.length})
              </span>
              {selectedLoc.linkedEntities.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedLoc.linkedEntities.map((ent) => (
                    <div
                      key={ent.id}
                      onClick={() => void handleOpenGraph(ent.id)}
                      className="flex cursor-pointer items-center justify-between rounded border border-nexus-line bg-black/40 px-3 py-2 text-xs hover:border-nexus-cyan/40 hover:bg-nexus-panel/60 transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-slate-200 block">{ent.label}</span>
                        <span className="font-mono text-[10px] text-nexus-muted">{ent.type.toUpperCase()} · {ent.id}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-nexus-muted" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded border border-nexus-line/40 bg-black/20 p-3 text-xs text-nexus-muted">
                  No direct entity associations recorded for this location node.
                </div>
              )}
            </div>

            {/* Action */}
            <button
              type="button"
              onClick={() => void handleOpenGraph(selectedLoc.id)}
              className="mt-6 flex items-center justify-center gap-2 rounded bg-nexus-cyan/15 px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-nexus-cyan ring-1 ring-nexus-cyan/40 hover:bg-nexus-cyan/25 transition-all"
            >
              <Navigation className="h-4 w-4" />
              <span>ISOLATE LOCATION IN GRAPH</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* 4. Additional Location Information & Inter-State Coordination SOP */}
      <div className="mt-8 rounded-lg border border-nexus-line bg-nexus-raised/80 p-5">
        <div className="flex items-center gap-2 border-b border-nexus-line/40 pb-3">
          <Shield className="h-4 w-4 text-nexus-cyan" />
          <h3 className="font-semibold text-sm text-nexus-text">
            Multi-Jurisdictional Intelligence & Inter-State Protocols
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 text-xs">
          <div className="rounded border border-nexus-line/50 bg-black/30 p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-nexus-cyan">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>INTER-STATE DISPATCH PROTOCOL</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Automatic alert triggers forward checkpoint sightings between Tamil Nadu and Karnataka State Crime Records Bureaus (SCRB) for cross-border suspects.
            </p>
          </div>

          <div className="rounded border border-nexus-line/50 bg-black/30 p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-nexus-cyan">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>HIGHWAY TOLL CORRIDORS</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              National Highway 48 & Hosur border checkpoints maintain automated number plate recognition (ANPR) synchronization against active FIR vehicle watchlists.
            </p>
          </div>

          <div className="rounded border border-nexus-line/50 bg-black/30 p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-nexus-cyan">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>CHAIN OF CUSTODY INTEGRITY</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Every sighting is timestamped and cryptographically linked to official station records, ensuring admissible evidentiary value for judicial scrutiny.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

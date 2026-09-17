import { useState, useMemo } from "react";
import {
  MapPin,
  Compass,
  ChevronRight,
  Clock,
  Radio,
  Globe2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useInvestigationStore } from "@/store/investigationStore";
import {
  IndiaMap,
  ALL_INDIA_MONITORED_POINTS,
  STATE_CENTROIDS,
} from "./IndiaMap";
import type { MapLocationPoint } from "./IndiaMap";

interface LocationItem extends MapLocationPoint {
  linkedEntities: { id: string; label: string; type: string }[];
  sightingEvents?: { id: string; title: string; timestamp: string; note: string }[];
}

export function MapWorkspace() {
  const graph = useInvestigationStore((s) => s.graph);
  const focalEntityId = useInvestigationStore((s) => s.focalEntityId);
  const selectedEntity = useInvestigationStore((s) => s.selectedEntity);
  const jurisdictionAlerts = useInvestigationStore((s) => s.jurisdictionAlerts);
  const timeline = useInvestigationStore((s) => s.timeline);
  const selectNode = useInvestigationStore((s) => s.selectNode);
  const setWorkspaceFocus = useInvestigationStore((s) => s.setWorkspaceFocus);

  const [showAllNational, setShowAllNational] = useState(false);

  // Derive location items strictly from graph nodes and enrich with geo-coordinates
  const locationsList = useMemo<LocationItem[]>(() => {
    if (!graph || !graph.nodes) return [];

    const locNodes = graph.nodes.filter(
      (n) => n.type === "location" || n.id.startsWith("LOC"),
    );

    const locationMap = new Map<string, LocationItem>();

    locNodes.forEach((node) => {
      const props = (node as any).properties || {};

      // Match with known Indian coordinates catalog or state centroids
      const catalogPoint = ALL_INDIA_MONITORED_POINTS.find(
        (p) =>
          p.id === node.id ||
          p.name.toLowerCase().includes(node.label.toLowerCase()) ||
          node.label.toLowerCase().includes(p.name.toLowerCase()),
      );

      const stateName =
        props.state ||
        (node.sublabel?.includes("TN") || node.label.includes("Chennai")
          ? "Tamil Nadu"
          : node.sublabel?.includes("Karnataka") || node.label.includes("Bengaluru")
          ? "Karnataka"
          : catalogPoint?.state || "Delhi");

      const stateCoord = STATE_CENTROIDS[stateName];

      const lat =
        Number(props.latitude) ||
        catalogPoint?.lat ||
        (stateCoord ? stateCoord[0] : 20.5937);

      const lng =
        Number(props.longitude) ||
        catalogPoint?.lng ||
        (stateCoord ? stateCoord[1] : 78.9629);

      // Connected entities from edges
      const linkedEntities: { id: string; label: string; type: string }[] = [];
      (graph.edges || []).forEach((e) => {
        if (e.source === node.id || e.target === node.id) {
          const otherId = e.source === node.id ? e.target : e.source;
          const otherNode = graph.nodes.find((n) => n.id === otherId);
          if (otherNode && !linkedEntities.some((le) => le.id === otherId)) {
            linkedEntities.push({
              id: otherNode.id,
              label: otherNode.label,
              type: otherNode.type,
            });
          }
        }
      });

      // Sighting events from incident edges
      const sightingEvents: { id: string; title: string; timestamp: string; note: string }[] = [];
      (graph.edges || []).forEach((e, idx) => {
        if (e.source === node.id || e.target === node.id) {
          sightingEvents.push({
            id: `SE-${e.id || idx}`,
            title: e.summary || `Sighting Event at ${node.label}`,
            timestamp: e.validFrom || "Recorded in dataset",
            note: e.summary || `Relational connection: ${e.type}`,
          });
        }
      });

      locationMap.set(node.id, {
        id: node.id,
        name: node.label,
        sublabel: node.sublabel,
        state: stateName,
        district: props.district || catalogPoint?.district || "District HQ",
        policeStation:
          props.police_station ||
          catalogPoint?.policeStation ||
          "Jurisdiction Police Station",
        lat,
        lng,
        sightingsCount: Math.max(1, sightingEvents.length),
        linkedEntities,
        lastSighting: sightingEvents[0]?.timestamp,
        sightingEvents,
        isFocal: true,
      });
    });

    // Also enrich from timeline events that reference locations
    timeline.forEach((evt) => {
      if (
        evt.kind === "SEEN_AT" ||
        evt.kind === "LOCATED_AT" ||
        evt.title.includes("Location") ||
        evt.title.includes("Sighting")
      ) {
        const locId = evt.entityIds.find((id) => id.startsWith("LOC"));
        if (locId && locationMap.has(locId)) {
          const item = locationMap.get(locId)!;
          item.sightingsCount += 1;
          item.lastSighting = evt.timestamp;
          evt.entityIds.forEach((eid) => {
            if (!eid.startsWith("LOC") && !item.linkedEntities.some((le) => le.id === eid)) {
              const n = graph.nodes.find((gn) => gn.id === eid);
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

    return Array.from(locationMap.values());
  }, [graph, timeline]);

  const [selectedLocId, setSelectedLocId] = useState<string | null>(null);

  // Active selected location item (or first in list, or first in national catalog if empty)
  const selectedLoc = useMemo(() => {
    if (selectedLocId) {
      const foundInCase = locationsList.find((l) => l.id === selectedLocId);
      if (foundInCase) return foundInCase;
      const foundInNational = ALL_INDIA_MONITORED_POINTS.find((l) => l.id === selectedLocId);
      if (foundInNational) {
        return {
          ...foundInNational,
          linkedEntities: [],
          sightingEvents: [],
        } as LocationItem;
      }
    }
    return locationsList[0] || (ALL_INDIA_MONITORED_POINTS[0] as unknown as LocationItem);
  }, [selectedLocId, locationsList]);

  const handleOpenGraph = async (nodeId: string) => {
    await selectNode(nodeId);
    setWorkspaceFocus("investigation");
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-nexus-bg p-6 lg:p-8 space-y-6">
      {/* 1. Header */}
      <div className="flex shrink-0 flex-col gap-1 border-b border-nexus-line pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-nexus-cyan uppercase">
            <span>BHARAT GEOSPATIAL INTELLIGENCE & JURISDICTIONS</span>
            <span className="h-1 w-1 rounded-full bg-nexus-cyan/40" />
            <span className="text-nexus-muted">ALL-INDIA TACTICAL MAPPING</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAllNational(!showAllNational)}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-3 py-1 font-mono text-xs transition-all",
                showAllNational
                  ? "border-nexus-cyan bg-nexus-cyan/20 text-nexus-cyan font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  : "border-nexus-line bg-black/40 text-slate-300 hover:text-white",
              )}
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>National Grid Overlay</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <h1 className="text-xl font-semibold tracking-tight text-nexus-text">
            Geographic Footprint & Inter-State Corridors
          </h1>
          <div className="flex items-center gap-3 font-mono text-xs text-nexus-muted">
            <span>
              Case Anchor Points:{" "}
              <span className="text-nexus-cyan font-bold">{locationsList.length}</span>
            </span>
            <span className="h-3 w-px bg-nexus-line" />
            <span>
              Subject:{" "}
              <span className="text-slate-200 font-semibold">
                {selectedEntity?.label || focalEntityId || "P001"}
              </span>
            </span>
          </div>
        </div>
        <p className="text-xs text-nexus-muted">
          Interactive tactical GIS visualization of Indian checkpoints, ANPR cameras, cell tower sectors, and inter-state syndicate transitions.
        </p>
      </div>

      {/* 2. Interactive Bharat Map Centerpiece */}
      <div className="shrink-0">
        <IndiaMap
          locations={locationsList}
          selectedLocId={selectedLoc?.id || selectedLocId}
          onSelectLocation={(id) => setSelectedLocId(id)}
          jurisdictionAlerts={jurisdictionAlerts}
          showAllNational={showAllNational}
        />
      </div>

      {/* 3. Inter-State Corridor Alerts */}
      {jurisdictionAlerts.length > 0 && (
        <div className="shrink-0 rounded-lg border border-amber-500/40 bg-amber-500/[0.04] p-4 shadow-md">
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
                className="flex items-center justify-between rounded border border-amber-500/30 bg-black/50 p-3"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-200">
                    <span>{alert.fromState}</span>
                    <span className="text-amber-400">⟷</span>
                    <span>{alert.toState}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-300">
                    Shared Subject:{" "}
                    <span className="font-semibold text-amber-200">
                      {alert.sharedEntityLabel}
                    </span>
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
                  Inspect in Graph
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Bottom Detail Section: Checkpoints List & Jurisdictional Profile */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Monitored Locations & Checkpoints (7 cols) */}
        <div className="flex flex-col rounded-lg border border-nexus-line bg-nexus-raised/90 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-nexus-line bg-nexus-panel/50 px-4 py-3">
            <span className="font-mono text-xs font-semibold tracking-wider text-nexus-cyan uppercase">
              CASE SIGHTINGS & CHECKPOINTS ({locationsList.length})
            </span>
            <span className="font-mono text-[10px] text-nexus-muted">
              Click to center map & view details
            </span>
          </div>

          <div className="divide-y divide-nexus-line/40 p-3 space-y-2.5">
            {locationsList.length > 0 ? (
              locationsList.map((loc) => {
                const isSelected = loc.id === (selectedLoc?.id || selectedLocId);
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
                        <MapPin
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isSelected ? "text-nexus-cyan" : "text-nexus-muted",
                          )}
                        />
                        <span className="font-semibold text-sm text-nexus-text">{loc.name}</span>
                        <span className="rounded border border-nexus-line bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-nexus-muted">
                          {loc.id}
                        </span>
                      </div>

                      <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 font-mono text-[11px] text-slate-400">
                        <div>
                          <span className="text-nexus-muted uppercase text-[9px] block mb-0.5">
                            Police Station
                          </span>
                          <span className="text-slate-200 font-medium">{loc.policeStation}</span>
                        </div>
                        <div>
                          <span className="text-nexus-muted uppercase text-[9px] block mb-0.5">
                            State & District
                          </span>
                          <span className="text-slate-200 font-medium">
                            {loc.district}, {loc.state}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between font-mono text-[10px]">
                        {loc.lastSighting && (
                          <div className="flex items-center gap-1.5 text-nexus-cyan">
                            <Clock className="h-3 w-3 text-nexus-cyan/70" />
                            <span>Last Recorded: {loc.lastSighting}</span>
                          </div>
                        )}
                        <span className="text-slate-400">
                          {loc.lat.toFixed(4)}° N, {loc.lng.toFixed(4)}° E
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      className={cn(
                        "h-4 w-4 ml-3 shrink-0",
                        isSelected ? "text-nexus-cyan" : "text-nexus-muted/40",
                      )}
                    />
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <Radio className="h-8 w-8 text-nexus-muted mx-auto mb-2 opacity-50" />
                <p className="font-mono text-xs text-nexus-muted">
                  No direct checkpoint sightings attached to current subject.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAllNational(true)}
                  className="mt-3 rounded border border-nexus-cyan/40 bg-nexus-cyan/15 px-3 py-1 font-mono text-xs text-nexus-cyan hover:bg-nexus-cyan/25"
                >
                  Enable All-India National Grid Overlay
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Jurisdictional Profile Inspector (5 cols) */}
        {selectedLoc && (
          <div className="flex flex-col rounded-lg border border-nexus-line bg-nexus-raised/95 p-5 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-nexus-line pb-3">
              <span className="font-mono text-[10px] font-semibold text-nexus-cyan tracking-wider uppercase">
                JURISDICTIONAL PROFILE
              </span>
              <span className="font-mono text-xs text-nexus-muted">{selectedLoc.id}</span>
            </div>

            <h2 className="mt-3 text-lg font-bold tracking-tight text-nexus-text">
              {selectedLoc.name}
            </h2>

            <div className="mt-4 rounded-md border border-nexus-line/70 bg-black/30 p-3 space-y-2">
              <div className="font-mono text-[10px] tracking-wider text-nexus-cyan uppercase">
                ADMINISTRATIVE DIVISION
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-[10px] font-mono text-nexus-muted uppercase">
                    Police Station
                  </span>
                  <span className="font-medium text-slate-200">{selectedLoc.policeStation}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-nexus-muted uppercase">
                    District
                  </span>
                  <span className="font-medium text-slate-200">{selectedLoc.district}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-nexus-muted uppercase">
                    State Jurisdiction
                  </span>
                  <span className="font-medium text-slate-200">{selectedLoc.state}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-nexus-muted uppercase">
                    Corroborated Sightings
                  </span>
                  <span className="font-mono text-nexus-cyan font-bold">
                    {selectedLoc.sightingsCount}
                  </span>
                </div>
              </div>
              <div className="border-t border-nexus-line/50 pt-2 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span>GEO-COORDINATES</span>
                <span className="text-nexus-cyan">
                  {selectedLoc.lat.toFixed(4)}° N, {selectedLoc.lng.toFixed(4)}° E
                </span>
              </div>
            </div>

            {/* Correlated Subjects */}
            <div className="mt-4">
              <div className="flex items-center justify-between border-b border-nexus-line/50 pb-1.5">
                <span className="font-mono text-[10px] tracking-wider text-nexus-cyan uppercase">
                  CORRELATED SUBJECTS ({selectedLoc.linkedEntities?.length || 0})
                </span>
                <span className="font-mono text-[10px] text-nexus-muted">Click to inspect</span>
              </div>

              {(selectedLoc.linkedEntities?.length || 0) > 0 ? (
                <div className="mt-2.5 space-y-2">
                  {selectedLoc.linkedEntities.map((ent) => (
                    <div
                      key={ent.id}
                      onClick={() => void handleOpenGraph(ent.id)}
                      className="group flex cursor-pointer items-center justify-between rounded border border-nexus-line/60 bg-black/40 px-3 py-2 text-xs transition-colors hover:border-nexus-cyan/50 hover:bg-nexus-panel/70"
                    >
                      <div>
                        <div className="font-medium text-slate-200 group-hover:text-nexus-cyan">
                          {ent.label}
                        </div>
                        <div className="font-mono text-[10px] text-nexus-muted">
                          {ent.type.toUpperCase()} · {ent.id}
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-nexus-muted group-hover:text-nexus-cyan" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 rounded border border-nexus-line/40 bg-black/20 p-3 text-center text-xs text-nexus-muted">
                  No additional subjects correlated to this geographic node.
                </div>
              )}
            </div>

            {/* Sighting Chronology */}
            <div className="mt-4">
              <div className="font-mono text-[10px] tracking-wider text-nexus-cyan uppercase border-b border-nexus-line/50 pb-1.5">
                TELEMETRY CHRONOLOGY ({selectedLoc.sightingEvents?.length || 0})
              </div>
              <div className="mt-2.5 space-y-2">
                {(selectedLoc.sightingEvents || []).map((se) => (
                  <div
                    key={se.id}
                    className="rounded border border-nexus-line/40 bg-black/30 p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-200 font-medium">
                      <span>{se.title}</span>
                      <span className="font-mono text-[10px] text-nexus-cyan">{se.timestamp}</span>
                    </div>
                    <p className="mt-1 text-slate-400 text-[11px]">{se.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

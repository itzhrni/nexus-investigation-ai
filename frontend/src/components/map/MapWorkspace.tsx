import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  MapPin,
  Compass,
  ChevronRight,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Crosshair,
  ArrowRight,
  Navigation,
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
  jurisdictionId?: string;
  latitude?: number;
  longitude?: number;
  sightingsCount: number;
  linkedEntities: { id: string; label: string; type: string }[];
  lastSighting?: string;
  sightingEvents?: {
    id: string;
    title: string;
    timestamp: string;
    note: string;
  }[];
}

// Demo coordinates for synthetic/offline mock locations.
// Real backend/database coordinates take precedence.
const MOCK_COORDINATE_MAP: Record<
  string,
  {
    lat: number;
    lng: number;
    state: string;
    district: string;
    station: string;
  }
> = {
  "LOC-AMBATTUR": {
    lat: 13.1147,
    lng: 80.1548,
    state: "Tamil Nadu",
    district: "Chennai",
    station: "Ambattur Police Station",
  },
  "LOC-BENGALURU": {
    lat: 12.9784,
    lng: 77.6408,
    state: "Karnataka",
    district: "Bengaluru Urban",
    station: "Indiranagar PS",
  },
  LOC001: {
    lat: 28.6315,
    lng: 77.2167,
    state: "Delhi",
    district: "New Delhi",
    station: "Connaught Place PS",
  },
  LOC002: {
    lat: 19.0596,
    lng: 72.8295,
    state: "Maharashtra",
    district: "Mumbai Suburban",
    station: "Bandra West PS",
  },
  LOC003: {
    lat: 12.9784,
    lng: 77.6408,
    state: "Karnataka",
    district: "Bengaluru Urban",
    station: "Indiranagar PS",
  },
  LOC004: {
    lat: 22.5551,
    lng: 88.3517,
    state: "West Bengal",
    district: "Kolkata",
    station: "Park Street PS",
  },
  LOC005: {
    lat: 28.495,
    lng: 77.0895,
    state: "Haryana",
    district: "Gurugram",
    station: "Cyber Crime PS Gurugram",
  },
};

function MapController({
  bounds,
  center,
}: {
  bounds: L.LatLngBounds | null;
  center?: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 13,
        animate: true,
      });
    } else if (center) {
      map.setView(center, map.getZoom(), {
        animate: true,
      });
    }
  }, [map, bounds, center]);

  return null;
}

function createCustomIcon(
  isPrimarySelected: boolean,
  isConnected: boolean,
) {
  const bgClass = isPrimarySelected
    ? "bg-nexus-cyan text-black ring-4 ring-nexus-cyan/50 shadow-[0_0_20px_rgba(61,214,245,0.9)] scale-125 z-50"
    : isConnected
      ? "bg-amber-400 text-black ring-4 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.8)] z-40"
      : "bg-nexus-panel text-nexus-cyan border border-nexus-cyan/60 shadow-[0_0_10px_rgba(61,214,245,0.3)] z-30";

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div class="relative flex items-center justify-center">
        <div class="h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300 ${bgClass}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export function MapWorkspace() {
  const graph = useInvestigationStore((s) => s.graph);
  const selectedNodeId = useInvestigationStore((s) => s.selectedNodeId);
  const focalEntityId = useInvestigationStore((s) => s.focalEntityId);
  const selectedEntity = useInvestigationStore((s) => s.selectedEntity);
  const jurisdictionAlerts = useInvestigationStore(
    (s) => s.jurisdictionAlerts,
  );
  const timeline = useInvestigationStore((s) => s.timeline);

  const selectNode = useInvestigationStore((s) => s.selectNode);
  const selectMatch = useInvestigationStore((s) => s.selectMatch);
  const setWorkspaceFocus = useInvestigationStore(
    (s) => s.setWorkspaceFocus,
  );

  const {
    locationsList,
    locationsWithCoords,
    locationsWithoutCoords,
  } = useMemo(() => {
    const locationMap = new Map<string, LocationItem>();

    // 1. Build locations from the live investigation graph.
    const locationNodes = (graph?.nodes || []).filter(
      (n) => n.type === "location" || n.id.startsWith("LOC"),
    );

    locationNodes.forEach((node) => {
      const props = node.properties || {};
      const fallback = MOCK_COORDINATE_MAP[node.id];

      const lat =
        node.latitude ??
        (props.latitude != null ? Number(props.latitude) : fallback?.lat);

      const lng =
        node.longitude ??
        (props.longitude != null
          ? Number(props.longitude)
          : fallback?.lng);

      const item: LocationItem = {
        id: node.id,
        name: props.name || node.label || node.id,
        sublabel: node.sublabel,

        state:
          node.state ||
          props.state ||
          fallback?.state ||
          "State Jurisdiction",

        district:
          node.district ||
          props.district ||
          fallback?.district ||
          "District HQ",

        policeStation:
          node.policeStation ||
          props.police_station ||
          fallback?.station ||
          "Station Jurisdiction",

        jurisdictionId:
          props.jurisdiction_id || props.jurisdictionId,

        latitude: lat,
        longitude: lng,

        sightingsCount: 0,
        linkedEntities: [],
        sightingEvents: [],
      };

      // Connected graph entities.
      (graph?.edges || []).forEach((edge) => {
        if (edge.source !== node.id && edge.target !== node.id) {
          return;
        }

        const otherId =
          edge.source === node.id ? edge.target : edge.source;

        const otherNode = graph?.nodes.find(
          (n) => n.id === otherId,
        );

        if (
          otherNode &&
          !item.linkedEntities.some(
            (entity) => entity.id === otherId,
          )
        ) {
          item.linkedEntities.push({
            id: otherNode.id,
            label: otherNode.label,
            type: otherNode.type,
          });
        }

        item.sightingEvents?.push({
          id: `SE-${edge.id || item.id}-${item.sightingEvents.length}`,
          title:
            edge.summary ||
            `Sighting Event at ${node.label}`,
          timestamp:
            edge.validFrom || "Recorded in dataset",
          note:
            edge.summary ||
            `Relational connection: ${edge.type}`,
        });
      });

      item.sightingsCount = Math.max(
        1,
        item.sightingEvents?.length || 0,
      );

      item.lastSighting =
        item.sightingEvents?.[0]?.timestamp;

      locationMap.set(node.id, item);
    });

    // 2. Keep synthetic fallback anchors only when no graph locations exist.
    if (locationMap.size === 0) {
      locationMap.set("LOC-AMBATTUR", {
        id: "LOC-AMBATTUR",
        name: "Ambattur Industrial Zone",
        sublabel: "Chennai, Tamil Nadu",
        state: "Tamil Nadu",
        district: "Chennai",
        policeStation: "Ambattur Police Station",
        latitude: 13.1147,
        longitude: 80.1548,
        sightingsCount: 3,
        linkedEntities: [
          {
            id: "P001",
            label: "Aarav Sharma",
            type: "person",
          },
          {
            id: "V-TN38AB1234",
            label: "TN38AB1234",
            type: "vehicle",
          },
        ],
        lastSighting: "2026-06-16 18:30 IST",
        sightingEvents: [
          {
            id: "SE-01",
            title: "Toll Plaza Checkpoint CCTV",
            timestamp: "2026-06-16 18:30 IST",
            note:
              "Vehicle TN38AB1234 identified crossing northbound toll gate lane 4.",
          },
          {
            id: "SE-02",
            title: "Industrial Area ANPR Reader",
            timestamp: "2026-06-14 09:45 IST",
            note:
              "Optical sighting at commercial logistics perimeter.",
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
        latitude: 12.9784,
        longitude: 77.6408,
        sightingsCount: 2,
        linkedEntities: [
          {
            id: "P004",
            label: "Vikram Patel",
            type: "person",
          },
          {
            id: "ACC001",
            label: "ACC001",
            type: "account",
          },
        ],
        lastSighting: "2026-06-18 10:15 IST",
        sightingEvents: [
          {
            id: "SE-03",
            title: "Commercial Bank ATM Kiosk",
            timestamp: "2026-06-17 19:20 IST",
            note:
              "Transaction registered on CBD branch terminal.",
          },
        ],
      });
    }

    // 3. Enrich locations with timeline events.
    timeline.forEach((evt) => {
      if (
        evt.kind !== "SEEN_AT" &&
        evt.kind !== "LOCATED_AT" &&
        !evt.title.includes("Location") &&
        !evt.title.includes("Sighting")
      ) {
        return;
      }

      const locId = evt.entityIds.find((id) =>
        id.startsWith("LOC"),
      );

      if (!locId) {
        return;
      }

      const item = locationMap.get(locId);

      if (!item) {
        return;
      }

      item.sightingsCount += 1;
      item.lastSighting = evt.timestamp;

      evt.entityIds.forEach((entityId) => {
        if (entityId.startsWith("LOC")) {
          return;
        }

        if (
          item.linkedEntities.some(
            (entity) => entity.id === entityId,
          )
        ) {
          return;
        }

        const node = graph?.nodes.find(
          (graphNode) => graphNode.id === entityId,
        );

        item.linkedEntities.push({
          id: entityId,
          label: node?.label || entityId,
          type: node?.type || "person",
        });
      });

      item.sightingEvents ??= [];

      item.sightingEvents.push({
        id: `TL-${evt.id}`,
        title: evt.title,
        timestamp: evt.timestamp,
        note: evt.description || evt.title,
      });
    });

    const list = Array.from(locationMap.values());

    const withCoords = list.filter(
      (location) =>
        location.latitude != null &&
        location.longitude != null &&
        !Number.isNaN(location.latitude) &&
        !Number.isNaN(location.longitude),
    );

    const withoutCoords = list.filter(
      (location) =>
        location.latitude == null ||
        location.longitude == null ||
        Number.isNaN(location.latitude) ||
        Number.isNaN(location.longitude),
    );

    return {
      locationsList: list,
      locationsWithCoords: withCoords,
      locationsWithoutCoords: withoutCoords,
    };
  }, [graph, timeline]);

  const [selectedLocId, setSelectedLocId] = useState<
    string | null
  >(null);

  const selectedLoc = useMemo(
    () =>
      locationsList.find(
        (location) => location.id === selectedLocId,
      ) ||
      locationsWithCoords[0] ||
      locationsList[0] ||
      null,
    [locationsList, locationsWithCoords, selectedLocId],
  );

  // Keep location selection synchronized with graph selection.
  useEffect(() => {
    if (
      selectedNodeId &&
      selectedNodeId.startsWith("LOC")
    ) {
      setSelectedLocId(selectedNodeId);
    }
  }, [selectedNodeId]);

  // Highlight locations directly connected to the active graph entity.
  const activeConnectedLocIds = useMemo(() => {
    const targetEntityId =
      selectedNodeId || focalEntityId;

    if (!targetEntityId) {
      return new Set<string>();
    }

    const connected = new Set<string>();

    (graph?.edges || []).forEach((edge) => {
      if (
        edge.source === targetEntityId &&
        edge.target.startsWith("LOC")
      ) {
        connected.add(edge.target);
      }

      if (
        edge.target === targetEntityId &&
        edge.source.startsWith("LOC")
      ) {
        connected.add(edge.source);
      }
    });

    return connected;
  }, [graph, selectedNodeId, focalEntityId]);

  const mapBounds = useMemo(() => {
    if (locationsWithCoords.length === 0) {
      return null;
    }

    const points: [number, number][] =
      locationsWithCoords.map((location) => [
        location.latitude!,
        location.longitude!,
      ]);

    return L.latLngBounds(points);
  }, [locationsWithCoords]);

  // Graph ↔ Map navigation.
  const handleOpenGraphForLocation = async (
    locationId: string,
  ) => {
    await selectNode(locationId);
    setWorkspaceFocus("investigation");
  };

  const handleOpenGraphForEntity = async (
    entityId: string,
  ) => {
    await selectMatch(entityId);
    setWorkspaceFocus("investigation");
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-nexus-bg p-4 text-nexus-text lg:p-6">
      {/* Header */}
      <div className="mb-4 flex shrink-0 flex-col gap-1 border-b border-nexus-line pb-3">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-nexus-cyan">
          <Compass className="h-4 w-4" />
          <span>
            Interactive GIS Map & Geographic Corridor
            Intelligence
          </span>
          <span className="h-1 w-1 rounded-full bg-nexus-cyan/40" />
          <span className="text-nexus-muted">
            Leaflet GIS Traversal
          </span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-nexus-text">
            Geographic Footprint & Spatial Relationship
            Layer
          </h1>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="rounded border border-nexus-cyan/40 bg-nexus-cyan/10 px-2.5 py-1 font-semibold text-nexus-cyan">
              GIS LOCATIONS:{" "}
              <span className="font-bold text-white">
                {locationsWithCoords.length}
              </span>
            </span>

            {locationsWithoutCoords.length > 0 && (
              <span className="rounded border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-semibold text-amber-300">
                NO COORDINATES:{" "}
                <span className="font-bold text-white">
                  {locationsWithoutCoords.length}
                </span>
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-nexus-muted">
          Interactive map correlating checkpoint sightings,
          geographic nodes, jurisdiction hierarchy, and
          inter-state corridors connected to the active
          investigation graph.
        </p>
      </div>

      {/* Cross-state alerts */}
      {jurisdictionAlerts.length > 0 && (
        <div className="mb-4 shrink-0 rounded-lg border border-amber-500/40 bg-amber-500/[0.04] p-3 shadow-md">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase text-amber-300">
              <Compass className="h-4 w-4" />
              <span>
                Cross-Jurisdictional Inter-State Corridors (
                {jurisdictionAlerts.length})
              </span>
            </div>

            <span className="font-mono text-[10px] text-amber-200/70">
              Inter-State Transition Alert
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {jurisdictionAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded border border-amber-500/30 bg-black/40 p-2.5"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-200">
                    <span>{alert.fromState}</span>
                    <span className="text-amber-400">
                      ⟷
                    </span>
                    <span>{alert.toState}</span>
                  </div>

                  <div className="mt-0.5 text-xs text-slate-300">
                    Subject:{" "}
                    <span className="font-semibold text-amber-200">
                      {alert.sharedEntityLabel}
                    </span>
                  </div>

                  <div className="font-mono text-[10px] text-nexus-muted">
                    {alert.recordCount} incident records ·{" "}
                    {alert.evidenceStrength} confidence
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void handleOpenGraphForEntity(
                      alert.sharedEntityId,
                    )
                  }
                  className="rounded border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-amber-300 transition-all hover:bg-amber-500/20"
                >
                  Inspect in Graph
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive GIS map */}
      <div className="relative mb-6 h-[460px] w-full shrink-0 overflow-hidden rounded-lg border border-nexus-line bg-black/60 shadow-2xl">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom
          className="z-10 h-full w-full"
          style={{ background: "#07090c" }}
        >
          <MapController bounds={mapBounds} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locationsWithCoords.map((location) => {
            const isSelected =
              location.id === selectedLoc?.id;

            const isConnected =
              activeConnectedLocIds.has(location.id);

            return (
              <Marker
                key={location.id}
                position={[
                  location.latitude!,
                  location.longitude!,
                ]}
                icon={createCustomIcon(
                  isSelected,
                  isConnected,
                )}
                eventHandlers={{
                  click: () =>
                    setSelectedLocId(location.id),
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -28]}
                  opacity={0.95}
                >
                  <div className="font-mono text-xs font-bold text-slate-900">
                    {location.name}
                  </div>
                  <div className="text-[10px] text-slate-700">
                    {location.district},{" "}
                    {location.state}
                  </div>
                </Tooltip>

                <Popup>
                  <div className="p-1 font-sans">
                    <div className="font-mono text-xs font-bold uppercase text-slate-900">
                      {location.name}
                    </div>

                    <div className="text-[11px] text-slate-600">
                      {location.policeStation} (
                      {location.district},{" "}
                      {location.state})
                    </div>

                    <div className="mt-1 font-mono text-[10px] font-semibold text-cyan-700">
                      Connected Entities:{" "}
                      {location.linkedEntities.length}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedLocId(location.id)
                      }
                      className="mt-2 w-full rounded bg-cyan-700 py-1 font-mono text-[10px] font-bold uppercase text-white hover:bg-cyan-800"
                    >
                      Select Location
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Map legend */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 rounded border border-nexus-line bg-nexus-raised/90 px-3 py-1.5 font-mono text-[11px] backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-nexus-cyan" />
            <span className="text-nexus-text">
              Selected Location
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="text-nexus-text">
              Connected to Node
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-nexus-cyan/60 bg-nexus-panel" />
            <span className="text-nexus-muted">
              Monitored Checkpoint
            </span>
          </div>
        </div>
      </div>

      {/* Location list + inspector */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Location list */}
        <div className="flex flex-col rounded-lg border border-nexus-line bg-nexus-raised/90 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-nexus-line bg-nexus-panel/50 px-4 py-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-nexus-cyan">
              Location Nodes & Checkpoints (
              {locationsList.length})
            </span>

            <span className="font-mono text-[10px] text-nexus-muted">
              Select marker or card to center
            </span>
          </div>

          <div className="space-y-2 divide-y divide-nexus-line/40 p-3">
            {locationsList.map((location) => {
              const isSelected =
                location.id === selectedLoc?.id;

              const hasCoords =
                location.latitude != null &&
                location.longitude != null;

              const isConnected =
                activeConnectedLocIds.has(location.id);

              return (
                <div
                  key={location.id}
                  onClick={() =>
                    setSelectedLocId(location.id)
                  }
                  className={cn(
                    "flex cursor-pointer items-start justify-between rounded-md border p-3.5 transition-all",
                    isSelected
                      ? "border-nexus-cyan bg-nexus-cyan/15"
                      : isConnected
                        ? "border-amber-500/50 bg-amber-500/10"
                        : "border-nexus-line/60 bg-black/30 hover:border-nexus-cyan/40 hover:bg-black/50",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isSelected
                            ? "text-nexus-cyan"
                            : isConnected
                              ? "text-amber-400"
                              : "text-nexus-muted",
                        )}
                      />

                      <span className="text-sm font-semibold text-nexus-text">
                        {location.name}
                      </span>

                      <span className="rounded border border-nexus-line bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-nexus-muted">
                        {location.id}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-400">
                      <div>
                        <span className="block text-[9px] uppercase text-nexus-muted">
                          Police Station
                        </span>
                        <span className="font-medium text-slate-200">
                          {location.policeStation}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[9px] uppercase text-nexus-muted">
                          State & District
                        </span>
                        <span className="font-medium text-slate-200">
                          {location.district},{" "}
                          {location.state}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
                      {hasCoords ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Crosshair className="h-3 w-3" />
                          GIS:{" "}
                          {location.latitude?.toFixed(4)},{" "}
                          {location.longitude?.toFixed(4)}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-400">
                          <AlertCircle className="h-3 w-3" />
                          No GIS Coordinates
                        </span>
                      )}

                      <span className="text-nexus-cyan">
                        {location.linkedEntities.length}{" "}
                        connected entities
                      </span>
                    </div>

                    {location.lastSighting && (
                      <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-nexus-cyan">
                        <Clock className="h-3 w-3 text-nexus-cyan/70" />
                        <span>
                          Last Activity Recorded:{" "}
                          {location.lastSighting}
                        </span>
                      </div>
                    )}
                  </div>

                  <ChevronRight
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0",
                      isSelected
                        ? "text-nexus-cyan"
                        : "text-nexus-muted/40",
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected location inspector */}
        {selectedLoc ? (
          <div className="flex flex-col rounded-lg border border-nexus-line bg-nexus-raised/95 p-5 lg:col-span-6">
            <div className="flex items-center justify-between border-b border-nexus-line pb-3">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-nexus-cyan">
                  Jurisdictional Profile & Node Inspector
                </span>

                <span className="mt-1 block font-mono text-xs text-nexus-muted">
                  {selectedLoc.id}
                </span>
              </div>
            </div>

            <h2 className="mt-3 text-lg font-bold tracking-tight text-nexus-text">
              {selectedLoc.name}
            </h2>

            {/* GIS availability */}
            {(
              selectedLoc.latitude == null ||
              selectedLoc.longitude == null
            ) && (
              <div className="mt-3 flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  Geographic coordinates are unavailable
                  for this location node record.
                </span>
              </div>
            )}

            {/* Jurisdiction hierarchy */}
            <div className="mt-4 space-y-2 rounded border border-nexus-line bg-black/40 p-3.5 text-xs font-mono">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-nexus-cyan">
                Jurisdictional Hierarchy
              </div>

              <div className="flex justify-between border-b border-nexus-line/40 pb-1.5">
                <span className="text-nexus-muted">
                  Police Station:
                </span>
                <span className="font-medium text-slate-200">
                  {selectedLoc.policeStation}
                </span>
              </div>

              <div className="flex justify-between border-b border-nexus-line/40 pb-1.5">
                <span className="text-nexus-muted">
                  District:
                </span>
                <span className="font-medium text-slate-200">
                  {selectedLoc.district}
                </span>
              </div>

              <div className="flex justify-between border-b border-nexus-line/40 pb-1.5">
                <span className="text-nexus-muted">
                  State Jurisdiction:
                </span>
                <span className="font-medium text-slate-200">
                  {selectedLoc.state}
                </span>
              </div>

              {selectedLoc.jurisdictionId && (
                <div className="flex justify-between border-b border-nexus-line/40 pb-1.5">
                  <span className="text-nexus-muted">
                    Jurisdiction ID:
                  </span>
                  <span className="font-medium text-slate-200">
                    {selectedLoc.jurisdictionId}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-nexus-muted">
                  Corroborated Sightings:
                </span>
                <span className="font-semibold text-nexus-cyan">
                  {selectedLoc.sightingsCount}
                </span>
              </div>
            </div>

            {/* Coordinates */}
            {selectedLoc.latitude != null &&
              selectedLoc.longitude != null && (
                <div className="mt-3 flex items-center gap-2 rounded border border-emerald-500/30 bg-emerald-500/5 p-3 font-mono text-[11px] text-emerald-300">
                  <Crosshair className="h-3.5 w-3.5" />
                  Coordinates:{" "}
                  {selectedLoc.latitude.toFixed(6)},{" "}
                  {selectedLoc.longitude.toFixed(6)}
                </div>
              )}

            {/* Associated entities */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between border-b border-nexus-line/50 pb-1.5">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-nexus-cyan">
                  Entities Associated With This Location (
                  {selectedLoc.linkedEntities.length})
                </span>

                <span className="font-mono text-[10px] text-nexus-muted">
                  Click to inspect
                </span>
              </div>

              {selectedLoc.linkedEntities.length > 0 ? (
                <div className="space-y-2">
                  {selectedLoc.linkedEntities.map(
                    (entity) => (
                      <div
                        key={entity.id}
                        className="flex items-center justify-between rounded border border-nexus-line bg-black/40 px-3 py-2 text-xs"
                      >
                        <div>
                          <span className="block font-semibold text-slate-200">
                            {entity.label}
                          </span>

                          <span className="font-mono text-[10px] text-nexus-muted">
                            {entity.type.toUpperCase()} ·{" "}
                            {entity.id}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            void handleOpenGraphForEntity(
                              entity.id,
                            )
                          }
                          className="flex items-center gap-1 rounded bg-nexus-cyan/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-nexus-cyan transition-all hover:bg-nexus-cyan/30"
                        >
                          Investigate
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="rounded border border-nexus-line/40 bg-black/20 p-3 text-xs text-nexus-muted">
                  No direct entity associations recorded
                  for this location node.
                </div>
              )}
            </div>

            {/* Sighting chronology */}
            <div className="mt-4">
              <div className="border-b border-nexus-line/50 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-nexus-cyan">
                Telemetry Chronology (
                {selectedLoc.sightingEvents?.length || 0}
                )
              </div>

              <div className="mt-2.5 space-y-2">
                {(selectedLoc.sightingEvents || []).map(
                  (event) => (
                    <div
                      key={event.id}
                      className="rounded border border-nexus-line/40 bg-black/30 p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-3 font-medium text-slate-200">
                        <span>{event.title}</span>

                        <span className="shrink-0 font-mono text-[10px] text-nexus-cyan">
                          {event.timestamp}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {event.note}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Graph navigation */}
            <button
              type="button"
              onClick={() =>
                void handleOpenGraphForLocation(
                  selectedLoc.id,
                )
              }
              className="mt-6 flex items-center justify-center gap-2 rounded bg-nexus-cyan py-2.5 font-mono text-xs font-bold uppercase text-black transition-all hover:bg-nexus-cyan/90"
            >
              <Navigation className="h-4 w-4" />
              Isolate Location in Focal Graph
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-nexus-line bg-nexus-raised/60 p-12 text-center lg:col-span-6">
            <MapPin className="mb-3 h-8 w-8 text-nexus-muted" />
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-200">
              No Geographic Anchors Linked
            </h3>

            <p className="mt-2 max-w-md text-xs leading-relaxed text-nexus-muted">
              No location checkpoints, toll ANPR sightings,
              or geographic anchors are linked to{" "}
              <span className="font-medium text-slate-200">
                {selectedEntity?.label ||
                  focalEntityId ||
                  "the active subject"}
              </span>{" "}
              in the current investigation graph.
            </p>
          </div>
        )}
      </div>

      {/* Protocol information */}
      <div className="mt-8 rounded-lg border border-nexus-line bg-nexus-raised/80 p-5">
        <div className="flex items-center gap-2 border-b border-nexus-line/40 pb-3">
          <Shield className="h-4 w-4 text-nexus-cyan" />

          <h3 className="text-sm font-semibold text-nexus-text">
            Multi-Jurisdictional Intelligence & Inter-State
            GIS Protocols
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
          <div className="space-y-1 rounded border border-nexus-line/50 bg-black/30 p-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-nexus-cyan">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>INTER-STATE DISPATCH PROTOCOL</span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-300">
              Cross-jurisdiction transitions can be surfaced
              from the investigation graph for investigator
              review.
            </p>
          </div>

          <div className="space-y-1 rounded border border-nexus-line/50 bg-black/30 p-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-nexus-cyan">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>ANPR CHECKPOINT SYNCHRONIZATION</span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-300">
              Vehicle and checkpoint relationships can be
              correlated with geographic nodes and displayed
              alongside the active graph.
            </p>
          </div>

          <div className="space-y-1 rounded border border-nexus-line/50 bg-black/30 p-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-nexus-cyan">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>GEOGRAPHIC AUDIT TRAIL</span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-300">
              Location events remain timestamped and linked
              to the corresponding investigation entities for
              traceable review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
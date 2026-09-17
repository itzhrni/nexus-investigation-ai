import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Crosshair,
  Compass,
  Maximize2,
  Minimize2,
  Navigation,
  Radio,
} from "lucide-react";
import type { JurisdictionAlert } from "@/types/nexus";

export interface MapLocationPoint {
  id: string;
  name: string;
  sublabel?: string;
  state?: string;
  district?: string;
  policeStation?: string;
  lat: number;
  lng: number;
  sightingsCount: number;
  isFocal?: boolean;
  lastSighting?: string;
}

// Known coordinates for Indian states (centroids)
export const STATE_CENTROIDS: Record<string, [number, number]> = {
  "Tamil Nadu": [11.1271, 78.6569],
  "Karnataka": [15.3173, 75.7139],
  "Maharashtra": [19.7515, 75.7139],
  "Delhi": [28.7041, 77.1025],
  "West Bengal": [22.9868, 87.855],
  "Telangana": [18.1124, 79.0193],
  "Gujarat": [22.2587, 71.1924],
  "Rajasthan": [27.0238, 74.2179],
  "Kerala": [10.8505, 76.2711],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Punjab": [31.1471, 75.3412],
  "Haryana": [29.0588, 76.0856],
  "Chandigarh": [30.7333, 76.7794],
  "Madhya Pradesh": [22.9734, 78.6569],
  "Bihar": [25.0961, 85.3131],
  "Odisha": [20.9517, 85.0985],
  "Andhra Pradesh": [15.9129, 79.74],
};

// Complete National Monitored Points catalog for India (so national grid is always alive)
export const ALL_INDIA_MONITORED_POINTS: MapLocationPoint[] = [
  { id: "LOC001", name: "Connaught Place", sublabel: "Delhi", state: "Delhi", district: "New Delhi", policeStation: "Connaught Place PS", lat: 28.6315, lng: 77.2167, sightingsCount: 4 },
  { id: "LOC002", name: "Bandra West", sublabel: "Mumbai", state: "Maharashtra", district: "Mumbai Suburban", policeStation: "Bandra PS", lat: 19.0596, lng: 72.8295, sightingsCount: 3 },
  { id: "LOC003", name: "Indiranagar", sublabel: "Bengaluru", state: "Karnataka", district: "Bengaluru Urban", policeStation: "Indiranagar PS", lat: 12.9784, lng: 77.6408, sightingsCount: 5 },
  { id: "LOC004", name: "Park Street", sublabel: "Kolkata", state: "West Bengal", district: "Kolkata", policeStation: "Park Street PS", lat: 22.5551, lng: 88.3517, sightingsCount: 2 },
  { id: "LOC005", name: "Cyber City", sublabel: "Gurugram", state: "Haryana", district: "Gurugram", policeStation: "Cyber Crime PS", lat: 28.495, lng: 77.0895, sightingsCount: 3 },
  { id: "LOC006", name: "Gachibowli", sublabel: "Hyderabad", state: "Telangana", district: "Hyderabad", policeStation: "Gachibowli PS", lat: 17.4401, lng: 78.3489, sightingsCount: 2 },
  { id: "LOC007", name: "Anna Nagar", sublabel: "Chennai", state: "Tamil Nadu", district: "Chennai", policeStation: "Anna Nagar PS", lat: 13.085, lng: 80.2101, sightingsCount: 4 },
  { id: "LOC008", name: "FC Road", sublabel: "Pune", state: "Maharashtra", district: "Pune", policeStation: "Deccan Gymkhana PS", lat: 18.5204, lng: 73.8415, sightingsCount: 2 },
  { id: "LOC009", name: "SG Highway", sublabel: "Ahmedabad", state: "Gujarat", district: "Ahmedabad", policeStation: "Vastrapur PS", lat: 23.0225, lng: 72.5714, sightingsCount: 1 },
  { id: "LOC010", name: "Hazratganj", sublabel: "Lucknow", state: "Uttar Pradesh", district: "Lucknow", policeStation: "Hazratganj PS", lat: 26.8467, lng: 80.9462, sightingsCount: 2 },
  { id: "LOC011", name: "MI Road", sublabel: "Jaipur", state: "Rajasthan", district: "Jaipur", policeStation: "Kotwali PS", lat: 26.9124, lng: 75.7873, sightingsCount: 2 },
  { id: "LOC012", name: "Sector 17", sublabel: "Chandigarh", state: "Punjab", district: "Chandigarh", policeStation: "Sector 17 PS", lat: 30.7398, lng: 76.7827, sightingsCount: 1 },
  { id: "LOC013", name: "Bani Park", sublabel: "Jaipur", state: "Rajasthan", district: "Jaipur", policeStation: "Bani Park PS", lat: 26.926, lng: 75.792, sightingsCount: 1 },
  { id: "LOC014", name: "MG Road", sublabel: "Kochi", state: "Kerala", district: "Ernakulam", policeStation: "Central PS Kochi", lat: 9.9726, lng: 76.278, sightingsCount: 2 },
  { id: "LOC015", name: "Salt Lake", sublabel: "Kolkata", state: "West Bengal", district: "North 24 Parganas", policeStation: "Bidhannagar PS", lat: 22.5867, lng: 88.4171, sightingsCount: 2 },
  { id: "LOC016", name: "Vashi", sublabel: "Navi Mumbai", state: "Maharashtra", district: "Thane", policeStation: "Vashi PS", lat: 19.077, lng: 73.0033, sightingsCount: 2 },
  { id: "LOC017", name: "Whitefield", sublabel: "Bengaluru", state: "Karnataka", district: "Bengaluru Urban", policeStation: "Whitefield PS", lat: 12.9698, lng: 77.75, sightingsCount: 3 },
  { id: "LOC018", name: "Koramangala", sublabel: "Bengaluru", state: "Karnataka", district: "Bengaluru Urban", policeStation: "Koramangala PS", lat: 12.9352, lng: 77.6245, sightingsCount: 4 },
  { id: "LOC019", name: "Hitech City", sublabel: "Hyderabad", state: "Telangana", district: "Rangareddy", policeStation: "Madhapur PS", lat: 17.4435, lng: 78.3772, sightingsCount: 3 },
  { id: "LOC020", name: "Juhu", sublabel: "Mumbai", state: "Maharashtra", district: "Mumbai Suburban", policeStation: "Juhu PS", lat: 19.1075, lng: 72.8263, sightingsCount: 2 },
  { id: "LOC021", name: "Aerocity", sublabel: "New Delhi", state: "Delhi", district: "South West Delhi", policeStation: "IGI Airport PS", lat: 28.552, lng: 77.1215, sightingsCount: 3 },
  { id: "LOC022", name: "Viman Nagar", sublabel: "Pune", state: "Maharashtra", district: "Pune", policeStation: "Viman Nagar PS", lat: 18.5679, lng: 73.9143, sightingsCount: 2 },
  { id: "LOC023", name: "Alipore", sublabel: "Kolkata", state: "West Bengal", district: "Kolkata", policeStation: "Alipore PS", lat: 22.5323, lng: 88.3308, sightingsCount: 1 },
  { id: "LOC024", name: "Adyar", sublabel: "Chennai", state: "Tamil Nadu", district: "Chennai", policeStation: "Adyar PS", lat: 13.0012, lng: 80.2565, sightingsCount: 2 },
  { id: "LOC025", name: "Nungambakkam", sublabel: "Chennai", state: "Tamil Nadu", district: "Chennai", policeStation: "Nungambakkam PS", lat: 13.0604, lng: 80.2496, sightingsCount: 3 },
];

interface IndiaMapProps {
  locations: MapLocationPoint[];
  selectedLocId: string | null;
  onSelectLocation: (id: string) => void;
  jurisdictionAlerts: JurisdictionAlert[];
  showAllNational?: boolean;
}

type TileLayerType = "dark" | "satellite" | "street";

export function IndiaMap({
  locations,
  selectedLocId,
  onSelectLocation,
  jurisdictionAlerts,
  showAllNational = false,
}: IndiaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const corridorLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeTileType, setActiveTileType] = useState<TileLayerType>("dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCorridors, setShowCorridors] = useState(true);
  const [coordsReadout, setCoordsReadout] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on India [21.5, 78.9]
    const map = L.map(mapContainerRef.current, {
      center: [21.5, 78.9],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
    });

    // Custom positioned zoom control
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Initial tile layer group (Esri World Dark Gray Base + Labels - zero watermark, keyless)
    const tileGroup = L.layerGroup().addTo(map);
    const darkBase = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, DeLorme, NAVTEQ',
        maxZoom: 19,
      }
    );
    const darkRef = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "",
        maxZoom: 19,
      }
    );
    tileGroup.addLayer(darkBase);
    tileGroup.addLayer(darkRef);

    // Layers for markers and corridors
    const markersLayer = L.layerGroup().addTo(map);
    const corridorLayer = L.layerGroup().addTo(map);

    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      setCoordsReadout({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapInstanceRef.current = map;
    tileLayerGroupRef.current = tileGroup;
    markersLayerRef.current = markersLayer;
    corridorLayerRef.current = corridorLayer;

    // Invalidate size after initial layout
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Layer Switching
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerGroupRef.current) return;

    tileLayerGroupRef.current.clearLayers();

    if (activeTileType === "dark") {
      const darkBase = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, DeLorme, NAVTEQ',
          maxZoom: 19,
        }
      );
      const darkRef = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "",
          maxZoom: 19,
        }
      );
      tileLayerGroupRef.current.addLayer(darkBase);
      tileLayerGroupRef.current.addLayer(darkRef);
    } else if (activeTileType === "satellite") {
      const satLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "&copy; Esri, Maxar, Earthstar",
          maxZoom: 19,
        }
      );
      tileLayerGroupRef.current.addLayer(satLayer);
    } else if (activeTileType === "street") {
      const streetLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        }
      );
      tileLayerGroupRef.current.addLayer(streetLayer);
    }
  }, [activeTileType]);

  // Render Markers and Corridors
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !corridorLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    corridorLayerRef.current.clearLayers();

    // Determine points to plot
    const pointsToPlot: MapLocationPoint[] = [];
    const plottedIds = new Set<string>();

    // 1. First add investigation-scoped locations
    locations.forEach((loc) => {
      pointsToPlot.push({ ...loc, isFocal: true });
      plottedIds.add(loc.id);
    });

    // 2. If showAllNational is on, or if locations list is small, add background national points
    if (showAllNational || locations.length === 0) {
      ALL_INDIA_MONITORED_POINTS.forEach((pt) => {
        if (!plottedIds.has(pt.id)) {
          pointsToPlot.push({ ...pt, isFocal: false });
          plottedIds.add(pt.id);
        }
      });
    }

    // Check which states are involved in corridors
    const corridorStates = new Set<string>();
    jurisdictionAlerts.forEach((a) => {
      if (a.fromState) corridorStates.add(a.fromState);
      if (a.toState) corridorStates.add(a.toState);
    });

    // Create markers
    pointsToPlot.forEach((pt) => {
      const isSelected = pt.id === selectedLocId;
      const isInCorridor = pt.state ? corridorStates.has(pt.state) : false;

      // Custom DivIcon
      const icon = L.divIcon({
        className: "nexus-map-pin",
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width:36px; height:36px;">
            ${
              isInCorridor
                ? '<div class="absolute w-8 h-8 rounded-full bg-amber-500/30 animate-ping"></div>'
                : isSelected
                ? '<div class="absolute w-9 h-9 rounded-full bg-cyan-400/30 animate-pulse"></div>'
                : pt.isFocal
                ? '<div class="absolute w-6 h-6 rounded-full bg-cyan-500/20"></div>'
                : '<div class="absolute w-4 h-4 rounded-full bg-slate-500/10"></div>'
            }
            <div class="absolute w-5 h-5 rounded-full border ${
              isInCorridor
                ? "border-amber-400 bg-amber-950/90 shadow-[0_0_12px_#f59e0b]"
                : isSelected
                ? "border-cyan-300 bg-cyan-950/90 shadow-[0_0_14px_#38bdf8] ring-2 ring-cyan-400/60"
                : pt.isFocal
                ? "border-cyan-400 bg-black/80 shadow-[0_0_8px_#06b6d4]"
                : "border-slate-500/60 bg-black/70"
            } flex items-center justify-center">
              <div class="w-2 h-2 rounded-full ${
                isInCorridor
                  ? "bg-amber-400"
                  : isSelected
                  ? "bg-cyan-300"
                  : pt.isFocal
                  ? "bg-cyan-400"
                  : "bg-slate-400"
              }"></div>
            </div>
            <div class="absolute left-7 top-1/2 -translate-y-1/2 pointer-events-none px-2 py-0.5 whitespace-nowrap rounded font-mono text-[10px] font-semibold border backdrop-blur-sm shadow-md transition-all ${
              isSelected
                ? "border-cyan-400 bg-slate-900/95 text-cyan-200 ring-1 ring-cyan-400/50 z-30"
                : isInCorridor
                ? "border-amber-500/60 bg-black/90 text-amber-300 z-20"
                : pt.isFocal
                ? "border-slate-700 bg-black/80 text-slate-200 group-hover:border-cyan-400 group-hover:text-cyan-300 z-10"
                : "border-slate-800/80 bg-black/70 text-slate-400 opacity-70 group-hover:opacity-100 z-0"
            }">
              <span>${pt.name.split(",")[0]}</span>
              ${pt.sightingsCount > 1 ? `<span class="ml-1 text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">${pt.sightingsCount}</span>` : ""}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon });

      // Click handler
      marker.on("click", () => {
        onSelectLocation(pt.id);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([pt.lat, pt.lng], 12, { duration: 1.0 });
        }
      });

      // Tooltip
      marker.bindTooltip(
        `
        <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #0b0f17; border: 1px solid #06b6d4; color: #f8fafc; padding: 6px 10px; border-radius: 6px; box-shadow: 0 4px 20px rgba(0,0,0,0.8);">
          <div style="font-weight: bold; color: #38bdf8; font-size: 11px;">${pt.name}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">PS: ${pt.policeStation || "N/A"}</div>
          <div style="font-size: 10px; color: #cbd5e1;">${pt.district || ""}, ${pt.state || ""}</div>
          <div style="font-size: 9px; color: #06b6d4; margin-top: 4px;">Lat: ${pt.lat.toFixed(4)}°N | Lng: ${pt.lng.toFixed(4)}°E</div>
        </div>
      `,
        { direction: "top", offset: [0, -14], opacity: 1, className: "nexus-tooltip" }
      );

      markersLayerRef.current?.addLayer(marker);
    });

    // Render Corridor Trajectories if toggled on
    if (showCorridors && jurisdictionAlerts.length > 0) {
      jurisdictionAlerts.forEach((alert) => {
        const fromCoord = STATE_CENTROIDS[alert.fromState];
        const toCoord = STATE_CENTROIDS[alert.toState];

        if (fromCoord && toCoord) {
          // Curved / Bezier simulation using intermediate waypoint
          const midLat = (fromCoord[0] + toCoord[0]) / 2 + 1.2; // Curve upwards
          const midLng = (fromCoord[1] + toCoord[1]) / 2 - 0.8;

          const latlngs: [number, number][] = [fromCoord, [midLat, midLng], toCoord];

          const corridorLine = L.polyline(latlngs, {
            color: "#f59e0b",
            weight: 3,
            dashArray: "6, 8",
            opacity: 0.85,
            smoothFactor: 1,
          });

          corridorLine.bindPopup(`
            <div style="font-family: ui-monospace, SFMono-Regular, monospace; background: #0f172a; border: 1px solid #f59e0b; color: #f8fafc; padding: 8px 12px; border-radius: 6px;">
              <div style="font-weight: bold; color: #fbbf24; font-size: 11px; text-transform: uppercase;">
                CROSS-STATE CORRIDOR DETECTED
              </div>
              <div style="margin-top: 4px; font-size: 11px; color: #e2e8f0;">
                ${alert.fromState} ⟷ ${alert.toState}
              </div>
              <div style="margin-top: 2px; font-size: 10px; color: #94a3b8;">
                Shared Subject: <span style="color:#38bdf8;">${alert.sharedEntityLabel}</span>
              </div>
              <div style="font-size: 9px; color: #64748b; margin-top: 4px;">
                ${alert.recordCount} Inter-State Incidents · ${alert.evidenceStrength} Confidence
              </div>
            </div>
          `);

          corridorLayerRef.current?.addLayer(corridorLine);
        }
      });
    }
  }, [locations, selectedLocId, jurisdictionAlerts, showCorridors, showAllNational]);

  // Pan to selected location when selectedLocId changes
  useEffect(() => {
    if (!selectedLocId || !mapInstanceRef.current) return;
    const target = locations.find((l) => l.id === selectedLocId) || ALL_INDIA_MONITORED_POINTS.find((l) => l.id === selectedLocId);
    if (target) {
      mapInstanceRef.current.flyTo([target.lat, target.lng], 12, { duration: 0.9 });
    }
  }, [selectedLocId, locations]);

  // Quick preset camera moves
  const flyToRegion = (region: "india" | "north" | "south" | "west" | "east") => {
    if (!mapInstanceRef.current) return;
    switch (region) {
      case "india":
        mapInstanceRef.current.flyTo([22.5, 80.0], 5, { duration: 1.0 });
        break;
      case "north":
        mapInstanceRef.current.flyTo([28.7, 77.1], 7, { duration: 1.0 });
        break;
      case "south":
        mapInstanceRef.current.flyTo([13.0, 78.5], 7, { duration: 1.0 });
        break;
      case "west":
        mapInstanceRef.current.flyTo([19.5, 73.5], 7, { duration: 1.0 });
        break;
      case "east":
        mapInstanceRef.current.flyTo([22.8, 88.0], 7, { duration: 1.0 });
        break;
    }
  };

  const fitActivePoints = () => {
    if (!mapInstanceRef.current) return;
    const active = locations.length > 0 ? locations : ALL_INDIA_MONITORED_POINTS;
    if (active.length === 0) return;
    const bounds = L.latLngBounds(active.map((p) => [p.lat, p.lng]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, duration: 1.0 });
  };

  return (
    <div
      className={`relative w-full rounded-xl border border-nexus-line overflow-hidden bg-[#070b11] transition-all ${
        isFullscreen ? "fixed inset-4 z-50 h-[calc(100vh-2rem)] shadow-2xl" : "h-[500px] lg:h-[560px]"
      }`}
    >
      {/* 1. Leaflet Container */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* 2. Top-Left Tactical HUD Header */}
      <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2 rounded-lg border border-nexus-line/80 bg-black/80 p-1.5 backdrop-blur-md">
        <div className="flex items-center gap-1.5 px-2 py-1 font-mono text-[11px] font-bold text-nexus-cyan uppercase">
          <Compass className="h-3.5 w-3.5 text-nexus-cyan animate-spin-slow" />
          <span>BHARAT GEOSPATIAL INTELLIGENCE</span>
        </div>

        <div className="h-4 w-px bg-nexus-line" />

        {/* Region Presets */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => flyToRegion("india")}
            className="rounded px-2 py-1 font-mono text-[10px] text-slate-300 hover:bg-nexus-panel hover:text-nexus-cyan transition-colors"
          >
            All India
          </button>
          <button
            type="button"
            onClick={() => flyToRegion("north")}
            className="rounded px-2 py-1 font-mono text-[10px] text-slate-300 hover:bg-nexus-panel hover:text-nexus-cyan transition-colors"
          >
            North
          </button>
          <button
            type="button"
            onClick={() => flyToRegion("south")}
            className="rounded px-2 py-1 font-mono text-[10px] text-slate-300 hover:bg-nexus-panel hover:text-nexus-cyan transition-colors"
          >
            South
          </button>
          <button
            type="button"
            onClick={() => flyToRegion("west")}
            className="rounded px-2 py-1 font-mono text-[10px] text-slate-300 hover:bg-nexus-panel hover:text-nexus-cyan transition-colors"
          >
            West
          </button>
          <button
            type="button"
            onClick={() => flyToRegion("east")}
            className="rounded px-2 py-1 font-mono text-[10px] text-slate-300 hover:bg-nexus-panel hover:text-nexus-cyan transition-colors"
          >
            East
          </button>
        </div>

        <div className="h-4 w-px bg-nexus-line" />

        <button
          type="button"
          onClick={fitActivePoints}
          className="flex items-center gap-1 rounded bg-nexus-cyan/15 border border-nexus-cyan/40 px-2 py-1 font-mono text-[10px] font-semibold text-nexus-cyan hover:bg-nexus-cyan/25 transition-all"
        >
          <Crosshair className="h-3 w-3" />
          <span>Fit Points ({locations.length})</span>
        </button>
      </div>

      {/* 3. Top-Right Tactical Controls (Layers, Corridors, Fullscreen) */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        {/* Layer Selector */}
        <div className="flex items-center rounded-lg border border-nexus-line/80 bg-black/80 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTileType("dark")}
            className={`rounded px-2.5 py-1 font-mono text-[10px] transition-all ${
              activeTileType === "dark"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Dark Cyber
          </button>
          <button
            type="button"
            onClick={() => setActiveTileType("satellite")}
            className={`rounded px-2.5 py-1 font-mono text-[10px] transition-all ${
              activeTileType === "satellite"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setActiveTileType("street")}
            className={`rounded px-2.5 py-1 font-mono text-[10px] transition-all ${
              activeTileType === "street"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Street
          </button>
        </div>

        {/* Corridor Toggle */}
        <button
          type="button"
          onClick={() => setShowCorridors(!showCorridors)}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[10px] backdrop-blur-md transition-all ${
            showCorridors
              ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
              : "border-nexus-line/80 bg-black/80 text-slate-400 hover:text-slate-200"
          }`}
          title="Toggle inter-state corridor trajectories"
        >
          <Radio className="h-3 w-3" />
          <span>Corridors ({jurisdictionAlerts.length})</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="rounded-lg border border-nexus-line/80 bg-black/80 p-2 text-slate-300 hover:text-nexus-cyan backdrop-blur-md transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* 4. Bottom-Left Live Telemetry & Legend HUD */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1.5 rounded-lg border border-nexus-line/80 bg-black/85 p-3 font-mono text-[10px] backdrop-blur-md text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span>
            <span>Case Location ({locations.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]"></span>
            <span>Inter-State Corridor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500"></span>
            <span>National Post</span>
          </div>
        </div>

        {coordsReadout && (
          <div className="mt-1 flex items-center gap-2 border-t border-nexus-line/50 pt-1.5 text-nexus-muted">
            <Navigation className="h-3 w-3 text-nexus-cyan" />
            <span>
              LAT: <span className="text-slate-200 font-semibold">{coordsReadout.lat.toFixed(4)}° N</span> | LNG:{" "}
              <span className="text-slate-200 font-semibold">{coordsReadout.lng.toFixed(4)}° E</span>
            </span>
            <span className="ml-auto text-[9px] text-nexus-cyan font-semibold">WGS-84 / SOI</span>
          </div>
        )}
      </div>

      {/* 5. Cyber Corner Accents */}
      <div className="pointer-events-none absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-nexus-cyan/60" />
      <div className="pointer-events-none absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-nexus-cyan/60" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-nexus-cyan/60" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-nexus-cyan/60" />
    </div>
  );
}

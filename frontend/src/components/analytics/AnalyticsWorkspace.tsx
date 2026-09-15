import { useState } from "react";
import {
  Activity,
  BarChart3,
  FileText,
  Fingerprint,
  Layers,
  MapPin,
  Network,
  Zap,
} from "lucide-react";
import { useInvestigationStore } from "@/store/investigationStore";
import type { AnalyticsFilterState, AnalyticsTab } from "@/types/nexus";
import { cn } from "@/lib/cn";
import { AnalyticsFilterBar } from "./AnalyticsFilterBar";
import { AnalyticsDetailModal } from "./AnalyticsDetailModal";

import { OverviewTab } from "./tabs/OverviewTab";
import { NetworkTab } from "./tabs/NetworkTab";
import { TemporalTab } from "./tabs/TemporalTab";
import { IdentityTab } from "./tabs/IdentityTab";
import { JurisdictionTab } from "./tabs/JurisdictionTab";
import { PatternsTab } from "./tabs/PatternsTab";
import { EvidenceTab } from "./tabs/EvidenceTab";

export function AnalyticsWorkspace() {
  const investigation = useInvestigationStore((s) => s.investigation);
  const graph = useInvestigationStore((s) => s.graph);
  const timelineEvents = useInvestigationStore((s) => s.timeline);
  const whatChanged = useInvestigationStore((s) => s.whatChanged);
  const jurisdictionAlerts = useInvestigationStore((s) => s.jurisdictionAlerts);
  const continuityAlerts = useInvestigationStore((s) => s.continuityAlerts);
  const evidence = useInvestigationStore((s) => s.evidence);
  const selectMatch = useInvestigationStore((s) => s.selectMatch);
  const setWorkspaceFocus = useInvestigationStore((s) => s.setWorkspaceFocus);

  // Active Tab state
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");

  // Filter state
  const [filters, setFilters] = useState<AnalyticsFilterState>({});

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
  }>({
    isOpen: false,
    title: "",
    content: null,
  });

  const openModal = (title: string, content: React.ReactNode) => {
    setModalState({ isOpen: true, title, content });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: "", content: null });
  };

  // Synthesize pattern leads
  const patternLeads = [
    {
      id: "PAT-001",
      title: "SIM & Hardware Device Swap Pattern",
      type: "SIM_DEVICE_SWITCH",
      severity: "HIGH" as const,
      confidence: 0.95,
      explanation: "Hardware device swap detected on subscriber SIM001. Common tactic for evading single IMEI handset tracking.",
      evidence: [
        "SIM001 active in DEV001 (before 2026-01-10) and DEV002 (after 2026-01-10) in consecutive CDR logs.",
      ],
      involvedEntities: ["SIM001", "DEV001", "DEV002", "P001"],
      timestamps: ["2026-01-05T10:00:00", "2026-01-12T10:00:00"],
    },
    {
      id: "PAT-002",
      title: "Circular Financial Transfer Loop",
      type: "CIRCULAR_TRANSACTIONS",
      severity: "CRITICAL" as const,
      confidence: 0.98,
      explanation: "Circular high-value transaction loop completed across 3 bank accounts within a 48-hour window.",
      evidence: [
        "TX_RING_001: ACC001 → ACC005 (₹450,000 RTGS at 2026-01-06T10:00:00)",
        "TX_RING_002: ACC005 → ACC012 (₹445,000 NEFT at 2026-01-07T10:00:00)",
        "TX_RING_003: ACC012 → ACC001 (₹440,000 UPI at 2026-01-08T10:00:00)",
      ],
      involvedEntities: ["ACC001", "ACC005", "ACC012"],
      timestamps: ["2026-01-06T10:00:00", "2026-01-08T10:00:00"],
    },
    {
      id: "PAT-003",
      title: "Spatial-Temporal Checkpoint Convergence",
      type: "SPATIAL_TEMPORAL_CONVERGENCE",
      severity: "HIGH" as const,
      confidence: 0.96,
      explanation: "Multiple suspect vehicles co-located at checkpoint LOC005 within a 15-minute time window.",
      evidence: [
        "SIGHT_CONV_001: Vehicle V002 spotted at LOC005 (Cyber City, Gurugram) at 2026-01-15T14:10:00",
        "SIGHT_CONV_002: Vehicle V003 spotted at LOC005 at 2026-01-15T14:25:00",
      ],
      involvedEntities: ["V002", "V003", "LOC005"],
      timestamps: ["2026-01-15T14:10:00", "2026-01-15T14:25:00"],
    },
    {
      id: "PAT-004",
      title: "Cross-Jurisdictional Inter-State Footprint",
      type: "CROSS_JURISDICTION_ACTIVITY",
      severity: "MEDIUM" as const,
      confidence: 0.94,
      explanation: "Multi-jurisdiction operational footprint spanning Delhi and Maharashtra.",
      evidence: [
        "Subject P004 named in FIR001 under Connaught Place PS, Delhi (JUR_DEL_001)",
        "Vehicle V004 owned by P004 sighted at LOC002 in Bandra West PS, Mumbai (JUR_MAH_002)",
      ],
      involvedEntities: ["P004", "FIR001", "V004", "LOC002"],
      timestamps: ["2026-01-18T10:00:00"],
    },
    {
      id: "PAT-005",
      title: "Identifier Transition & Identity Continuity",
      type: "IDENTIFIER_TRANSITION",
      severity: "HIGH" as const,
      confidence: 0.91,
      explanation: "High-confidence identity continuity pattern indicating phone number replacement by the same subject.",
      evidence: [
        "Sudden drop in PH005 call activity followed by activation of PH015",
        "Both identifiers called identical contact network (PH001) from cell tower TOWER_101",
      ],
      involvedEntities: ["P005", "PH005", "PH015"],
      timestamps: ["2026-01-10T11:00:00", "2026-01-12T15:30:00"],
    },
    {
      id: "PAT-006",
      title: "Post-Incident Temporal Escalation",
      type: "TEMPORAL_BEFORE_AFTER_CHANGE",
      severity: "CRITICAL" as const,
      confidence: 0.97,
      explanation: "Immediate post-incident escalation in communication frequency, transaction values, and movement range.",
      evidence: [
        "Communication burst: 25 calls post-event vs 2 calls baseline before event",
        "Transaction surge: ₹450,000 post-event vs ₹10,000 baseline",
      ],
      involvedEntities: ["P010", "PH010", "ACC010", "EVT010"],
      timestamps: ["2026-01-15T12:00:00"],
    },
  ];

  // Derive filter dimension dropdown values
  const availableCommunities = Array.from(
    new Set((graph?.nodes || []).map((n) => (n.communityId != null ? String(n.communityId) : "1"))),
  );
  const availableEntityTypes = Array.from(new Set((graph?.nodes || []).map((n) => n.type)));
  const availableStates = Array.from(
    new Set(
      jurisdictionAlerts.flatMap((j) => [j.fromState, j.toState]).filter(Boolean),
    ),
  );
  const availablePatternTypes = Array.from(new Set(patternLeads.map((p) => p.type)));

  // Filter datasets dynamically based on global filters
  const filteredNodes = (graph?.nodes || []).filter((node) => {
    if (filters.communityId && String(node.communityId) !== filters.communityId) return false;
    if (filters.entityType && node.type.toLowerCase() !== filters.entityType.toLowerCase())
      return false;
    return true;
  });

  const filteredGraph = graph ? { ...graph, nodes: filteredNodes } : null;

  const filteredPatterns = patternLeads.filter((p) => {
    if (filters.severity && p.severity !== filters.severity) return false;
    if (filters.patternType && p.type !== filters.patternType) return false;
    return true;
  });

  const filteredJurisdictions = jurisdictionAlerts.filter((j) => {
    if (filters.state && j.fromState !== filters.state && j.toState !== filters.state)
      return false;
    return true;
  });

  // Cross-component navigation handlers
  const handleInvestigateEntity = async (entityId: string) => {
    await selectMatch(entityId);
    setWorkspaceFocus("investigation");
  };

  const handleOpenGraph = () => {
    setWorkspaceFocus("investigation");
  };

  const handleOpenMap = () => {
    setWorkspaceFocus("map");
  };

  // Navigation tabs config
  const TABS: { id: AnalyticsTab; label: string; icon: typeof BarChart3 }[] = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "network", label: "Network", icon: Network },
    { id: "temporal", label: "Temporal", icon: Activity },
    { id: "identity", label: "Identity", icon: Fingerprint },
    { id: "jurisdiction", label: "Jurisdiction", icon: MapPin },
    { id: "patterns", label: "Patterns", icon: Zap },
    { id: "evidence", label: "Evidence", icon: FileText },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-[#090D12] p-6 text-slate-200 font-mono">
      {/* 1. HEADER */}
      <div className="mb-4 flex shrink-0 flex-col gap-1 border-b border-[#26303C] pb-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#5B7FA8] uppercase font-semibold">
          <BarChart3 className="h-4 w-4 text-[#5B7FA8]" />
          <span>FORENSIC ANALYTICS & VISUAL INTELLIGENCE WORKSPACE</span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span className="text-slate-500 font-normal">SHADOW-NET SPECIFICATION</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-slate-100">
            Investigation Analytics Control Surface
          </h1>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span>Focal Subject:</span>
            <span className="rounded border border-[#26303C] bg-[#10151D] px-2 py-0.5 font-bold text-slate-200">
              {investigation?.focalLabel || investigation?.focalEntityId || "P001"}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Integrated forensic intelligence dashboard providing multi-dimensional graph, temporal, identity continuity, cross-jurisdiction corridor, and 6-W explainable evidence insights.
        </p>
      </div>

      {/* 2. PERSISTENT GLOBAL FILTER BAR */}
      <div className="mb-4">
        <AnalyticsFilterBar
          filters={filters}
          onFilterChange={setFilters}
          availableCommunities={availableCommunities}
          availableEntityTypes={availableEntityTypes}
          availableStates={availableStates}
          availablePatternTypes={availablePatternTypes}
        />
      </div>

      {/* 3. ANALYTICS TABS NAVIGATION BAR */}
      <div className="mb-6 flex border border-[#26303C] bg-[#10151D] p-1 rounded-md">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded py-2 text-xs font-semibold tracking-wider transition-colors uppercase",
                isActive
                  ? "bg-[#26303C] text-slate-100 border border-[#3E4C5E]"
                  : "text-slate-400 hover:bg-[#1A232E] hover:text-slate-200"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. ACTIVE TAB CONTENT RENDERER */}
      <div className="flex-1">
        {activeTab === "overview" && (
          <OverviewTab
            investigation={investigation}
            graph={filteredGraph}
            jurisdictionAlerts={filteredJurisdictions}
            continuityAlerts={continuityAlerts}
            patternLeads={filteredPatterns}
            onInvestigateEntity={handleInvestigateEntity}
            onOpenGraph={handleOpenGraph}
            onOpenDetailModal={openModal}
          />
        )}

        {activeTab === "network" && (
          <NetworkTab
            graph={filteredGraph}
            onInvestigateEntity={handleInvestigateEntity}
            onOpenGraph={handleOpenGraph}
          />
        )}

        {activeTab === "temporal" && (
          <TemporalTab
            timelineEvents={timelineEvents}
            whatChanged={whatChanged}
          />
        )}

        {activeTab === "identity" && (
          <IdentityTab
            continuityAlerts={continuityAlerts}
            onInvestigateEntity={handleInvestigateEntity}
          />
        )}

        {activeTab === "jurisdiction" && (
          <JurisdictionTab
            jurisdictionAlerts={filteredJurisdictions}
            onOpenMap={handleOpenMap}
          />
        )}

        {activeTab === "patterns" && (
          <PatternsTab
            patterns={filteredPatterns}
            onInvestigateEntity={handleInvestigateEntity}
            onOpenDetailModal={openModal}
          />
        )}

        {activeTab === "evidence" && (
          <EvidenceTab
            evidence={evidence}
            onInvestigateEntity={handleInvestigateEntity}
            onOpenMap={handleOpenMap}
          />
        )}
      </div>

      {/* 5. REUSABLE DETAIL INSPECTION MODAL */}
      <AnalyticsDetailModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        onClose={closeModal}
      >
        {modalState.content}
      </AnalyticsDetailModal>
    </div>
  );
}

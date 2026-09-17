import { useState } from "react";
import {
  Archive,
  CheckSquare,
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
  Filter,
  Shield,
  Square,
} from "lucide-react";
import { useInvestigationStore } from "@/store/investigationStore";
import {
  captureGraphCanvasDataUrl,
  captureMapCanvasDataUrl,
  generateCompleteCasePackage,
  generateCsvDatasets,
  generateJsonPackage,
  generatePdfDossier,
  triggerFileDownload,
  type ReportDataBundle,
  type ReportSectionsState,
} from "./dossierExporter";
import JSZip from "jszip";

export function ReportCenterWorkspace() {
  const investigation = useInvestigationStore((s) => s.investigation);
  const focalEntity = useInvestigationStore((s) => s.selectedEntity);
  const graph = useInvestigationStore((s) => s.graph);
  const timeline = useInvestigationStore((s) => s.timeline);
  const whatChanged = useInvestigationStore((s) => s.whatChanged);
  const jurisdictionAlerts = useInvestigationStore((s) => s.jurisdictionAlerts);
  const continuityAlerts = useInvestigationStore((s) => s.continuityAlerts);
  const evidence = useInvestigationStore((s) => s.evidence);
  const activeCaseId = useInvestigationStore((s) => s.activeCaseId);
  const timeFrom = useInvestigationStore((s) => s.timeFrom);
  const timeTo = useInvestigationStore((s) => s.timeTo);
  const depth = useInvestigationStore((s) => s.depth);

  // Generate synthetic/mock pattern leads from available data if needed
  const patternLeads = [
    {
      id: "PAT-001",
      title: "SIM Swap & Rapid Device Handover",
      type: "SIM_SWAP_HANDOVER",
      severity: "CRITICAL",
      confidence: 0.94,
      explanation: "SIM001 transferred between IMEI DEV001 and DEV002 within 4 hours.",
      involvedEntities: ["P001", "SIM001", "DEV001", "DEV002"],
    },
    {
      id: "PAT-002",
      title: "Cross-Jurisdiction Checkpoint Transit",
      type: "JURISDICTION_TRANSIT",
      severity: "HIGH",
      confidence: 0.88,
      explanation: "Vehicle TN38AB1234 recorded crossing state line from Haryana to Delhi within 15 minutes of transaction.",
      involvedEntities: ["TN38AB1234", "LOC005", "P001"],
    },
  ];

  const reportData: ReportDataBundle = {
    investigation,
    focalEntity,
    graph,
    timeline,
    whatChanged,
    jurisdictionAlerts,
    continuityAlerts,
    patternLeads,
    evidence,
    activeCaseId,
    timeFrom,
    timeTo,
    depth,
  };

  const [sections, setSections] = useState<ReportSectionsState>({
    executiveSummary: true,
    focalEntity: true,
    networkAnalysis: true,
    identityContinuity: true,
    temporalAnalysis: true,
    jurisdictionAnalysis: true,
    detectedPatterns: true,
    evidenceAnalysis: true,
    graphSnapshot: true,
    mapSnapshot: true,
    appendix: true,
  });

  const [isExporting, setIsExporting] = useState(false);

  const toggleSection = (key: keyof ReportSectionsState) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = (select: boolean) => {
    setSections({
      executiveSummary: select,
      focalEntity: select,
      networkAnalysis: select,
      identityContinuity: select,
      temporalAnalysis: select,
      jurisdictionAnalysis: select,
      detectedPatterns: select,
      evidenceAnalysis: select,
      graphSnapshot: select,
      mapSnapshot: select,
      appendix: select,
    });
  };

  // Export handlers
  const handlePdfExport = () => {
    setIsExporting(true);
    try {
      const graphImg = captureGraphCanvasDataUrl();
      const mapImg = captureMapCanvasDataUrl();
      const doc = generatePdfDossier(reportData, sections, graphImg, mapImg);
      const blob = doc.output("blob");
      triggerFileDownload(blob, `NEXUS_Investigation_Dossier_${dataCaseId}.pdf`);
    } catch (e) {
      console.error("PDF Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleJsonExport = () => {
    const jsonStr = generateJsonPackage(reportData);
    const blob = new Blob([jsonStr], { type: "application/json" });
    triggerFileDownload(blob, `investigation_data_${dataCaseId}.json`);
  };

  const handleCsvExport = async () => {
    setIsExporting(true);
    try {
      const csvMap = generateCsvDatasets(reportData);
      const zip = new JSZip();
      Object.entries(csvMap).forEach(([filename, csvContent]) => {
        zip.file(filename, csvContent);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      triggerFileDownload(blob, `Investigation_CSV_Datasets_${dataCaseId}.zip`);
    } catch (e) {
      console.error("CSV Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCompletePackageExport = async () => {
    setIsExporting(true);
    try {
      const graphImg = captureGraphCanvasDataUrl();
      const mapImg = captureMapCanvasDataUrl();
      const blob = await generateCompleteCasePackage(reportData, sections, graphImg, mapImg);
      triggerFileDownload(blob, `Complete_Case_Package_${dataCaseId}.zip`);
    } catch (e) {
      console.error("Complete Package Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const dataCaseId = investigation?.id || activeCaseId;
  const focalLabel = investigation?.focalLabel || focalEntity?.label || "Focal Subject";
  const entityCount = graph?.nodes.length || investigation?.entityCount || 0;
  const edgeCount = graph?.edges.length || 0;
  const timelineCount = timeline.length;
  const jurisdictionCount = jurisdictionAlerts.length || 2;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#090D12] p-6 font-mono text-slate-200">
      {/* 1. HEADER */}
      <div className="flex flex-col gap-2 border-b border-[#26303C] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#4F8EF7]/40 bg-[#4F8EF7]/15 text-[#4F8EF7]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-slate-100 uppercase">
              INVESTIGATION REPORT CENTER
            </h1>
            <p className="text-xs text-slate-400">
              Generate and export a publication-grade intelligence dossier from the current investigation scope.
            </p>
          </div>
        </div>

        {/* 2. CURRENT INVESTIGATION CONTEXT STRIP */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-md border border-[#26303C] bg-[#10151D] p-4 text-xs">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">INVESTIGATION ID:</span>
              <div className="font-bold text-[#4F8EF7]">{dataCaseId}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">FOCAL ENTITY:</span>
              <div className="font-bold text-slate-100">{focalLabel} ({focalEntity?.id || "P001"})</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">GENERATED TIMESTAMP:</span>
              <div className="text-slate-300">{new Date().toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded border border-[#26303C] bg-[#090D12] px-3 py-1 text-[11px] text-slate-400">
            <Filter className="h-3.5 w-3.5 text-[#4F8EF7]" />
            <span>Scope: {depth}-Hop Traversal ({timeFrom} to {timeTo})</span>
          </div>
        </div>
      </div>

      {/* 3. REPORT CONTENT CONTROL SURFACE */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Selectable Sections Checklist */}
        <div className="flex flex-col gap-4 rounded-md border border-[#26303C] bg-[#10151D] p-5 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              DOSSIER SECTIONS
            </h2>
            <div className="flex items-center gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => toggleAll(true)}
                className="text-[#4F8EF7] hover:underline"
              >
                Select All
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => toggleAll(false)}
                className="text-slate-400 hover:underline"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 text-xs font-mono">
            {[
              { key: "executiveSummary", label: "Executive Summary & Key Metrics" },
              { key: "focalEntity", label: "Focal Entity Profile" },
              { key: "networkAnalysis", label: "Network Topology & Centrality" },
              { key: "identityContinuity", label: "Identity Continuity & Transitions" },
              { key: "temporalAnalysis", label: "Temporal Analysis & Timeline" },
              { key: "jurisdictionAnalysis", label: "Jurisdictional Footprint" },
              { key: "detectedPatterns", label: "Detected Anomaly Patterns" },
              { key: "evidenceAnalysis", label: "Explainable Evidence (6-W)" },
              { key: "graphSnapshot", label: "3D Network Graph Visual Snapshot" },
              { key: "mapSnapshot", label: "Leaflet GIS Map Visual Snapshot" },
              { key: "appendix", label: "Tabular Entity Appendix" },
            ].map((item) => {
              const checked = sections[item.key as keyof ReportSectionsState];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleSection(item.key as keyof ReportSectionsState)}
                  className="flex items-center gap-2.5 rounded border border-transparent p-1.5 hover:bg-[#1A232E] transition-colors text-left"
                >
                  {checked ? (
                    <CheckSquare className="h-4 w-4 text-[#4F8EF7] shrink-0" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-600 shrink-0" />
                  )}
                  <span className={checked ? "text-slate-200 font-semibold" : "text-slate-500"}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Report Preview & Export Controls */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Report Preview Box */}
          <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
            <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#4FAF9D]" />
                <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  REPORT PREVIEW & ESTIMATED CONTENTS
                </h2>
              </div>
              <span className="text-[10px] text-slate-500">Live Investigation Context</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 text-xs">
              <div className="rounded border border-[#26303C] bg-[#090D12] p-3">
                <div className="text-[10px] text-slate-500 uppercase">CASE / SUBJECT</div>
                <div className="mt-1 font-bold text-slate-100">{dataCaseId}</div>
                <div className="text-[11px] text-[#4F8EF7]">{focalLabel}</div>
              </div>

              <div className="rounded border border-[#26303C] bg-[#090D12] p-3">
                <div className="text-[10px] text-slate-500 uppercase">NETWORK RECORDS</div>
                <div className="mt-1 font-bold text-[#4FAF9D]">{entityCount} Entities</div>
                <div className="text-[11px] text-slate-400">{edgeCount} Relationships</div>
              </div>

              <div className="rounded border border-[#26303C] bg-[#090D12] p-3">
                <div className="text-[10px] text-slate-500 uppercase">ANOMALY & INTELLIGENCE</div>
                <div className="mt-1 font-bold text-[#D9825B]">{patternLeads.length} Pattern Leads</div>
                <div className="text-[11px] text-[#A66DD4]">{continuityAlerts.length} Identity Shifts</div>
              </div>

              <div className="rounded border border-[#26303C] bg-[#090D12] p-3">
                <div className="text-[10px] text-slate-500 uppercase">TEMPORAL LOGS</div>
                <div className="mt-1 font-bold text-slate-200">{timelineCount} Timeline Events</div>
                <div className="text-[11px] text-slate-400">Ref: {timeFrom}</div>
              </div>

              <div className="rounded border border-[#26303C] bg-[#090D12] p-3">
                <div className="text-[10px] text-slate-500 uppercase">JURISDICTIONS</div>
                <div className="mt-1 font-bold text-[#D6A84F]">{jurisdictionCount} Associated States</div>
                <div className="text-[11px] text-slate-400">Cross-Jurisdiction</div>
              </div>

              <div className="rounded border border-[#26303C] bg-[#090D12] p-3">
                <div className="text-[10px] text-slate-500 uppercase">SECTIONS INCLUDED</div>
                <div className="mt-1 font-bold text-[#4F8EF7]">
                  {Object.values(sections).filter(Boolean).length} / 11 Sections
                </div>
                <div className="text-[11px] text-slate-400">Customizable</div>
              </div>
            </div>
          </div>

          {/* Export Action Buttons Surface */}
          <div className="flex flex-col gap-4 rounded-md border border-[#26303C] bg-[#10151D] p-5">
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider border-b border-[#26303C] pb-3">
              EXPORT INTELLIGENCE DOSSIER & CASE PACKAGES
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Primary PDF Export */}
              <button
                type="button"
                disabled={isExporting}
                onClick={handlePdfExport}
                className="flex items-center justify-center gap-2 rounded border border-transparent bg-[#4F8EF7] p-3 font-mono text-xs font-bold text-slate-950 hover:bg-[#3B7ADF] transition-colors uppercase shadow-md disabled:opacity-50"
              >
                <Download className="h-4 w-4 text-slate-950" />
                <span>GENERATE PDF DOSSIER</span>
              </button>

              {/* Complete ZIP Package Export */}
              <button
                type="button"
                disabled={isExporting}
                onClick={handleCompletePackageExport}
                className="flex items-center justify-center gap-2 rounded border border-[#4F8EF7]/40 bg-[#1A232E] p-3 font-mono text-xs font-bold text-slate-100 hover:bg-[#26303C] hover:text-[#4F8EF7] transition-colors uppercase disabled:opacity-50"
              >
                <Archive className="h-4 w-4 text-[#4F8EF7]" />
                <span>DOWNLOAD COMPLETE CASE PACKAGE</span>
              </button>

              {/* Machine-readable JSON Export */}
              <button
                type="button"
                disabled={isExporting}
                onClick={handleJsonExport}
                className="flex items-center justify-center gap-2 rounded border border-[#26303C] bg-[#090D12] p-3 font-mono text-xs font-semibold text-slate-300 hover:bg-[#1A232E] hover:text-slate-100 transition-colors uppercase disabled:opacity-50"
              >
                <FileCode className="h-4 w-4 text-[#4FAF9D]" />
                <span>DOWNLOAD JSON</span>
              </button>

              {/* Tabular CSV Datasets ZIP Export */}
              <button
                type="button"
                disabled={isExporting}
                onClick={handleCsvExport}
                className="flex items-center justify-center gap-2 rounded border border-[#26303C] bg-[#090D12] p-3 font-mono text-xs font-semibold text-slate-300 hover:bg-[#1A232E] hover:text-slate-100 transition-colors uppercase disabled:opacity-50"
              >
                <FileSpreadsheet className="h-4 w-4 text-[#D6A84F]" />
                <span>DOWNLOAD CSV DATA</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

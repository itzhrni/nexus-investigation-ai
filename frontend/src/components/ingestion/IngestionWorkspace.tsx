import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Database,
  FileText,
  Loader2,
  Table,
  Upload,
  UserCheck,
} from "lucide-react";
import { api } from "@/api/client";
import { useInvestigationStore } from "@/store/investigationStore";
import type {
  AnalyzeVisionResponse,
  IngestCsvResponse,
  IngestFirResponse,
} from "@/types/nexus";
import { cn } from "@/lib/cn";

type IngestionTab = "fir" | "csv" | "vision";

const SAMPLE_FIR_TEXT = `FIRST INFORMATION REPORT (FIR #2026-0819)
Station: Central PS | State: Delhi

STATEMENT:
During ongoing intelligence operations, suspect Aarav Sharma (P001) was observed operating phone number +919810012345 registered with SIM card SIM001. Field surveillance confirmed that vehicle TN38AB1234 (White Toyota Fortuner) was sighted at Location LOC005 (Checkpoint Alpha).

Subsequent financial tracing revealed wire transfers originating from account ACC001 to beneficiary Priya Verma (P002). Devices DEV001 and DEV002 were identified as primary communication nodes.`;

export function IngestionWorkspace() {
  const [activeTab, setActiveTab] = useState<IngestionTab>("fir");
  const selectMatch = useInvestigationStore((s) => s.selectMatch);

  // FIR State
  const [firTitle, setFirTitle] = useState("Police FIR Report #2026-0819");
  const [firStation, setFirStation] = useState("Central PS");
  const [firText, setFirText] = useState("");
  const [firLoading, setFirLoading] = useState(false);
  const [firError, setFirError] = useState<string | null>(null);
  const [firResult, setFirResult] = useState<IngestFirResponse | null>(null);

  // CSV State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvResult, setCsvResult] = useState<IngestCsvResponse | null>(null);

  // Vision State
  const [visionFile, setVisionFile] = useState<File | null>(null);
  const [visionLocation, setVisionLocation] = useState("LOC005");
  const [visionPreview, setVisionPreview] = useState<string | null>(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionError, setVisionError] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<AnalyzeVisionResponse | null>(null);

  // Handlers
  const handleFirSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firText.trim()) return;
    setFirLoading(true);
    setFirError(null);
    try {
      const res = await api.ingestFir(firText, firTitle, firStation);
      setFirResult(res);
    } catch (err: any) {
      setFirError(err?.message || "Failed to process FIR text extraction.");
    } finally {
      setFirLoading(false);
    }
  };

  const handleCsvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;
    setCsvLoading(true);
    setCsvError(null);
    try {
      const res = await api.ingestCsv(csvFile);
      setCsvResult(res);
    } catch (err: any) {
      setCsvError(err?.message || "Failed to upload and ingest CSV dataset.");
    } finally {
      setCsvLoading(false);
    }
  };

  const handleVisionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVisionFile(file);
      setVisionPreview(URL.createObjectURL(file));
      setVisionResult(null);
    }
  };

  const handleVisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visionFile) return;
    setVisionLoading(true);
    setVisionError(null);
    try {
      const res = await api.analyzeVision(visionFile, visionLocation);
      setVisionResult(res);
    } catch (err: any) {
      setVisionError(err?.message || "Failed to analyze surveillance image.");
    } finally {
      setVisionLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-nexus-bg p-6 text-nexus-text">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-nexus-line pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-nexus-cyan/40 bg-nexus-cyan/10">
            <Upload className="h-5 w-5 text-nexus-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide uppercase">
              DATA INGESTION & VISION INTELLIGENCE WORKSPACE
            </h1>
            <p className="text-xs text-nexus-muted">
              Ingest police FIR reports, bulk CDR/financial CSVs, and surveillance image OCR directly into the PostgreSQL entity graph layer.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="mb-6 flex gap-2 border-b border-nexus-line pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("fir")}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold uppercase transition-all",
            activeTab === "fir"
              ? "border border-nexus-cyan/50 bg-nexus-cyan/20 text-nexus-cyan shadow-[0_0_12px_rgba(61,214,245,0.15)]"
              : "border border-transparent bg-nexus-raised/60 text-nexus-muted hover:bg-nexus-raised hover:text-nexus-text",
          )}
        >
          <FileText className="h-4 w-4" />
          1. FIR / Text Report NLP
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("csv")}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold uppercase transition-all",
            activeTab === "csv"
              ? "border border-nexus-cyan/50 bg-nexus-cyan/20 text-nexus-cyan shadow-[0_0_12px_rgba(61,214,245,0.15)]"
              : "border border-transparent bg-nexus-raised/60 text-nexus-muted hover:bg-nexus-raised hover:text-nexus-text",
          )}
        >
          <Table className="h-4 w-4" />
          2. CSV Bulk CDR / Financial Data
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("vision")}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold uppercase transition-all",
            activeTab === "vision"
              ? "border border-nexus-cyan/50 bg-nexus-cyan/20 text-nexus-cyan shadow-[0_0_12px_rgba(61,214,245,0.15)]"
              : "border border-transparent bg-nexus-raised/60 text-nexus-muted hover:bg-nexus-raised hover:text-nexus-text",
          )}
        >
          <Camera className="h-4 w-4" />
          3. Surveillance Image OCR
        </button>
      </div>

      {/* TAB 1: FIR NLP */}
      {activeTab === "fir" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Input Form */}
          <form onSubmit={handleFirSubmit} className="flex flex-col gap-4 rounded-lg border border-nexus-line bg-nexus-raised/60 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-nexus-cyan uppercase">
                Police FIR / Interrogation Text NLP Ingestion
              </h2>
              <button
                type="button"
                onClick={() => setFirText(SAMPLE_FIR_TEXT)}
                className="rounded border border-nexus-cyan/30 bg-nexus-cyan/10 px-2.5 py-1 font-mono text-[10px] text-nexus-cyan hover:bg-nexus-cyan/20"
              >
                LOAD SAMPLE FIR TEXT
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase text-nexus-muted">Report Title</label>
                <input
                  type="text"
                  value={firTitle}
                  onChange={(e) => setFirTitle(e.target.value)}
                  className="w-full rounded border border-nexus-line bg-black/40 px-3 py-1.5 text-xs text-nexus-text outline-none focus:border-nexus-cyan"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase text-nexus-muted">Police Station / Unit</label>
                <input
                  type="text"
                  value={firStation}
                  onChange={(e) => setFirStation(e.target.value)}
                  className="w-full rounded border border-nexus-line bg-black/40 px-3 py-1.5 text-xs text-nexus-text outline-none focus:border-nexus-cyan"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase text-nexus-muted">FIR Document Text Content</label>
              <textarea
                rows={10}
                value={firText}
                onChange={(e) => setFirText(e.target.value)}
                placeholder="Paste raw police FIR report, witness statement, or interrogation text here..."
                className="w-full rounded border border-nexus-line bg-black/40 p-3 font-mono text-xs text-nexus-text outline-none focus:border-nexus-cyan"
              />
            </div>

            {firError && (
              <div className="flex items-center gap-2 rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{firError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={firLoading || !firText.trim()}
              className="flex items-center justify-center gap-2 rounded bg-nexus-cyan py-2.5 font-mono text-xs font-bold text-black uppercase transition-all hover:bg-nexus-cyan/90 disabled:opacity-50"
            >
              {firLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running spaCy / NLP Extraction Pipeline...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Process FIR & Ingest Graph Entities
                </>
              )}
            </button>
          </form>

          {/* Results Area */}
          <div className="flex flex-col gap-4 rounded-lg border border-nexus-line bg-nexus-raised/60 p-5">
            <h2 className="text-sm font-semibold tracking-wide text-nexus-cyan uppercase">
              Extraction Results & Graph Topology
            </h2>

            {!firResult && !firLoading && (
              <div className="flex flex-1 flex-col items-center justify-center rounded border border-dashed border-nexus-line p-8 text-center text-nexus-muted">
                <FileText className="mb-2 h-10 w-10 opacity-40 text-nexus-cyan" />
                <p className="text-xs">No FIR processed yet.</p>
                <p className="mt-1 text-[10px] text-nexus-muted/70">
                  Enter or load FIR text on the left and click Process FIR to extract entities and relationship triples.
                </p>
              </div>
            )}

            {firLoading && (
              <div className="flex flex-1 flex-col items-center justify-center rounded border border-nexus-line p-8 text-center">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-nexus-cyan" />
                <p className="font-mono text-xs font-semibold text-nexus-cyan">ENTITIES & RELATIONSHIPS EXTRACTION IN PROGRESS</p>
                <p className="mt-1 text-[10px] text-nexus-muted">Normalizing identifiers and writing triples to entity_relationships...</p>
              </div>
            )}

            {firResult && (
              <div className="flex flex-col gap-4">
                {/* Summary Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded border border-nexus-line bg-black/40 p-3 text-center">
                    <div className="font-mono text-lg font-bold text-nexus-cyan">
                      {firResult.extracted_entities.length}
                    </div>
                    <div className="text-[10px] uppercase text-nexus-muted">ENTITIES</div>
                  </div>
                  <div className="rounded border border-nexus-line bg-black/40 p-3 text-center">
                    <div className="font-mono text-lg font-bold text-emerald-400">
                      {firResult.extracted_relationships.length}
                    </div>
                    <div className="text-[10px] uppercase text-nexus-muted">RELATIONSHIPS</div>
                  </div>
                  <div className="rounded border border-nexus-line bg-black/40 p-3 text-center">
                    <div className="font-mono text-lg font-bold text-amber-400">
                      {(firResult.overall_confidence * 100).toFixed(0)}%
                    </div>
                    <div className="text-[10px] uppercase text-nexus-muted">NLP CONFIDENCE</div>
                  </div>
                </div>

                {/* Extracted Entities List */}
                <div>
                  <h3 className="mb-2 font-mono text-xs font-semibold text-nexus-text uppercase">
                    Extracted Entities ({firResult.extracted_entities.length})
                  </h3>
                  <div className="max-h-48 overflow-y-auto flex flex-col gap-2 rounded border border-nexus-line bg-black/30 p-2">
                    {firResult.extracted_entities.map((e, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded border border-nexus-line bg-nexus-raised/80 px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-nexus-cyan/20 px-2 py-0.5 font-mono text-[10px] font-bold text-nexus-cyan uppercase">
                            {e.entity_type}
                          </span>
                          <span className="font-semibold text-nexus-text">{e.label}</span>
                          <span className="font-mono text-[10px] text-nexus-muted">({e.id})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => void selectMatch(e.id)}
                          className="flex items-center gap-1 rounded bg-nexus-cyan/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-nexus-cyan hover:bg-nexus-cyan/30"
                        >
                          Investigate
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extracted Relationships List */}
                <div>
                  <h3 className="mb-2 font-mono text-xs font-semibold text-nexus-text uppercase">
                    Extracted Relationships ({firResult.extracted_relationships.length})
                  </h3>
                  <div className="max-h-44 overflow-y-auto flex flex-col gap-2 rounded border border-nexus-line bg-black/30 p-2">
                    {firResult.extracted_relationships.map((r, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded border border-nexus-line bg-nexus-raised/80 px-3 py-2 font-mono text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-nexus-cyan">{r.source_entity_id}</span>
                          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                            {r.relationship_type}
                          </span>
                          <span className="text-emerald-400">{r.target_entity_id}</span>
                        </div>
                        <span className="text-[10px] text-nexus-muted">
                          {(r.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CSV BULK INGESTION */}
      {activeTab === "csv" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form onSubmit={handleCsvSubmit} className="flex flex-col gap-4 rounded-lg border border-nexus-line bg-nexus-raised/60 p-5">
            <h2 className="text-sm font-semibold tracking-wide text-nexus-cyan uppercase">
              Bulk CDR & Financial CSV File Ingestion
            </h2>

            <p className="text-xs text-nexus-muted">
              Upload call detail records (CDR), bank account ledger statements, or location movement logs in standard CSV format.
            </p>

            <div className="rounded-lg border border-dashed border-nexus-cyan/40 bg-black/40 p-8 text-center transition-all hover:border-nexus-cyan">
              <Table className="mx-auto mb-3 h-10 w-10 text-nexus-cyan opacity-80" />
              <input
                type="file"
                accept=".csv"
                id="csv-file-input"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setCsvFile(file);
                  setCsvResult(null);
                }}
                className="hidden"
              />
              <label
                htmlFor="csv-file-input"
                className="inline-flex cursor-pointer items-center gap-2 rounded bg-nexus-cyan/20 px-4 py-2 font-mono text-xs font-semibold text-nexus-cyan hover:bg-nexus-cyan/30"
              >
                <Upload className="h-4 w-4" />
                Select CSV File
              </label>

              {csvFile && (
                <div className="mt-3 font-mono text-xs text-emerald-400">
                  Selected File: <span className="font-bold">{csvFile.name}</span> ({(csvFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            {csvError && (
              <div className="flex items-center gap-2 rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{csvError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={csvLoading || !csvFile}
              className="flex items-center justify-center gap-2 rounded bg-nexus-cyan py-2.5 font-mono text-xs font-bold text-black uppercase transition-all hover:bg-nexus-cyan/90 disabled:opacity-50"
            >
              {csvLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingesting Dataset into PostgreSQL...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Upload & Ingest CSV Dataset
                </>
              )}
            </button>
          </form>

          {/* CSV Results */}
          <div className="flex flex-col gap-4 rounded-lg border border-nexus-line bg-nexus-raised/60 p-5">
            <h2 className="text-sm font-semibold tracking-wide text-nexus-cyan uppercase">
              Ingestion Statistics & Entity Resolution
            </h2>

            {!csvResult && !csvLoading && (
              <div className="flex flex-1 flex-col items-center justify-center rounded border border-dashed border-nexus-line p-8 text-center text-nexus-muted">
                <Table className="mb-2 h-10 w-10 opacity-40 text-nexus-cyan" />
                <p className="text-xs">No CSV dataset ingested yet.</p>
                <p className="mt-1 text-[10px] text-nexus-muted/70">
                  Select a CSV file on the left and click Upload to populate entities and relationship edges.
                </p>
              </div>
            )}

            {csvLoading && (
              <div className="flex flex-1 flex-col items-center justify-center rounded border border-nexus-line p-8 text-center">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-nexus-cyan" />
                <p className="font-mono text-xs font-semibold text-nexus-cyan">PARSING CSV & WRITING GRAPH RECORDS</p>
                <p className="mt-1 text-[10px] text-nexus-muted">Resolving duplicate entities and inserting triples into Supabase PostgreSQL...</p>
              </div>
            )}

            {csvResult && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 rounded border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <div>
                    <div className="font-mono text-xs font-bold uppercase">Ingestion Successful!</div>
                    <div className="text-[11px]">Records have been normalized and added to the PostgreSQL graph layer.</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded border border-nexus-line bg-black/40 p-4 text-center">
                    <div className="font-mono text-xl font-bold text-nexus-cyan">
                      {csvResult.records_processed}
                    </div>
                    <div className="text-[10px] uppercase text-nexus-muted">RECORDS PROCESSED</div>
                  </div>
                  <div className="rounded border border-nexus-line bg-black/40 p-4 text-center">
                    <div className="font-mono text-xl font-bold text-emerald-400">
                      {csvResult.entities_created}
                    </div>
                    <div className="text-[10px] uppercase text-nexus-muted">ENTITIES CREATED</div>
                  </div>
                  <div className="rounded border border-nexus-line bg-black/40 p-4 text-center">
                    <div className="font-mono text-xl font-bold text-amber-400">
                      {csvResult.relationships_created}
                    </div>
                    <div className="text-[10px] uppercase text-nexus-muted">RELATIONSHIPS CREATED</div>
                  </div>
                  <div className="rounded border border-nexus-line bg-black/40 p-4 text-center">
                    <div className="font-mono text-xl font-bold text-cyan-400">
                      {csvResult.duplicates_resolved}
                    </div>
                    <div className="text-[10px] uppercase text-nexus-muted">DUPLICATES RESOLVED</div>
                  </div>
                </div>

                {csvResult.warnings && csvResult.warnings.length > 0 && (
                  <div className="rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                    <div className="font-mono font-bold uppercase mb-1">Warnings ({csvResult.warnings.length})</div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      {csvResult.warnings.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SURVEILLANCE IMAGE OCR */}
      {activeTab === "vision" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Vision Form */}
          <form onSubmit={handleVisionSubmit} className="flex flex-col gap-4 rounded-lg border border-nexus-line bg-nexus-raised/60 p-5">
            <h2 className="text-sm font-semibold tracking-wide text-nexus-cyan uppercase">
              Surveillance Camera OCR & License Plate Lookup
            </h2>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase text-nexus-muted">
                  Checkpoint / Sighting Location ID
                </label>
                <input
                  type="text"
                  value={visionLocation}
                  onChange={(e) => setVisionLocation(e.target.value)}
                  placeholder="e.g. LOC005"
                  className="w-full rounded border border-nexus-line bg-black/40 px-3 py-1.5 font-mono text-xs text-nexus-text outline-none focus:border-nexus-cyan"
                />
              </div>
            </div>

            {/* Image Dropzone */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-nexus-cyan/40 bg-black/40 p-6 transition-all hover:border-nexus-cyan">
              {visionPreview ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={visionPreview}
                    alt="Surveillance Sighting"
                    className="max-h-48 rounded border border-nexus-line object-contain shadow-lg"
                  />
                  <label
                    htmlFor="vision-file-input"
                    className="cursor-pointer font-mono text-[10px] text-nexus-cyan hover:underline"
                  >
                    Change Image
                  </label>
                </div>
              ) : (
                <>
                  <Camera className="mb-2 h-10 w-10 text-nexus-cyan opacity-80" />
                  <label
                    htmlFor="vision-file-input"
                    className="inline-flex cursor-pointer items-center gap-2 rounded bg-nexus-cyan/20 px-4 py-2 font-mono text-xs font-semibold text-nexus-cyan hover:bg-nexus-cyan/30"
                  >
                    <Upload className="h-4 w-4" />
                    Select Vehicle Photo
                  </label>
                  <p className="mt-2 text-[10px] text-nexus-muted">
                    Supports JPG, PNG (ANPR / surveillance camera capture)
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                id="vision-file-input"
                onChange={handleVisionFileChange}
                className="hidden"
              />
            </div>

            {visionError && (
              <div className="flex items-center gap-2 rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{visionError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={visionLoading || !visionFile}
              className="flex items-center justify-center gap-2 rounded bg-nexus-cyan py-2.5 font-mono text-xs font-bold text-black uppercase transition-all hover:bg-nexus-cyan/90 disabled:opacity-50"
            >
              {visionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting OCR & Querying Vehicle Registry...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  Analyze Image & Match Vehicle
                </>
              )}
            </button>
          </form>

          {/* Vision Results */}
          <div className="flex flex-col gap-4 rounded-lg border border-nexus-line bg-nexus-raised/60 p-5">
            <h2 className="text-sm font-semibold tracking-wide text-nexus-cyan uppercase">
              OCR & Investigation Entity Lookup
            </h2>

            {!visionResult && !visionLoading && (
              <div className="flex flex-1 flex-col items-center justify-center rounded border border-dashed border-nexus-line p-8 text-center text-nexus-muted">
                <Camera className="mb-2 h-10 w-10 opacity-40 text-nexus-cyan" />
                <p className="text-xs">No surveillance image uploaded yet.</p>
                <p className="mt-1 text-[10px] text-nexus-muted/70">
                  Select a vehicle photo on the left to extract the license plate and match against owner records.
                </p>
              </div>
            )}

            {visionLoading && (
              <div className="flex flex-1 flex-col items-center justify-center rounded border border-nexus-line p-8 text-center">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-nexus-cyan" />
                <p className="font-mono text-xs font-semibold text-nexus-cyan">RUNNING OCR TEXT EXTRACTION</p>
                <p className="mt-1 text-[10px] text-nexus-muted">Normalizing plate number and querying PostgreSQL Vehicle records...</p>
              </div>
            )}

            {visionResult && (
              <div className="flex flex-col gap-4">
                {/* Detected Plate Badge */}
                <div className="flex items-center justify-between rounded border border-nexus-cyan/50 bg-black/60 p-4">
                  <div>
                    <div className="text-[10px] uppercase text-nexus-muted">DETECTED NUMBER PLATE</div>
                    <div className="font-mono text-2xl font-extrabold tracking-widest text-nexus-cyan">
                      {visionResult.detected_plate || "NO PLATE DETECTED"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-nexus-muted">OCR CONFIDENCE</div>
                    <div className="font-mono text-lg font-bold text-emerald-400">
                      {(visionResult.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Matched Vehicle Details */}
                {visionResult.matched_vehicle ? (
                  <div className="rounded border border-nexus-line bg-nexus-raised/80 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-nexus-cyan uppercase">
                        MATCHED VEHICLE RECORD
                      </span>
                      <button
                        type="button"
                        onClick={() => void selectMatch(visionResult.matched_vehicle!.vehicle_id)}
                        className="flex items-center gap-1 rounded bg-nexus-cyan/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-nexus-cyan hover:bg-nexus-cyan/30"
                      >
                        Investigate in Graph
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      <div>
                        <span className="text-nexus-muted">ID: </span>
                        <span className="text-nexus-text">{visionResult.matched_vehicle.vehicle_id}</span>
                      </div>
                      <div>
                        <span className="text-nexus-muted">Reg No: </span>
                        <span className="text-nexus-text">{visionResult.matched_vehicle.registration_number}</span>
                      </div>
                      <div>
                        <span className="text-nexus-muted">Make: </span>
                        <span className="text-nexus-text">{visionResult.matched_vehicle.make || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-nexus-muted">Model: </span>
                        <span className="text-nexus-text">{visionResult.matched_vehicle.model || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                    No registered vehicle matched plate &quot;{visionResult.detected_plate}&quot;.
                  </div>
                )}

                {/* Matched Owner */}
                {visionResult.owner && (
                  <div className="rounded border border-nexus-line bg-nexus-raised/80 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-nexus-cyan uppercase">
                        REGISTERED OWNER DETAILS
                      </span>
                      <button
                        type="button"
                        onClick={() => void selectMatch(visionResult.owner!.person_id)}
                        className="flex items-center gap-1 rounded bg-nexus-cyan/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-nexus-cyan hover:bg-nexus-cyan/30"
                      >
                        Investigate Owner
                        <UserCheck className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      <div>
                        <span className="text-nexus-muted">Name: </span>
                        <span className="font-semibold text-nexus-text">{visionResult.owner.name}</span>
                      </div>
                      <div>
                        <span className="text-nexus-muted">Person ID: </span>
                        <span className="text-nexus-text">{visionResult.owner.person_id}</span>
                      </div>
                      <div>
                        <span className="text-nexus-muted">State: </span>
                        <span className="text-nexus-text">{visionResult.owner.state || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-nexus-muted">District: </span>
                        <span className="text-nexus-text">{visionResult.owner.district || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Connected Entities */}
                {visionResult.connected_entities && visionResult.connected_entities.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-mono text-xs font-semibold text-nexus-text uppercase">
                      Connected Investigation Entities ({visionResult.connected_entities.length})
                    </h3>
                    <div className="max-h-36 overflow-y-auto flex flex-col gap-2 rounded border border-nexus-line bg-black/30 p-2">
                      {visionResult.connected_entities.map((c, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded border border-nexus-line bg-nexus-raised/80 px-3 py-1.5 font-mono text-[11px]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-nexus-cyan">{c.entity_id}</span>
                            <span className="rounded bg-nexus-cyan/20 px-1.5 py-0.5 text-[9px] text-nexus-cyan">
                              {c.relationship_type}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => void selectMatch(c.entity_id)}
                            className="text-[10px] font-semibold text-nexus-cyan hover:underline"
                          >
                            Jump to Node
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

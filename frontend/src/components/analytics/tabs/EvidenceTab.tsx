import { ArrowRight, FileText, MapPin, ShieldCheck } from "lucide-react";
import type { EvidenceBundle } from "@/types/nexus";

interface EvidenceTabProps {
  evidence: EvidenceBundle | null;
  onInvestigateEntity: (entityId: string) => void;
  onOpenMap: () => void;
}

export function EvidenceTab({ evidence, onInvestigateEntity, onOpenMap }: EvidenceTabProps) {
  const items = evidence?.items || [
    {
      id: "EV-001",
      category: "DIRECT" as const,
      statement: "Core Banking Wire Transfer: ₹450,000 transferred from ACC001 to ACC005.",
      sourceRecords: [{ id: "CBS-01", kind: "Core Banking Switch", label: "Axis Bank Remittance Log" }],
    },
    {
      id: "EV-002",
      category: "CIRCUMSTANTIAL" as const,
      statement: "Cell Tower Co-location: Subscriber SIM001 registered on Tower T101 at 2026-01-15T14:10:00.",
      sourceRecords: [{ id: "CDR-01", kind: "CDR Log", label: "Airtel Tower Registry" }],
    },
    {
      id: "EV-003",
      category: "INFERRED" as const,
      statement: "ALPR Sighting: Vehicle TN38AB1234 spotted at Checkpoint LOC005 within 15 minutes of transaction.",
      sourceRecords: [{ id: "ALPR-01", kind: "Surveillance OCR", label: "Cyber City Camera #4" }],
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-mono text-slate-200">
      {/* 1. 6-W FORENSIC EVIDENCE FRAMEWORK */}
      <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
        <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#6FBF8F]" />
            <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
              A. 6-W EXPLAINABLE EVIDENCE SYSTEM (WHO, WHAT, WHEN, WHERE, WHY, HOW)
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Subject: {evidence?.subjectLabel || "Focal Subject"}</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded border border-[#26303C] bg-[#090D12] p-3 space-y-1">
            <div className="font-bold text-[#4F8EF7] text-xs uppercase">1. WHO (Identified Subjects)</div>
            <p className="text-[11px] text-slate-300">
              Focal Subject P001 (Aarav Sharma), associated account holders ACC001, ACC005, ACC012.
            </p>
          </div>

          <div className="rounded border border-[#26303C] bg-[#090D12] p-3 space-y-1">
            <div className="font-bold text-[#A66DD4] text-xs uppercase">2. WHAT (Specific Events)</div>
            <p className="text-[11px] text-slate-300">
              ₹450,000 wire transfer, SIM card swap from DEV001 to DEV002, vehicle ANPR sighting.
            </p>
          </div>

          <div className="rounded border border-[#26303C] bg-[#090D12] p-3 space-y-1">
            <div className="font-bold text-[#4FAF9D] text-xs uppercase">3. WHEN (Timestamp Range)</div>
            <p className="text-[11px] text-slate-300">
              Primary incident window: 2026-01-05T10:00:00 to 2026-01-18T18:00:00.
            </p>
          </div>

          <div className="rounded border border-[#26303C] bg-[#090D12] p-3 space-y-1">
            <div className="font-bold text-[#D6A84F] text-xs uppercase">4. WHERE (Spatial Jurisdictions)</div>
            <p className="text-[11px] text-slate-300">
              Checkpoint LOC005 (Gurugram), Bandra West PS (Mumbai), Connaught Place PS (Delhi).
            </p>
          </div>

          <div className="rounded border border-[#26303C] bg-[#090D12] p-3 space-y-1">
            <div className="font-bold text-[#D9825B] text-xs uppercase">5. WHY (Pattern Rationale)</div>
            <p className="text-[11px] text-slate-300">
              Evading single IMEI handset tracking and completing rapid circular funds remittance.
            </p>
          </div>

          <div className="rounded border border-[#26303C] bg-[#090D12] p-3 space-y-1">
            <div className="font-bold text-[#C56B91] text-xs uppercase">6. HOW (Modus Operandi)</div>
            <p className="text-[11px] text-slate-300">
              Layered financial transfers, multi-SIM handsets, inter-state vehicle movement.
            </p>
          </div>
        </div>
      </div>

      {/* 2. SUPPORTING EVIDENCE RECORD ITEMS */}
      <div className="flex flex-col rounded-md border border-[#26303C] bg-[#10151D] p-5">
        <div className="flex items-center justify-between border-b border-[#26303C] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#4F8EF7]" />
            <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
              B. VERIFIED EVIDENCE RECORDS & SOURCE LOGS ({items.length})
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-3 font-mono text-xs">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded border border-[#26303C] bg-[#090D12] p-3.5 space-y-2"
            >
              <div className="flex items-center justify-between border-b border-[#26303C] pb-1.5">
                <span className="rounded border border-[#26303C] bg-[#1A232E] px-2 py-0.5 font-semibold text-slate-300 text-[10px]">
                  {item.category} EVIDENCE
                </span>
                <span className="text-[10px] text-slate-500">ID: {item.id}</span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px]">{item.statement}</p>

              {item.sourceRecords && item.sourceRecords.length > 0 && (
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="uppercase font-semibold text-[#4F8EF7]">Source:</span>
                  <span>{item.sourceRecords[0].label} ({item.sourceRecords[0].kind})</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onOpenMap}
                  className="flex items-center gap-1 rounded border border-[#26303C] bg-[#1A232E] px-2.5 py-1 text-[10px] font-semibold text-slate-300 hover:bg-[#26303C] transition-colors uppercase"
                >
                  <MapPin className="h-3 w-3" />
                  View Location on Map
                </button>

                <button
                  type="button"
                  onClick={() => onInvestigateEntity("P001")}
                  className="flex items-center gap-1 rounded border border-[#26303C] bg-[#1A232E] px-2.5 py-1 text-[10px] font-semibold text-slate-200 hover:bg-[#26303C] transition-colors uppercase"
                >
                  <span>Focus in Graph</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

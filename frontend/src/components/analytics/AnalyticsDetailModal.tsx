import { X } from "lucide-react";

interface AnalyticsDetailModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function AnalyticsDetailModal({ isOpen, title, onClose, children }: AnalyticsDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 font-mono">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-md border border-[#26303C] bg-[#10151D] shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#26303C] px-5 py-3.5 bg-[#090D12]">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5B7FA8]" />
            <h2 className="text-xs font-bold tracking-wider text-[#5B7FA8] uppercase">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded border border-[#26303C] bg-[#10151D] text-slate-400 hover:border-slate-600 hover:text-slate-200 transition-colors"
            aria-label="Close detail modal"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-300">{children}</div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-[#26303C] px-5 py-3 bg-[#090D12] text-[10px] text-slate-500">
          <span>NEXUS Forensic Intelligence Detail View</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#26303C] bg-[#1A232E] px-3 py-1 font-semibold text-slate-300 hover:bg-[#26303C] transition-colors uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import { useInvestigationStore } from "@/store/investigationStore";

export function InsightStrip() {
  const investigation = useInvestigationStore((s) => s.investigation);
  const graph = useInvestigationStore((s) => s.graph);
  const items = [
    { label: "Connected entities", value: graph?.nodes.length ?? investigation?.entityCount ?? 0 },
    { label: "Related cases", value: investigation?.caseCount ?? 0 },
    { label: "Jurisdictions", value: investigation?.jurisdictionCount ?? 0 },
    { label: "Identifier transitions", value: investigation?.continuityCount ?? 0 },
    { label: "Key events", value: investigation?.eventCount ?? 0 },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-[120px] rounded-md border border-nexus-line bg-nexus-panel/70 px-3 py-2"
        >
          <div className="font-mono text-lg text-nexus-cyan">{item.value}</div>
          <div className="text-[10px] uppercase tracking-wide text-nexus-muted">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

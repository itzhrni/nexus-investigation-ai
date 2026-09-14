import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { EntityType, EvidenceCategory, RelationshipType } from "@/types/nexus";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ENTITY_COLORS: Record<EntityType, string> = {
  person: "#8EB8FF",
  phone: "#3DD6F5",
  sim: "#5EEAD4",
  device: "#94A3B8",
  vehicle: "#E8C547",
  account: "#34D399",
  location: "#6EE7B7",
  organization: "#A78BFA",
  case: "#F07167",
  event: "#C4B5FD",
};

export const ENTITY_LABELS: Record<EntityType, string> = {
  person: "Person",
  phone: "Phone",
  sim: "SIM",
  device: "Device",
  vehicle: "Vehicle",
  account: "Account",
  location: "Location",
  organization: "Organization",
  case: "Case / FIR",
  event: "Event",
};

export const REL_LABELS: Record<RelationshipType, string> = {
  CALLED: "CALLED",
  TRANSFERRED: "TRANSFERRED",
  MET: "MET",
  OWNS: "OWNS",
  USED: "USED",
  ASSOCIATED_WITH: "ASSOCIATED WITH",
  SEEN_AT: "SEEN AT",
  LOCATED_AT: "LOCATED AT",
  INVOLVED_IN: "INVOLVED IN",
  WORKS_FOR: "WORKS FOR",
  CONNECTED_TO: "CONNECTED TO",
  APPEARED_IN: "APPEARED IN",
};

export const EVIDENCE_LABELS: Record<EvidenceCategory, string> = {
  DIRECT: "Direct evidence",
  CORROBORATED: "Corroborated",
  INFERRED: "Inferred relationship",
  UNVERIFIED: "Unverified hypothesis",
};

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return value;
}

export function confidenceClass(value?: number): string {
  if (value == null) return "text-slate-400";
  if (value >= 80) return "text-emerald-400";
  if (value >= 60) return "text-amber-400";
  return "text-red-400";
}

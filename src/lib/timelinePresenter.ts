/**
 * Timeline presentation formatting and human-readable mappings
 */

export function formatRelationshipLabel(raw?: string): string {
  if (!raw) return "Investigation Event";
  const clean = raw.trim().toUpperCase();

  const map: Record<string, string> = {
    COMMUNICATED_WITH: "Communication",
    CALLED: "Phone Call",
    MESSAGED: "Message",
    COMMUNICATION: "Communication",
    TRANSFERRED_FUNDS: "Financial Transfer",
    TRANSFERRED_MONEY: "Financial Transfer",
    TRANSFERRED: "Financial Transfer",
    CIRCULAR_TRANSACTIONS: "Financial Loop",
    SPOTTED_AT: "Location Sighting",
    SEEN_AT: "Location Sighting",
    VEHICLE_SIGHTING: "Location Sighting",
    "VEHICLE SIGHTING": "Location Sighting",
    LOCATED_AT: "Location",
    LOCATION: "Location Sighting",
    USED_VEHICLE: "Vehicle Association",
    OWNS_VEHICLE: "Vehicle Ownership",
    OWNS_PHONE: "Phone Association",
    OWNS_SIM: "SIM Association",
    USED_IN_DEVICE: "Device Association",
    USED_IDENTIFIER: "Identifier Usage",
    TRANSITIONED_TO_IDENTIFIER: "Identifier Transition",
    CONTINUITY_TRANSITION: "Identifier Transition",
    "IDENTIFIER TRANSITION": "Identifier Transition",
    SIM_DEVICE_SWITCH: "SIM / Device Swap",
    INVOLVED_IN: "Case / Crime",
    NAMES_PERSON: "Named in FIR",
    ASSOCIATED_WITH_FIR: "Case Association",
    ASSOCIATED_WITH: "Association",
    FIR_REGISTRATION: "FIR Registration",
    OCCURRED_AT: "Incident Event",
    CROSS_BORDER_OPERATION: "Cross-Border Activity",
    SPATIAL_TEMPORAL_CONVERGENCE: "Location Convergence",
    INVESTIGATION_ANCHOR: "Investigation Anchor",
    MET: "In-Person Contact",
    WORKS_FOR: "Employment / Affiliation",
    CONNECTED_TO: "Network Connection",
    APPEARED_IN: "Record Appearance",
    OWNS: "Ownership",
    USES_PHONE: "Phone Association",
    USES_SIM: "SIM Association",
    CASE: "Case / Crime",
    CRIME: "Case / Crime",
    CRIME_EVENT: "Case / Crime",
    "CRIME EVENT": "Case / Crime",
  };

  if (map[clean]) return map[clean];

  // Gracefully convert SOME_UNKNOWN_ENUM -> Some Unknown Enum
  return clean
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bEvent\b/gi, "")
    .trim() || "Investigation Event";
}

export function formatTimelineDate(timestampStr: string): { dateStr: string; timeStr?: string } {
  if (!timestampStr) return { dateStr: "N/A" };

  try {
    const d = new Date(timestampStr);
    if (isNaN(d.getTime())) {
      return { dateStr: timestampStr };
    }

    const day = d.getDate();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    const dateStr = `${day} ${month} ${year}`;

    // Extract time if timestamp specifies hour/min
    if (timestampStr.includes("T") || timestampStr.includes(":")) {
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      // Skip if exactly midnight or placeholder noon
      if (!(hours === "00" && minutes === "00") && !(hours === "12" && minutes === "00" && timestampStr.endsWith("12:00:00"))) {
        return { dateStr, timeStr: `${hours}:${minutes}` };
      }
    }

    return { dateStr };
  } catch {
    return { dateStr: timestampStr };
  }
}

export function getCategoryBadge(category: string): { dot: string; text: string; bg: string } {
  const c = category.toLowerCase();
  if (c.includes("communicat") || c.includes("call") || c.includes("message") || c.includes("phone")) {
    return { dot: "bg-nexus-cyan", text: "text-nexus-cyan", bg: "bg-nexus-cyan/10" };
  }
  if (c.includes("financ") || c.includes("transfer") || c.includes("loop") || c.includes("money")) {
    return { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/10" };
  }
  if (c.includes("sight") || c.includes("locat") || c.includes("vehicle") || c.includes("spot")) {
    return { dot: "bg-amber-400", text: "text-amber-400", bg: "bg-amber-500/10" };
  }
  if (c.includes("case") || c.includes("crime") || c.includes("fir") || c.includes("incident")) {
    return { dot: "bg-rose-400", text: "text-rose-400", bg: "bg-rose-500/10" };
  }
  if (c.includes("transition") || c.includes("switch") || c.includes("device") || c.includes("sim")) {
    return { dot: "bg-purple-400", text: "text-purple-400", bg: "bg-purple-500/10" };
  }
  return { dot: "bg-sky-400", text: "text-sky-400", bg: "bg-sky-500/10" };
}

export function formatEventSubtitle(event: {
  title: string;
  description: string;
  entityIds: string[];
}): string {
  const desc = (event.description || "").trim();
  const title = (event.title || "").trim();

  // If description has an amount, prioritize showing it
  if (desc.includes("₹")) {
    return desc;
  }

  // If description has clean arrow format e.g. "P010 → P012"
  if (desc.includes("→") || desc.includes("↔")) {
    return desc;
  }

  // If description has informative text that doesn't just repeat title
  if (desc && desc.toLowerCase() !== title.toLowerCase() && !desc.endsWith(" Event")) {
    return desc;
  }

  // If entityIds has 2 entities, format as source → target
  if (event.entityIds.length >= 2) {
    return `${event.entityIds[0]} → ${event.entityIds[1]}`;
  }

  if (event.entityIds.length === 1) {
    return event.entityIds[0];
  }

  return title;
}

import { api } from "@/api/client";

export function fetchTimeline(focalId: string, from?: string, to?: string) {
  return api.getTimeline({ focalId, from, to });
}

export function fetchWhatChanged(anchorEventId: string) {
  return api.getWhatChanged(anchorEventId);
}

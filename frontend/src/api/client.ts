import { httpAdapter } from "@/api/adapters/httpAdapter";
import { mockAdapter } from "@/api/adapters/mockAdapter";
import type { NexusApi } from "@/api/types";

const mode = import.meta.env.VITE_API_MODE ?? "mock";

export const api: NexusApi = mode === "live" ? httpAdapter : mockAdapter;
export const apiMode = mode === "live" ? "live" : "mock";

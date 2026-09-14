import { httpAdapter } from "@/api/adapters/httpAdapter";
import { mockAdapter } from "@/api/adapters/mockAdapter";
import type { NexusApi } from "@/api/types";

const envMode = (import.meta.env.VITE_API_MODE as string | undefined) ?? "live";
const isMock = envMode === "mock" || envMode === "mock_only";

export const api: NexusApi = isMock ? mockAdapter : httpAdapter;
export const apiMode = isMock ? "mock" : "live";

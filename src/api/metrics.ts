import { API_URL, authHeaders, http } from "./http";
import type { ServerMetricSample } from "../types/admin";

type MetricsHistoryResponse = {
  items: ServerMetricSample[];
};

export async function fetchMetricsHistory(token: string, limit = 120): Promise<ServerMetricSample[]> {
  const res = await http.get<MetricsHistoryResponse>("/admin/metrics/history", {
    params: { limit },
    headers: authHeaders(token),
  });
  return res.data.items;
}

export function openMetricsSocket(token: string) {
  const base = API_URL.replace(/\/api\/?$/, "");
  const wsBase = base.replace(/^http/i, "ws");
  const url = `${wsBase}/ws/metrics?token=${encodeURIComponent(token)}`;
  return new WebSocket(url);
}

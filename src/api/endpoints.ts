import { AiHotApiClient } from './client.js';
import type { ApiItemsResponse, ApiDailyResponse, ApiDailiesResponse } from './types.js';

export async function getItems(
  client: AiHotApiClient,
  opts: { mode?: 'selected' | 'all'; limit?: number; since?: string; category?: string; q?: string; cursor?: string } = {},
): Promise<ApiItemsResponse> {
  const params: Record<string, string> = {};
  if (opts.mode) params.mode = opts.mode;
  if (opts.limit) params.take = String(opts.limit);
  if (opts.since) params.since = opts.since;
  if (opts.category) params.category = opts.category;
  if (opts.q) params.q = opts.q;
  if (opts.cursor) params.cursor = opts.cursor;
  return client.request<ApiItemsResponse>('/api/public/items', params);
}

export async function getDaily(client: AiHotApiClient, date?: string): Promise<ApiDailyResponse> {
  const path = date ? `/api/public/daily/${date}` : '/api/public/daily';
  return client.request<ApiDailyResponse>(path);
}

export async function getDailies(client: AiHotApiClient, take = 30): Promise<ApiDailiesResponse> {
  return client.request<ApiDailiesResponse>('/api/public/dailies', { take: String(take) });
}

import { API_URL } from "../api/http";

export function absoluteMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalized}`;
}

export function assetMediaUrl(assetId?: string | null): string | undefined {
  if (!assetId) return undefined;
  return `${API_URL}/media/assets/${assetId}/content`;
}

export function resolveMediaUrl(path?: string | null, assetId?: string | null): string | undefined {
  return absoluteMediaUrl(path) ?? assetMediaUrl(assetId);
}

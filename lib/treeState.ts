import type { MetricTree } from "@/types";

export function encodeTree(tree: MetricTree): string {
  return btoa(encodeURIComponent(JSON.stringify(tree)));
}

export function decodeTree(encoded: string): MetricTree | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

export function buildShareUrl(tree: MetricTree): string {
  return `${window.location.origin}/tree#state=${encodeTree(tree)}`;
}

export function readTreeFromHash(): MetricTree | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  const match = hash.match(/^#state=(.+)$/);
  if (!match) return null;
  return decodeTree(match[1]);
}

import { LRUCache } from "lru-cache";

export function makeTTLCache<T extends object>(ttlMinutes: number) {
  return new LRUCache<string, T>({
    ttl: ttlMinutes * 60 * 1000,
    max: 5000,
  });
}

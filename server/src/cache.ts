import LRU from "lru-cache";

export function makeTTLCache<T>(ttlMinutes: number) {
  return new LRU<string, T>({
    ttl: ttlMinutes * 60 * 1000,
    max: 5000,
  });
}

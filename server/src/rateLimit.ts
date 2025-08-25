// Tiny IP bucket limiter for Express
import type { Request, Response, NextFunction } from "express";

export function ipRateLimiter(windowMs: number, max: number) {
  const buckets = new Map<string, { count: number; ts: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const b = buckets.get(ip);
    if (!b || now - b.ts > windowMs) {
      buckets.set(ip, { count: 1, ts: now });
      return next();
    }
    if (b.count >= max) {
      res.status(429).json({ error: "rate_limited" });
    } else {
      b.count += 1;
      next();
    }
  };
}

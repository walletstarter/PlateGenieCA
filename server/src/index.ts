import express from "express";
import env from "./env.js";
import { ipRateLimiter } from "./rateLimit.js";
import { checkQuerySchema, suggestBodySchema } from "./schema.js";
import { makeTTLCache } from "./cache.js";
import { BANNED } from "./banned.js";
import { isBannedCandidate } from "./fuzzy.js";
import { hfSuggest, ruleSuggest } from "./generative.js";
import { checkPlateCA } from "./dmv/index.js";

const app = express();
app.use(express.json({ limit: "256kb" }));
app.use(ipRateLimiter(env.RATE_LIMIT_WINDOW_MS, env.RATE_LIMIT_MAX));

const checkCache = makeTTLCache<{ status: string }>(env.CHECK_CACHE_TTL);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: env.CA_DMV_MODE });
});

app.get("/api/check", async (req, res) => {
  const parsed = checkQuerySchema.safeParse({ plate: String(req.query.plate || "").toUpperCase(), state: "CA" });
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { plate } = parsed.data;

  if (isBannedCandidate(plate, BANNED)) {
    return res.json({ plate, state: "CA", availability: "INVALID" });
  }
  const key = `ca:${plate}`;
  const cached = checkCache.get(key);
  if (cached) return res.json({ plate, state: "CA", availability: cached.status });

  const status = await checkPlateCA(plate);
  checkCache.set(key, { status });
  res.json({ plate, state: "CA", availability: status });
});

app.post("/api/suggest", async (req, res) => {
  const parsed = suggestBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { seed, count, constraints } = parsed.data;
  const min = constraints.min ?? 2;
  const max = constraints.max ?? 7;
  const allowNumbers = constraints.allowNumbers ?? true;

  const fromHF = await hfSuggest(seed, count, min, max, allowNumbers);
  // Filter banned
  const filtered = fromHF.filter(p => !isBannedCandidate(p, BANNED)).slice(0, count);

  // If HF path collapsed to ruleSuggest internally, ensure at least count
  let final = filtered;
  if (final.length < count) {
    const extra = ruleSuggest(seed, count * 2, min, max, allowNumbers)
      .filter(p => !isBannedCandidate(p, BANNED));
    final = Array.from(new Set([...filtered, ...extra])).slice(0, count);
  }

  res.json({ seed, suggestions: final });
});

// Serve built SPA in production (optional)
app.use(express.static(new URL("../../web/dist", import.meta.url).pathname));

app.listen(env.PORT, () => {
  console.log(`[api] http://localhost:${env.PORT}  (mode=${env.CA_DMV_MODE})`);
});

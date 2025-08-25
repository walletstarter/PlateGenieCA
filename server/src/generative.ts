import axios from "axios";
import env from "./env.js";

function clampPlate(s: string, min=2, max=7, allowNumbers=true) {
  const up = s.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const filtered = allowNumbers ? up : up.replace(/[0-9]/g, "");
  const clipped = filtered.slice(0, max);
  return clipped.length >= min ? clipped : clipped.padEnd(min, "X").slice(0, max);
}

// Heuristic, cheap fallback when HF key missing or rate-limited
export function ruleSuggest(seed: string, count = 12, min=2, max=7, allowNumbers=true): string[] {
  const base = seed.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const vdrop  = base.replace(/[AEIOU]/g, "");
  const numsub = base.replace(/A/g,"4").replace(/E/g,"3").replace(/I/g,"1").replace(/O/g,"0").replace(/S/g,"5");
  const phon   = base.replace(/PH/g,"F").replace(/CK/g,"K").replace(/QU/g,"Q");
  const parts  = [base, vdrop, numsub, phon];
  const extras = ["X", "Z", "Q", "R", "24", "7", "GO", "UP", "MAX", "PRO"];
  const out = new Set<string>();
  for (const p of parts) {
    out.add(clampPlate(p, min, max, allowNumbers));
    for (const e of extras) out.add(clampPlate(p + e, min, max, allowNumbers));
    for (const e of extras) out.add(clampPlate(e + p, min, max, allowNumbers));
  }
  return Array.from(out).slice(0, count);
}

// HF text-generation with tiny model, prompt-constrained to 2-7 char tokens
export async function hfSuggest(seed: string, count=12, min=2, max=7, allowNumbers=true): Promise<string[]> {
  if (!env.HUGGING_FACE_API_KEY) return ruleSuggest(seed, count, min, max, allowNumbers);
  const prompt = [
    "You generate California vanity plate ideas.",
    `Seed: ${seed}`,
    `Rules: 2-${max} chars, uppercase A-Z${allowNumbers?"/0-9":""}, catchy, no spaces, no punctuation.`,
    "Return a JSON array of strings only."
  ].join("\n");

  try {
    const resp = await axios.post(
      `https://api-inference.huggingface.co/models/${encodeURIComponent(env.HF_TEXT_MODEL)}`,
      { inputs: prompt, parameters: { max_new_tokens: 64, temperature: 0.9 } },
      { headers: { Authorization: `Bearer ${env.HUGGING_FACE_API_KEY}` }, timeout: 10000 }
    );
    const text: string = typeof resp.data === "string" ? resp.data : (resp.data?.[0]?.generated_text ?? JSON.stringify(resp.data));
    const match = text.match(/\[[^\]]*\]/);
    const arr = match ? JSON.parse(match[0]) as string[] : [];
    const cleaned = arr
      .map(s => clampPlate(String(s), min, max, allowNumbers))
      .filter(s => /^[A-Z0-9]{2,7}$/.test(s));
    return cleaned.length ? cleaned.slice(0, count) : ruleSuggest(seed, count, min, max, allowNumbers);
  } catch {
    return ruleSuggest(seed, count, min, max, allowNumbers);
  }
}

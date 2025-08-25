import type { Availability, SuggestPayload } from "./types";

// Allow pointing the frontend to a remote API instead of same-origin.
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";

export async function apiSuggest(payload: SuggestPayload): Promise<string[]> {
  const r = await fetch(`${API_BASE}/api/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(`suggest failed: ${r.status}`);
  const j = await r.json();
  return j.suggestions as string[];
}

export async function apiCheck(plate: string): Promise<Availability> {
  const r = await fetch(
    `${API_BASE}/api/check?plate=${encodeURIComponent(plate)}&state=CA`
  );
  if (!r.ok) throw new Error(`check failed: ${r.status}`);
  const j = await r.json();
  return j.availability as Availability;
}

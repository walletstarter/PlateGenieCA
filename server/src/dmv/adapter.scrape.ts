import axios from "axios";
import env from "../env.js";
import type { PlateAvailability } from "../types.js";

/**
 * Generic HTML form POST scraper for CA DMV plate checks.
 * Highly configurable via env: URL, field names, and regex for availability.
 * NOTE: The DMV site may change; update env values accordingly.
 */
export async function checkPlateScrape(plate: string): Promise<PlateAvailability> {
  if (!env.CA_DMV_CHECK_URL) return "UNKNOWN";

  // Build form data (plate field plus any required fixed fields)
  const params = new URLSearchParams();
  params.set(env.CA_DMV_FORM_PLATE_FIELD, plate);
  // allow "k=v;k2=v2" style in env
  if (env.CA_DMV_FORM_OTHER_FIELDS.trim()) {
    for (const kv of env.CA_DMV_FORM_OTHER_FIELDS.split(";")) {
      const [k, v] = kv.split("=");
      if (k && typeof v !== "undefined") params.set(k.trim(), v.trim());
    }
  }

  const resp = await axios.post(env.CA_DMV_CHECK_URL, params.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": new URL(env.CA_DMV_CHECK_URL).origin,
      "Referer": env.CA_DMV_CHECK_URL,
      "User-Agent": "Mozilla/5.0 (PlateHelper-MVP)"
    },
    timeout: 12000,
    validateStatus: () => true
  });

  const body = typeof resp.data === "string" ? resp.data : JSON.stringify(resp.data);
  const reAvail  = new RegExp(env.CA_DMV_AVAIL_REGEX, "i");
  const reTaken  = new RegExp(env.CA_DMV_TAKEN_REGEX, "i");
  const reInvalid= new RegExp(env.CA_DMV_INVALID_REGEX, "i");

  if (reInvalid.test(body)) return "INVALID";
  if (reTaken.test(body))   return "TAKEN";
  if (reAvail.test(body))   return "AVAILABLE";
  return "UNKNOWN";
}

import type { PlateAvailability } from "../types.js";

// Deterministic mock so UI is testable without live DMV
export async function checkPlateMock(plate: string): Promise<PlateAvailability> {
  const bad = ["BADPLT","TAKEN1","NOTOK","INVALID","RESERVED"];
  if (bad.includes(plate)) return "TAKEN";
  if (/^(FU|ASS|SEX)/.test(plate)) return "INVALID";
  // simple hash to "randomize"
  const h = [...plate].reduce((a,c) => a + c.charCodeAt(0), 0);
  return h % 5 === 0 ? "TAKEN" : "AVAILABLE";
}

import env from "../env.js";
import { checkPlateMock } from "./adapter.mock.js";
import { checkPlateScrape } from "./adapter.scrape.js";
import type { PlateAvailability } from "../types.js";

export async function checkPlateCA(plate: string): Promise<PlateAvailability> {
  const mode = env.CA_DMV_MODE;
  if (mode === "scrape") return checkPlateScrape(plate);
  return checkPlateMock(plate);
}

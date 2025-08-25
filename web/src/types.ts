export type Availability = "AVAILABLE" | "TAKEN" | "INVALID" | "UNKNOWN";

export interface SuggestPayload {
  seed: string;
  count?: number;
  constraints?: { min?: number; max?: number; allowNumbers?: boolean };
}

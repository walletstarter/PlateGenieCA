export type PlateAvailability = "AVAILABLE" | "TAKEN" | "INVALID" | "UNKNOWN";

export interface SuggestRequest {
  seed: string;
  count?: number;
  constraints?: {
    min?: number;
    max?: number;
    allowNumbers?: boolean;
  };
}

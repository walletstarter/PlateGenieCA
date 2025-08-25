import * as dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: parseInt(process.env.PORT || "5175", 10),
  NODE_ENV: process.env.NODE_ENV || "development",

  HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY || "",
  HF_TEXT_MODEL: process.env.HF_TEXT_MODEL || "TinyLlama/TinyLlama-1.1B-Chat-v1.0",

  CA_DMV_MODE: (process.env.CA_DMV_MODE || "mock").toLowerCase(), // "mock" | "scrape"
  CA_DMV_CHECK_URL: process.env.CA_DMV_CHECK_URL || "",
  CA_DMV_FORM_PLATE_FIELD: process.env.CA_DMV_FORM_PLATE_FIELD || "plateText",
  CA_DMV_FORM_OTHER_FIELDS: process.env.CA_DMV_FORM_OTHER_FIELDS || "plateType=PASSENGER",
  CA_DMV_AVAIL_REGEX: process.env.CA_DMV_AVAIL_REGEX || "Available|is available",
  CA_DMV_TAKEN_REGEX: process.env.CA_DMV_TAKEN_REGEX || "Taken|not available",
  CA_DMV_INVALID_REGEX: process.env.CA_DMV_INVALID_REGEX || "Invalid|not allowed",

  CHECK_CACHE_TTL: parseInt(process.env.CHECK_CACHE_TTL || "15", 10), // minutes

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "90", 10),
};

export default env;

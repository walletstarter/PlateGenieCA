# CA Plate Helper (MVP)

Minimal app to generate catchy California vanity plate ideas and check availability.

## Stack
- Frontend: Vite + React + TS
- Backend: Node 20 + Express + TS
- GenAI: Hugging Face Inference (fallback to rules)
- DMV: adapter-based (mock or scrape via configurable endpoint)
- Cache: LRU in-memory
- Validation: Zod

## Quickstart
1) Install pnpm (or use npm)
2) Copy .env.example -> .env and edit as needed
3) Install deps:
   pnpm i
4) Dev:
   pnpm dev
5) Open http://localhost:5173

## Notes
- If `HUGGING_FACE_API_KEY` is not set, suggestions still work via the rule-based fallback.
- `CA_DMV_MODE=mock` for local dev; switch to `scrape` and set selectors/regex for real checks.

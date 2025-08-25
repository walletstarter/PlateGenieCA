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

## Deployment

- **GitHub Pages**: Vite is configured with `base: "/PlateGenieCA/"` so the built assets resolve
  correctly when hosted under `https://<user>.github.io/PlateGenieCA/`.
  Build the frontend with `pnpm --filter web build` and publish the contents of `web/dist`.
- **Separate backend**: when the API lives on another host, set `VITE_API_BASE` in a `web/.env`
  file (see `web/.env.example`). The frontend will prepend this value to `/api` requests.

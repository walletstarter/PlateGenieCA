import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  /**
   * When hosted on GitHub Pages the app lives under
   * `https://<user>.github.io/<repo>/`, so asset paths need the repo base.
   */
  base: "/PlateGenieCA/",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5175",
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: "dist"
  }
});

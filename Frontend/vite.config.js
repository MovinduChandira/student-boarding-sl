import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Forward /api/* to the Express backend so the login cookie works in dev
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});

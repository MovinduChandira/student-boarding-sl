import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Forward /api/* and /uploads/* to the Express backend
    proxy: {
      "/api": "http://localhost:5000",
      "/uploads": "http://localhost:5000",
    },
  },
});

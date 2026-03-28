import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0 — localhost + LAN IP (e.g. 10.10.7.x) both work
    port: 3003,
  },
});

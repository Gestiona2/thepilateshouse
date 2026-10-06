import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Sitio estático. Cambiar `site` (y `base` si se publica en subcarpeta) al elegir hosting.
export default defineConfig({
  site: "https://aira.example",
  vite: { plugins: [tailwindcss()] },
});

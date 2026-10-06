import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Demo: el sitio vive en una subcarpeta de demos.emp2web.com (GitHub Pages de la organización).
// Cuando el cliente tenga su dominio: site con su dominio y base "/". Los enlaces y
// recursos pasan por src/lib/ruta.js, así que no hay que tocarlos.
export default defineConfig({
  site: "https://demos.emp2web.com",
  base: "/thepilateshouse",
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});

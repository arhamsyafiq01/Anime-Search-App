import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.png", "image.png"],
      manifest: {
        name: "Anime Search",
        short_name: "AnimeSearch",
        description: "Search for your favorite anime and view details",
        theme_color: "#1a202c",
        background_color: "#f4f7f6",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "image.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "image.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    port: 4000,
    open: true,
  },
});

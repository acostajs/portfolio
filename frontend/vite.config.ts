import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import Sitemap from "vite-plugin-sitemap";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: "https://acostajs.vercel.app/",
      dynamicRoutes: [
        "/about",
        "/experience",
        "/projects",
        "/blog",
        "/contact",
      ],
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "icons.svg",
        "favicon.svg",
      ],
      manifest: {
        name: "Juan Acosta Portfolio",
        short_name: "Juan Acosta",
        description:
          "Interactive portfolio featuring a multilingual chatbot assistant.",
        theme_color: "#0d1117",
        background_color: "#0d1117",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});

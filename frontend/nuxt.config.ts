import tailwindcss from "@tailwindcss/vite";
import "tailwindcss";
import "tailwindcss-primeui";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
        '@primevue/nuxt-module'
    ], 
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000',
    }
  }
});
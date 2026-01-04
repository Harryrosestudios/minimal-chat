// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    openrouterApiKey: "",  // Set via NUXT_OPENROUTER_API_KEY env var
  },
});

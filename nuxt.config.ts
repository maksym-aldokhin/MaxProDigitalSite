// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {enabled: true},
  head: {
    link: [
      {
        rel: 'stylesheet',
        href:
            'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap',
      },
    ],
  },
  css: [
    '~/assets/css/global.css',
  ],
  modules: ['@nuxtjs/google-gtag'],
  runtimeConfig: {
    public: {
      googleAnalytics: {
        id: 'G-V42392F0DM'
      }
    }
  },
})

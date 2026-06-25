// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/color-mode'
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark'
  },

  content: {
    experimental: {
      sqliteConnector: 'native'
    },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-dark-dimmed',
            dark: 'github-dark-dimmed',
            light: 'github-light'
          },
          langs: ['zig', 'bash', 'shell', 'json', 'diff', 'c', 'yaml']
        },
        toc: {
          depth: 3,
          searchDepth: 3
        }
      }
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'zig.guide',
      titleTemplate: '%s · zig.guide',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Get started with the Zig programming language. Zig is a general-purpose programming language and toolchain for maintaining robust, optimal, and reusable software.' },
        { name: 'theme-color', content: '#0e0e10' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  typescript: {
    strict: true
  }
})

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const pkg = require('./package')

module.exports = {
  /*
  ** Auth
  */
  auth: {
    redirect: {
      home: '/',
      login: '/',
      logout: '/',
      callback: '/callback'
    },
    resetOnError: true,
    localStorage: false,
    strategies: {
      auth0: {
        domain: 'machinemaker.auth0.com',
        client_id: '5vjD6k0SCE6JzTQATqwkoixBDJTtp3C7'
      }
    }
  },
  /*
  ** Env
  */
  env: {
    baseUrl:
      process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000',
    CLIENT_ID: '5vjD6k0SCE6JzTQATqwkoixBDJTtp3C7'
  },
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: title => {
      return title
        ? `${title} | Panyana Research Group`
        : 'Panyana Research Group'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'Panyana Research'
      },
      { hid: 'og:image', name: 'og:image', content: '/assets/research.png' },
      { name: 'msapplication-TileColor', content: '#da532c' },
      { name: 'msapplication-config', content: '/favicons/browserconfig.xml' },
      { name: 'theme-color', content: '#fec108' }
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicons/apple-touch-icon.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicons/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicons/favicon-16x16.png'
      },
      { rel: 'manifest', href: '/favicons/site.webmanifest' },
      {
        rel: 'mask-icon',
        href: '/favicons/safari-pinned-tab.svg',
        color: '#5bbad5'
      },
      { rel: 'shortcut icon', href: '/favicons/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ],
    script: [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=UA-135117645-1',
        async: true
      },
      {
        src: '/js/google-analytics.js'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: ['~/assets/style/app.styl', '@mdi/font/css/materialdesignicons.css'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/api',
    '@/plugins/globalMixins',
    '@/plugins/vuetify-confirm'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/moment',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'cookie-universal-nuxt'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: [/^vuetify/],
    plugins: [new VuetifyLoaderPlugin()],
    quiet: false,
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

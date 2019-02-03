import Vue from 'vue'
import auth0 from 'auth0-js'

const webAuth = new auth0.WebAuth({
  domain: 'machinemaker.auth0.com',
  clientID: '5vjD6k0SCE6JzTQATqwkoixBDJTtp3C7',
  redirectUri:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/callback'
      : 'https://panyanaresearch.com/callback',
  responseType: 'token id_token',
  scope: 'openid profile roles'
})

const auth = new Vue({
  computed: {
    token: {
      get: function() {
        return localStorage.getItem('id_token')
      },
      set: function(idToken) {
        localStorage.setItem('id_token', idToken)
      }
    },
    accessToken: {
      get: function() {
        return localStorage.getItem('access_token')
      },
      set: function(accessToken) {
        localStorage.setItem('access_token', accessToken)
      }
    },
    expiresAt: {
      get: function() {
        return localStorage.getItem('expires_at')
      },
      set: function(expiresIn) {
        const expiresAt = JSON.stringify(
          expiresIn * 1000 + new Date().getTime()
        )
        localStorage.setItem('expires_at', expiresAt)
      }
    },
    user: {
      get: function() {
        return JSON.parse(localStorage.getItem('user'))
      },
      set: function(user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
    }
  },
  methods: {
    getExpiration() {
      return localStorage.getItem('expires_at')
    },
    login() {
      localStorage.setItem('prev_path', window.location.pathname)
      webAuth.authorize()
    },
    logout() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('id_token')
      localStorage.removeItem('expires_at')
      localStorage.removeItem('user')
      Vue.$store.commit('authLogOut')
    },
    isAuthenticated() {
      // console.log(this.expiresAt)
      // console.log(new Date().getTime() < this.expiresAt)
      return new Date().getTime() < this.getExpiration()
    },
    handleAuthentication() {
      return new Promise((resolve, reject) => {
        webAuth.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.expiresAt = authResult.expiresIn
            this.accessToken = authResult.accessToken
            this.token = authResult.idToken
            if (authResult.idTokenPayload['http://example.com/roles'])
              authResult.idTokenPayload.roles =
                authResult.idTokenPayload['http://example.com/roles']
            this.user = authResult.idTokenPayload
            resolve(this.user)
          } else if (err) {
            this.logout()
            reject(err)
          }
        })
      })
    }
  }
})

Vue.use({
  install: Vue => {
    Vue.prototype.$auth = auth
  }
})

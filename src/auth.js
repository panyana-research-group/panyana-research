import auth0 from "auth0-js"
import store from "./store"
import Vue from "vue"

let webAuth = new auth0.WebAuth({
  domain: 'machinemaker.auth0.com',
  clientID: '5vjD6k0SCE6JzTQATqwkoixBDJTtp3C7',
  redirectUri: 'https://panyanaresearch.com/callback',
  responseType: 'token id_token',
  scope: 'openid profile roles'
})

let auth = new Vue({
  computed: {
    token: {
      get: function() {
        return localStorage.getItem("id_token")
      },
      set: function(id_token) {
        localStorage.setItem("id_token", id_token)
      }
    },
    accessToken: {
      get: function() {
        return localStorage.getItem("access_token")
      },
      set: function(accessToken) {
        localStorage.setItem("access_token", accessToken)
      }
    },
    expiresAt: {
      get: function() {
        return localStorage.getItem("expires_at")
      },
      set: function(expiresIn) {
        let expiresAt = JSON.stringify(expiresIn * 1000 + new Date().getTime())
        localStorage.setItem("expires_at", expiresAt)
        console.log(localStorage.getItem("expires_at"))
      }
    },
    user: {
      get: function() {
        return JSON.parse(localStorage.getItem("user"))
      },
      set: function(user) {
        localStorage.setItem("user", JSON.stringify(user))
      }
    }
  },
  methods: {
    getExpiration() {
      return localStorage.getItem("expires_at")
    },
    login() {
      webAuth.authorize()
    },
    logout() {
      localStorage.removeItem("access_token")
      localStorage.removeItem("id_token")
      localStorage.removeItem("expires_at")
      localStorage.removeItem("user")
      console.log('logout')
      store.commit('logOut')
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
            if (authResult.idTokenPayload["http://example.com/roles"])
              authResult.idTokenPayload.roles = authResult.idTokenPayload["http://example.com/roles"]
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

export default {
  install: function(Vue) {
    Vue.prototype.$auth = auth
  }
}

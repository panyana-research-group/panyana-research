import EventEmitter from 'eventemitter3'
import auth0 from 'auth0-js'

const webAuth = new auth0.WebAuth({
  domain: 'machinemaker.auth0.com',
  redirectUri:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/callback'
      : `https://${
          process.env.DEV_BRANCH ? 'dev.' : ''
        }panyanaresearch.com/callback`,
  clientID: '5vjD6k0SCE6JzTQATqwkoixBDJTtp3C7',
  responseType: 'id_token',
  scope: 'openid profile email'
})

const localStorageKey = 'loggedIn'
const loginEvent = 'loginEvent'

export default ({ app, store }, inject) => {
  class AuthService extends EventEmitter {
    idToken = null
    user = null
    tokenExpiry = null

    login(customState) {
      webAuth.authorize({
        appState: customState
      })
    }

    handleAuthentication() {
      return new Promise((resolve, reject) => {
        webAuth.parseHash((err, authResult) => {
          if (err) reject(err)
          else {
            this.localLogin(authResult)
            resolve(authResult.idToken)
          }
        })
      })
    }

    localLogin(authResult) {
      this.idToken = authResult.idToken
      this.user = authResult.idTokenPayload

      this.tokenExpiry = new Date(this.user.exp * 1000)

      localStorage.setItem(localStorageKey, 'true')
      store.commit('auth/login', this.user)

      store.commit('auth/loading', { t: 'roles', v: true })
      this.getUserRoles()
        .then(roles => {
          store.commit('auth/setRoles', roles)
        })
        .catch(() => {
          store.commit('auth/setRoles', [])
        })
        .finally(() => store.commit('auth/loading', { t: 'roles', v: false }))

      this.emit(loginEvent, {
        loggedIn: true,
        user: authResult.idTokenPayload,
        state: authResult.appState || {}
      })
    }

    renewTokens() {
      return new Promise((resolve, reject) => {
        if (localStorage.getItem(localStorageKey) !== 'true')
          return reject(new Error('Not logged in'))

        webAuth.checkSession({}, (err, authResult) => {
          if (err) reject(err)
          else {
            this.localLogin(authResult)
            resolve(authResult)
          }
        })
      })
    }

    logout() {
      localStorage.removeItem(localStorageKey)

      this.idToken = null
      this.tokenExpiry = null
      this.user = null

      webAuth.logout({
        clientID: '5vjD6k0SCE6JzTQATqwkoixBDJTtp3C7',
        returnTo: window.location.origin
      })

      store.commit('auth/logout')
      store.commit('auth/setRoles', null)
      this.emit(loginEvent, { loggedIn: false })
    }

    isAuthenticated() {
      return (
        Date.now() < this.tokenExpiry &&
        localStorage.getItem(localStorageKey) === 'true'
      )
    }

    getUserRoles() {
      return new Promise((resolve, reject) => {
        if (!this.user || !this.isAuthenticated())
          return reject(new Error('Not authenticated'))

        app.$api
          .get(`/auth/users/${this.user.sub}/roles`)
          .then(roles => resolve(roles.data))
          .catch(err => reject(err))
      })
    }
  }

  const auth = new AuthService()
  inject('auth', auth)

  app.router.onReady(async () => {
    try {
      store.commit('auth/loading', { t: 'user', v: true })
      await auth.renewTokens()
    } catch {
    } finally {
      store.commit('auth/loading', { t: 'user', v: false })
    }
  })
}

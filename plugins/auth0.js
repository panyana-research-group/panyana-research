import auth0 from 'auth0-js'
import EventEmitter from 'eventemitter3'

export default ({ app, redirect }, inject) => {
  class AuthService {
    accessToken
    idToken
    expiresAt
    authenticated = this.isAuthenticated()
    authNotifier = new EventEmitter()

    auth0 = new auth0.WebAuth({
      domain: 'machinemaker.auth0.com',
      clientID: '5vjD6k0SCE6JzTQATqwkoixBDJTtp3C7',
      redirectUri:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/callback'
          : 'https://panyanaresearch.com/callback',
      responseType: 'token id_token',
      scope: 'openid profile email'
    })

    login() {
      localStorage.setItem('prev_path', window.location.pathname)
      this.auth0.authorize()
    }

    handleAuthentication() {
      return new Promise((resolve, reject) => {
        this.auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult)
            resolve(authResult)
          } else if (err) {
            console.log(err)
            reject(err)
          }
        })
      })
    }

    setSession(authResult) {
      this.accessToken = authResult.accessToken
      this.idToken = authResult.idToken
      this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
      this.userProfile = authResult.idTokenPayload
      this.userProfile.roles =
        authResult.idTokenPayload['https://example.com/roles']
      delete this.userProfile['https://example.com/roles']

      this.authNotifier.emit('authChange', { authenticated: true })

      app.$cookies.set('user', authResult.idTokenPayload.sub, {
        maxAge: authResult.expiresIn,
        path: '/'
      })
    }

    renewSession() {
      return new Promise((resolve, reject) => {
        this.auth0.checkSession({}, (err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult)
            resolve(authResult)
          } else if (err) {
            // this.logout()
            console.log(err)
            reject(err)
          }
        })
      })
    }

    logout() {
      this.accessToken = null
      this.idToken = null
      this.expiresAt = null

      this.userProfile = null
      this.authNotifier.emit('authChange', { authenticated: false })

      app.$cookies.remove('user')
      this.auth0.logout({
        clientID: '5vjD6k0SCE6JzTQATqwkoixBDJTtp3C7',
        returnTo:
          process.env.NODE_ENV === 'production'
            ? 'https://panyanaresearch.com'
            : 'http://localhost:3000',
        federated: true
      })
    }

    isAuthenticated() {
      return new Date().getTime() < this.expiresAt && app.$cookies.get('user')
    }

    getUserRoles() {
      return new Promise((resolve, reject) => {
        if (app.$cookies.get('user')) {
          this.renewSession()
            .then(res => {
              app.$api
                .get(`/auth/users/${res.idTokenPayload.sub}/roles`)
                .then(roles => {
                  resolve(roles.data)
                })
                .catch(err => {
                  console.error(err)
                  reject(err)
                })
            })
            .catch(err => {
              console.error(err)
              reject(err)
            })
        } else {
          resolve([])
        }
      })
    }
  }

  const auth = new AuthService()
  inject('auth', auth)
}

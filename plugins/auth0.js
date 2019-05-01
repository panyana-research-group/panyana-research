import auth0 from 'auth0-js'
import EventEmitter from 'eventemitter3'

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
    scope: 'openid profile email roles'
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

    localStorage.setItem('loggedIn', true)
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        this.logout()
        console.log(err)
      }
    })
  }

  logout() {
    this.accessToken = null
    this.idToken = null
    this.expiresAt = null

    this.userProfile = null
    this.authNotifier.emit('authChange', { authenticated: false })

    localStorage.removeItem('loggedIn')
  }

  getAuthenticatedFlag() {
    return localStorage.getItem('loggedIn')
  }

  isAuthenticated() {
    return (
      new Date().getTime() < this.expiresAt &&
      this.getAuthenticatedFlag() === 'true'
    )
  }
}

const auth = new AuthService()

export default ({ app }, inject) => {
  inject('auth', auth)
}

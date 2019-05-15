export const state = () => ({
  loggedIn: false,
  user: {},
  roles: null,
  loading: {
    roles: false,
    user: false
  }
})

export const mutations = {
  login(state, user) {
    state.loggedIn = true
    state.user = user
  },
  logout(state) {
    state.loggedIn = false
    state.user = {}
    state.roles = null
  },
  loading(state, { t, v }) {
    state.loading[t] = v
  },
  setRoles(state, roles) {
    state.roles = roles
  }
}

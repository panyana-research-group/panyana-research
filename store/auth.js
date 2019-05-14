export const state = () => ({
  loggedIn: false,
  user: {},
  roles: null
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
  setRoles(state, roles) {
    state.roles = roles
  }
}

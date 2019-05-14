export const state = () => ({
  loggedIn: false,
  roles: null,
  navDrawer: null
})

export const mutations = {
  changeAuth(state, authState) {
    state.loggedIn = authState
  },
  drawerState(state, drawer) {
    state.navDrawer = drawer
  },
  setRoles(state, roles) {
    state.roles = roles
  }
}

export const getters = {
  isAuthenticated(state) {
    return !!state.loggedIn
  }
}

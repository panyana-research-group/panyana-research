export const state = () => ({
  loggedIn: false,
  navDrawer: null
})

export const mutations = {
  changeAuth(state, authState) {
    state.loggedIn = authState
  },
  drawerState(state, drawer) {
    state.navDrawer = drawer
  }
}

export const getters = {
  isAuthenticated(state) {
    return !!state.loggedIn
  }
}

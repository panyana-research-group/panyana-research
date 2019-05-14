export const state = () => ({
  roles: null,
  navDrawer: null
})

export const mutations = {
  drawerState(state, drawer) {
    state.navDrawer = drawer
  },
  setRoles(state, roles) {
    state.roles = roles
  }
}

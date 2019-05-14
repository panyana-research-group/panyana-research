export const state = () => ({
  navDrawer: null
})

export const mutations = {
  drawerState(state, drawer) {
    state.navDrawer = drawer
  }
}

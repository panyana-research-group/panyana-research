export const state = () => ({
  loggedIn: false
})

export const mutations = {
  changeAuth(state, authState) {
    state.loggedIn = authState
  }
}

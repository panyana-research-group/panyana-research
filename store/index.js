export const state = () => ({
  authLoggedIn: false
})

export const mutations = {
  authLogIn(state) {
    state.authLoggedIn = true
  },
  authLogOut(state) {
    state.authLoggedIn = false
  }
}

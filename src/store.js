import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authLoggedIn: false
  },
  mutations: {
    authLogIn(state) {
      state.authLoggedIn = true
    },
    authLogOut(state) {
      state.authLoggedIn = false
    }
  },
  actions: {}
})

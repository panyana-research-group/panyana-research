import Vue from "vue"
import Router from "vue-router"
import Meta from "vue-meta"
import store from "./store"

import Home from "./views/Home.vue"
import About from "./views/About.vue"
import Privacy from "./views/Privacy.vue"

import Lore from "./views/Lore.vue"
import Cooling from "./views/Cooling.vue"

import Callback from "./views/Callback.vue"

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  mode: "history",
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/about", name: "about", component: About },
    { path: "/lore", name: "Lore", component: Lore },
    { path: "/cooling", name: "Cooling", component: Cooling },
    { path: "/callback", name: "callback", component: Callback },
    { path: "/privacy", name: "privacy", component: Privacy },
    { path: "*", name: "universal", redirect: "/" }
  ]
})

router.beforeEach((to, from, next) => {
  if (router.app.$auth.isAuthenticated())
    store.commit('authLogIn')
  else {
    store.commit('authLogOut')
    router.app.$auth.logout()
  }
  next()
})

export default router

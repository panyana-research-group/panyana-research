import Vue from "vue"
import Router from "vue-router"
import Home from "./views/Home.vue"
import Lore from "./views/Lore.vue"
import Cooling from "./views/Cooling.vue"
import Callback from "./views/Callback.vue"

import store from "./store"

Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/lore",
      name: "Lore",
      component: Lore
    },
    {
      path: "/cooling",
      name: "Cooling",
      component: Cooling
    },
    {
      path: "/callback",
      name: "callback",
      component: Callback
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (router.app.$auth.isAuthenticated() || from.name === "callback")
    store.commit('logIn')
  else (store.commit('logOut'))
  next()
})

// router.beforeEach((to, from, next) => {
//   if(to.name == 'callback') {
//     next()
//   } else if (router.app.$auth.isAuthenticated()) {
//     next()
//   } else {
//     router.app.$auth.login()
//   }
// })

export default router

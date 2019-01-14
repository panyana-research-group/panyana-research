import Vue from "vue"
import Vuetify from "vuetify/lib"
import "vuetify/src/stylus/app.styl"

Vue.use(Vuetify, {
  theme: {
      primary: "#795548",
      secondary: "#ffc107",
      accent: "#03a9f4",
      error: "#f44336",
      warning: "#ff9800",
      info: "#3f51b5",
      success: "#4caf50"
      },
  customProperties: true,
  iconfont: "md"
})

import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.config.productionTip = false

Vue.use(Vuetify, {
  theme: {
    primary: '#292f36',
    secondary: '#fffedc',
    accent: '#4ecdc4',
    error: '#f44336',
    warning: '#ff6b6b',
    info: '#ffe04b',
    success: '#4caf50'
  }
})

import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.config.productionTip = false

Vue.use(Vuetify, {
  theme: {
    primary: '#2196f3',
    secondary: '#ffeb3b',
    accent: '#9c27b0',
    error: '#f44336',
    warning: '#ff9800',
    info: '#607d8b',
    success: '#4caf50'
  }
})

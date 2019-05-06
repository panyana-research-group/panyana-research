import Vue from 'vue'
import VuetifyConfirm from 'vuetify-confirm'

Vue.use(VuetifyConfirm, {
  buttonTrueText: 'Yes',
  buttonFalseText: 'No',
  color: 'warning',
  icon: 'warning',
  title: 'WARNING',
  width: 300,
  property: '$confirm'
})

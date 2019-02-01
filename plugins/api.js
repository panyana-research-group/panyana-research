import Vue from 'vue'
import axios from 'axios'

const url = 'https://panyana-research-api.glitch.me/api/'

const api = {
  getSheet(name) {
    return axios.get(url + 'sheets/' + name)
  },
  appendRows(name, data) {
    return axios.post(url + 'sheets/' + name + '/append/', data)
  }
}

Vue.use({
  install: Vue => {
    Vue.prototype.$api = api
  }
})

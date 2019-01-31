import axios from "axios"

const apiUrl = "https://panyana-research-api.glitch.me/api/"

export default {
  getSheet(name) {
    return axios.get(apiUrl + "sheets/" + name)
  },
  appendRows(name, data) {
    return axios.post(apiUrl + "sheets/" + name + "/append/", data)
  },
}

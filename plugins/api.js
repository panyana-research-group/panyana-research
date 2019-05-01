import axios from 'axios'

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000'
      : 'https://panyana-api.glitch.me'
})

export default ({ app }, inject) => {
  inject('api', api)
}

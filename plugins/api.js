import axios from 'axios'
export default ({ app }, inject) => {
  const api = axios.create({
    baseURL:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://panyana-api.glitch.me'
  })

  api.interceptors.request.use(
    config => {
      if (
        config.method === 'post' ||
        config.method === 'put' ||
        config.url.startsWith('/auth')
      ) {
        config.headers.Authorization = `Bearer ${app.$auth.idToken}`
      }
      return config
    },
    error => Promise.reject(error)
  )

  inject('api', api)
}

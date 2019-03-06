export const convert = {
  methods: {
    convert(obj) {
      const newObj = {}
      Object.keys(obj).forEach(key => {
        newObj[key] = parseInt(obj[key])
      })
      return newObj
    }
  }
}

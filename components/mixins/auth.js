export const auth = {
  data() {
    return {
      snack: {
        text: 'none',
        color: 'error',
        show: false
      }
    }
  },
  methods: {
    checkRole(role) {
      return new Promise((resolve, reject) => {
        this.$auth
          .getUserRoles()
          .then(res => {
            if (res.find(r => r.name === role || r.id === role)) resolve(true)
            else resolve(false)
          })
          .catch(err => {
            console.error(err)
            reject(err)
          })
      })
    },
    noPerms() {
      this.snack.text = 'Not logged in or insufficient permissions!'
      this.snack.color = 'error'
      this.snack.show = true
    }
  }
}

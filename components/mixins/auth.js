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
  computed: {
    auth() {
      return this.$store.state.auth
    }
  },
  methods: {
    checkRole(role) {
      return new Promise((resolve, reject) => {
        if (!this.auth.loggedIn) resolve(false)
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
    checkRoles(roles) {
      return new Promise((resolve, reject) => {
        if (!this.auth.loggedIn) resolve(false)
        this.$auth
          .getUserRoles()
          .then(res => {
            roles.forEach(role => {
              if (res.find(r => r.name === role || r.id === role)) resolve(true)
              else resolve(false)
            })
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

export const rules = {
  data() {
    return {
      rules: {
        required: v => !!v || 'Required!',
        number: v => !isNaN(v) || 'Must be a number!'
      }
    }
  }
}

<template>
  <div class="callback">
    Logging in...
  </div>
</template>

<script>
export default {
  name: 'Callback',
  head() {
    return {
      title: 'Login'
    }
  },
  mounted() {
    this.$auth.handleAuthentication().then(() => {
      this.$router.push({ path: localStorage.getItem('prev_path') })
      localStorage.removeItem('prev_path')
    })
  }
}
</script>

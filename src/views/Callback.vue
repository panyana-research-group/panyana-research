<template>
  <div class="callback">Logging in...</div>
</template>

<script>
export default {
  name: "Callback",
  mounted() {
    this.$auth.handleAuthentication().then(() => {
      this.$store.commit('logIn')
      this.$router.push({ name: "home" })
    })
  }
}
</script>

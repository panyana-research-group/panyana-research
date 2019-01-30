<template>
  <div class="callback">Logging in...</div>
</template>

<script>
export default {
  name: "Callback",
  mounted() {
    this.$auth.handleAuthentication().then(() => {
      this.$store.commit('logIn')
      this.$router.push({ path: localStorage.getItem("prev_path") })
      localStorage.removeItem("prev_path")
    })
  }
}
</script>

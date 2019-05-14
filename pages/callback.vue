<template>
  <v-layout row wrap justify-center>
    <v-flex shrink mt-5>
      <v-progress-circular indeterminate size="200" width="20" color="info" />
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'LoginCallback',
  mounted() {
    this.$auth.handleAuthentication()
    this.$auth.on('loginEvent', data => {
      this.$router.push('/')
    })
  }
}
</script>

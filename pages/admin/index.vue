<template>
  <v-layout row wrap>
    <v-flex xs12 lg8>
      <v-card>
        <v-card-text class="headline text-xs-center">
          Users
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  name: 'AdminHome',
  middleware: 'admin',
  mounted() {
    this.$api
      .get('/auth/users/all')
      .then(res => {
        console.log(res.data)
      })
      .catch(console.error)
  }
}
</script>

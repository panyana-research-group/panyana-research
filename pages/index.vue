<template>
  <v-layout text-xs-center row wrap>
    <v-flex xs12 lg6 offset-lg3 mt-5>
      <v-card color="secondary primary--text">
        <v-card-title primary-title class="display-2 justify-center pa-3">
          Welcome to the Panyana Research Group!
        </v-card-title>
        <v-card-text class="headline">
          This is a site dedicated to displaying and collecting all manners of information about Worlds Adrift.
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  head() {
    return {
      title: 'Home'
    }
  }
}
</script>

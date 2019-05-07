<template>
  <v-layout row wrap>
    <v-flex>
      <v-card color="primary" width="500px" class="mx-auto">
        <v-card-text class="headline text-xs-center secondary--text">
          Atlas Core Boosts
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { boosts } from '@/components/mixins/boosts'
export default {
  name: 'SkycoreBoost',
  mixins: [boosts],
  head() {
    return {
      title: 'Atlas Core Boosts',
      meta: [
        { hid: 'og:title', name: 'og:title', content: 'Atlas Core Boosts' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Shows various materials effects on lift capacity'
        }
      ]
    }
  }
}
</script>

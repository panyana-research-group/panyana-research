<template>
  <v-layout row wrap>
    <v-flex xs12 text-xs-center display-1>
      Materials in Worlds Adrift
    </v-flex>
    <v-flex xs12 lg8 text-xs-center mx-auto>
      <v-btn
        v-for="row in materialsButtonInfo.rows"
        :key="row.name"
        :to="row.to || ''"
        :disabled="!row.to"
        color="accent"
        class="primary--text"
        nuxt
      >
        <v-icon left>
          {{ row.icon }}
        </v-icon>
        {{ row.name }}
      </v-btn>
    </v-flex>
  </v-layout>
</template>
<script>
import { materials } from '@/components/mixins/pages'
export default {
  name: 'Materials',
  mixins: [materials],
  head() {
    return {
      title: 'Worlds Adrift Materials',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Worlds Adrift Materials'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Links to various info charts on materials'
        }
      ]
    }
  }
}
</script>

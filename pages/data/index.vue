<template>
  <v-layout row wrap>
    <v-flex xs12 text-xs-center display-1>
      Data for Worlds Adrift
    </v-flex>
    <v-flex xs12 lg8 text-xs-center mx-auto>
      <v-btn
        v-for="row in dataButtonInfo.rows"
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
import { data } from '@/components/mixins/data'
export default {
  name: 'Data',
  mixins: [data],
  head() {
    return {
      title: 'Worlds Adrift Data',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Worlds Adrift Data'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Links to various data repositories'
        }
      ]
    }
  }
}
</script>

<template>
  <v-layout row wrap>
    <v-flex xs12 text-xs-center display-1>
      Worlds Adrift Calculators
    </v-flex>
    <v-flex xs12 lg8 text-xs-center mx-auto>
      <v-btn
        v-for="row in calculatorsButtonInfo.rows"
        :key="row.name"
        :to="row.to || ''"
        :disabled="!row.to"
        class="primary--text"
        color="accent"
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
import { calculators } from '@/components/mixins/calculators'
export default {
  name: 'Calculators',
  mixins: [calculators],
  head() {
    return {
      title: 'Worlds Adrift Calculators',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Worlds Adrift Calculators'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Links to various calculators'
        }
      ]
    }
  }
}
</script>

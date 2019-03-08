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
    <v-flex xs12 lg8 text-xs-center mx-auto>
      <v-btn
        v-for="cat in categories"
        :key="cat.name"
        :to="`/${cat.link || cat.name.toLowerCase()}`"
        class="primary--text"
        color="accent"
        nuxt
      >
        <v-icon left>
          {{ cat.icon }}
        </v-icon>
        {{ cat.name }}
      </v-btn>
    </v-flex>
  </v-layout>
</template>
<script>
import { calculators } from '@/components/mixins/calculators'
import { materials } from '@/components/mixins/materials'
import { data } from '@/components/mixins/data'
export default {
  name: 'Home',
  mixins: [calculators, materials, data],
  head() {
    return {
      title: 'Home'
    }
  },
  computed: {
    categories() {
      return [
        {
          name: this.calculatorsButtonInfo.name,
          icon: this.calculatorsButtonInfo.icon
        },
        {
          name: this.materialsButtonInfo.name,
          icon: this.materialsButtonInfo.icon,
          link: 'materials'
        },
        {
          name: this.dataButtonInfo.name,
          icon: this.dataButtonInfo.icon
        }
      ]
    }
  }
}
</script>

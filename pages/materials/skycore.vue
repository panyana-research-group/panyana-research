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
  },
  data() {
    return {
      materials: [],
      headers: [{ text: 'Boost', value: 'boosts.core' }]
    }
  },
  mounted() {
    this.$api.get('/materials/all').then(res => {
      this.materials = res.data
      this.materials.forEach(mat => {
        if (!this.max.weightMax) this.max.weightMax = mat.weight
        else this.max.weightMax = Math.max(this.max.weightMax, mat.weight)
        if (!this.max.weightMin) this.max.weightMin = mat.weight
        else this.max.weightMin = Math.min(this.max.weightMin, mat.weight)
        if (!this.max.c) this.max.core = mat.boosts.core
        // else this.max.res
      })
    })
  }
}
</script>

<template>
  <v-layout row wrap>
    <v-flex>
      <v-card color="primary" max-width="500px" class="mx-auto">
        <v-card-text class="headline text-xs-center secondary--text">
          Resilience Boosts
        </v-card-text>
        <v-data-table
          :headers="baseHeaders.concat(headers)"
          :items="materials"
          :pagination.sync="pagination"
          style="max-width: 400px"
          class="mx-auto pa-3"
          hide-actions
          dark
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" :style="{ color: props.item.color }">
              {{ props.item.name }}
            </td>
            <td :style="getStyle(props.item.weight, 'weight')">
              {{ props.item.weight }}
            </td>
            <td :style="getBoostStyle(props.item.boosts.res)">
              {{ round(props.item.boosts.res * 100, 2) }}%
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import chroma from 'chroma-js'
import { boosts } from '@/components/mixins/boosts'
export default {
  name: 'ResilienceBoost',
  mixins: [boosts],
  head() {
    return {
      title: 'Resilience Boosts',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Resilience Boosts'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Shows various materials effects on Resilience'
        }
      ]
    }
  },
  data() {
    return {
      materials: [],
      headers: [{ text: 'Boost', value: 'boosts.res' }]
    }
  },
  mounted() {
    this.$api
      .get('/materials')
      .then(res => {
        this.materials = res.data
        this.materials.forEach(mat => {
          if (!this.max.weightMax) this.max.weightMax = mat.weight
          else this.max.weightMax = Math.max(this.max.weightMax, mat.weight)
          if (!this.max.weightMin) this.max.weightMin = mat.weight
          else this.max.weightMin = Math.min(this.max.weightMin, mat.weight)
          if (!this.max.res) this.max.res = mat.boosts.res
          else this.max.res = Math.max(this.max.res, mat.boosts.res)
        })
      })
      .catch(err => {
        console.error(err)
      })
  },
  methods: {
    getBoostStyle(value) {
      const color = this.scale
        .domain([0, this.max.res])(value)
        .hex()
      return {
        backgroundColor: color,
        color:
          chroma.contrast(this.$vuetify.theme.primary, color) > 4.5
            ? this.$vuetify.theme.primary
            : this.$vuetify.theme.secondary
      }
    }
  }
}
</script>

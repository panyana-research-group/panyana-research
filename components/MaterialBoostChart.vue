<template>
  <v-layout row wrap :justify-start="embed">
    <v-flex :shrink="embed">
      <v-card color="primary" :width="embed ? '550px' : '650px'" class="mx-auto" :flat="embed">
        <v-card-text class="headline text-xs-center secondary--text">
          {{ type }} Material Boosts
        </v-card-text>
        <v-card-actions>
          <v-select
            v-model="slot"
            :items="typeOptions"
            :label="`Select an ${type.toLowerCase()} component`"
            color="accent"
            class="secondary--text mx-auto"
            style="max-width: 200px"
            hide-details
            dark
          />
        </v-card-actions>
        <v-data-table
          id="boostTable"
          :headers="baseHeaders.concat(headers[slot])"
          :items="materials"
          :pagination.sync="pagination"
          class="pa-3"
          hide-actions
          dark
          must-sort
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-right" :style="{ color: props.item.color }">
              {{ props.item.name }}
            </td>
            <td :style="getStyle(props.item.weight, 'weight')">
              {{ props.item.weight }}
            </td>
            <td
              v-for="(value, index) in props.item.boosts[type.toLowerCase()][slot]"
              :id="props.item.name + '_' + index"
              :key="value+'_'+index"
              :style="getStyle(value, 'statValue')"
            >
              {{ round(value * 100, 2) }}%
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { boosts } from '@/components/mixins/boosts'
export default {
  name: `MaterialsChart`,
  mixins: [boosts],
  props: {
    type: {
      type: String,
      default: ''
    },
    typeOptions: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Object,
      default: () => {}
    },
    embed: Boolean
  },
  head() {
    const type = this.type
    return {
      title: `${type} Materials`,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: `${type} Material Boosts`
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: `Shows various materials effects on crafting ${type.toLowerCase()}s`
        }
      ]
    }
  },
  data() {
    return {
      materials: [],
      slot: this.typeOptions[0].value || null
    }
  },
  mounted() {
    this.$api
      .get('/materials/all')
      .then(res => {
        this.materials = res.data
        this.materials.forEach(mat => {
          if (!this.max.weightMax) this.max.weightMax = mat.weight
          else this.max.weightMax = Math.max(this.max.weightMax, mat.weight)
          if (!this.max.weightMin) this.max.weightMin = mat.weight
          else this.max.weightMin = Math.min(this.max.weightMin, mat.weight)
          for (const type in mat.boosts[this.type.toLowerCase()]) {
            if (!this.max[type]) {
              this.max[type] = Math.max(
                ...Object.values(mat.boosts[this.type.toLowerCase()][type])
              )
            } else
              this.max[type] = Math.max(
                this.max[type],
                Math.max(
                  ...Object.values(mat.boosts[this.type.toLowerCase()][type])
                )
              )
          }
        })
      })
      .catch(console.error)
  }
}
</script>
<style lang="scss">
table.v-table thead th.column {
  padding: 0 16px;
}
</style>

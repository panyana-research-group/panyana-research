<template>
  <v-dialog
    v-model="model"
    max-width="500px"
  >
    <v-card color="primary" dark>
      <v-card-text class="text-xs-center headline">
        Filter Materials
      </v-card-text>
      <v-data-table
        :headers="headers"
        :items="materials"
        class="pa-2"
        hide-actions
        disable-initial-sort
      >
        <template slot="items" slot-scope="props">
          <tr v-if="filter[props.item.name]">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.rarity.slice(0, 1).toUpperCase() + props.item.rarity.slice(1) }}</td>
            <td>
              <v-layout justify-center>
                <v-checkbox v-model="filter[props.item.name].enabled" style="max-width: 24px" />
              </v-layout>
            </td>
            <td>
              <v-select
                v-model="filter[props.item.name].maxQ"
                :items="qualities"
              />
            </td>
          </tr>
        </template>
        <template slot="no-data">
          <v-alert type="warning" :value="true">
            No data availible. Probably a network issue!
          </v-alert>
        </template>
      </v-data-table>
      <v-card-actions class="justify-center">
        <v-btn color="success" @click="applyFilter">
          Apply
        </v-btn>
        <v-btn color="info" class="primary--text" @click="resetFilter">
          Reset
        </v-btn>
        <v-btn color="warning" class="primary--text" @click="model = false">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'MaterialsFilter',
  data() {
    return {
      model: false,
      materials: [],
      qualities: _.range(1, 11),
      applied: false,
      filter: {},
      headers: [
        { text: 'Material', value: 'name' },
        { text: 'Rarity', value: 'rarity' },
        { text: 'Enabled?', sortable: false, align: 'center' },
        { text: 'Max Quality', sortable: false }
      ]
    }
  },
  created() {
    this.$api.get('/materials').then(res => {
      this.materials = res.data
      this.resetFilter()
    })
  },
  methods: {
    resetFilter() {
      this.materials.forEach(mat => {
        this.filter[mat.name] = {
          enabled: true,
          maxQ: 10
        }
      })
      this.applied = false
      this.model = false
      this.$emit('update', this.filter)
    },
    applyFilter() {
      this.applied = true
      this.model = false
      this.$emit('update', this.filter)
    }
  }
}
</script>

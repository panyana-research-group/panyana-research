<template>
  <v-dialog v-model="model" max-width="500px" persistent>
    <v-toolbar color="primary" dark tabs>
      <v-toolbar-title class="headline text-xs-center" style="width: 100%">
        Options
      </v-toolbar-title>
      <v-spacer />
      <template v-slot:extension>
        <v-tabs
          v-model="tab"
          color="accent"
          dark
          fixed-tabs
          hide-slider
          active-class="v-tabs__item--active accent darken-2"
        >
          <v-tab href="#filter" class="primary--text">
            Filter
          </v-tab>
          <v-tab href="#mats" class="primary--text">
            Materials
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="tab">
      <v-tab-item value="filter">
        <v-card color="primary" dark>
          <v-card-text class="text-xs-center subheading pb-0">
            Filter Materials
          </v-card-text>
          <v-data-table
            id="filterTable"
            :headers="headers"
            :items="materials"
            class="pa-2"
            hide-actions
            disable-initial-sort
          >
            <template slot="items" slot-scope="props">
              <tr v-if="filter[props.item.name]">
                <td>{{ props.item.name }}</td>
                <td>
                  {{
                    props.item.rarity.slice(0, 1).toUpperCase() +
                      props.item.rarity.slice(1)
                  }}
                </td>
                <td>
                  <v-layout justify-center>
                    <v-checkbox
                      v-model="filter[props.item.name].enabled"
                      style="max-width: 24px; max-height: 24px;"
                      @change="change.filter = true"
                    />
                  </v-layout>
                </td>
                <td>
                  <v-select
                    v-model="filter[props.item.name].maxQ"
                    color="accent"
                    hide-details
                    :items="qualities"
                    class="ma-0 py-1 px-0"
                    @change="change.filter = true"
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
            <v-btn :disabled="!change.filter" color="success" @click="applyFilter">
              Apply
            </v-btn>
            <v-btn :disabled="change.filter" color="info" class="primary--text" @click="resetFilter">
              Reset
            </v-btn>
            <v-btn color="warning" class="primary--text" @click="cancelFilter">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
      <v-tab-item value="mats">
        <v-card color="primary" dark>
          <v-card-text class="subheading text-xs-center pb-0">
            Force Materials
          </v-card-text>
          <v-container grid-list-xs fluid pa-2>
            <v-layout row wrap>
              <v-flex v-for="(part, index) in forcedMats" :key="index" xs12 md6>
                <v-layout row wrap class="info matOption ma-1">
                  <v-flex xs12 md8>
                    <v-select
                      v-model="part.mat"
                      :items="selectMats"
                      label="Casing"
                      class="primary--text py-2 px-1"
                      light
                      hide-details
                      clearable
                    />
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-select
                      v-model="part.quality"
                      :items="qualities"
                      label="Q"
                      class="primary--text py-2 px-1"
                      light
                      hide-details
                      clearable
                      single-line
                    />
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions class="justify-center">
            <v-btn :disabled="true" color="success" @click="applyFilter">
              Apply
            </v-btn>
            <v-btn :disabled="change.filter" color="info" class="primary--text" @click="resetFilter">
              Reset
            </v-btn>
            <v-btn color="warning" class="primary--text" @click="model = false; change.filter = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-dialog>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'MaterialsFilter',
  props: {
    name: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      model: false,
      tab: null,
      materials: [],
      selectMats: [],
      qualities: _.range(1, 11),
      applied: false,
      filter: {},
      change: {
        filter: false,
        forced: false
      },
      forcedMats: {
        casing: {
          mat: null,
          quality: null
        },
        mech: {
          mat: null,
          quality: null
        },
        comb: {
          mat: null,
          quality: null
        },
        prop: {
          mat: null,
          quality: null
        }
      },
      headers: [
        { text: 'Material', value: 'name' },
        { text: 'Rarity', value: 'rarity' },
        { text: 'Enabled?', sortable: false, align: 'center' },
        { text: 'Max Quality', sortable: false }
      ]
    }
  },
  mounted() {
    this.$api.get('/materials').then(res => {
      this.materials = res.data
      this.materials.forEach(mat => {
        this.selectMats.push({
          text: mat.name,
          value: mat
        })
      })
      if (localStorage.getItem(this.name + 'filter'))
        this.filter = JSON.parse(localStorage.getItem(this.name + 'filter'))
      else this.resetFilter()
      if (localStorage.getItem(this.name + 'filterApplied'))
        this.applied = JSON.parse(
          localStorage.getItem(this.name + 'filterApplied')
        )
      else {
        this.applied = false
        localStorage.setItem(this.name + 'filterApplied', 'false')
      }
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
      localStorage.setItem(this.name + 'filter', JSON.stringify(this.filter))
    },
    applyFilter() {
      this.applied = true
      localStorage.setItem(this.name + 'filterApplied', 'true')
      localStorage.setItem(this.name + 'filter', JSON.stringify(this.filter))
      this.change.filter = false
      this.$emit('update', this.filter)
    },
    cancelFilter() {
      this.model = false
      this.change.filter = false
      console.log(this.filter)
    }
  }
}
</script>
<style lang="scss">
#filterTable {
  thead > tr {
    height: 40px;
  }
  td {
    height: 40px;
  }
}

.matOption {
  border: 2px solid black;
  border-radius: 3px;
}
</style>

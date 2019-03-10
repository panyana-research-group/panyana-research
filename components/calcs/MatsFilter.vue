<template>
  <v-dialog v-model="model" max-width="500px" persistent>
    <v-toolbar color="primary" dark>
      <v-toolbar-title class="headline secondary--text">
        Options
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="warning" @click="model = false">
        Close
      </v-btn>
    </v-toolbar>
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
    <v-tabs-items v-model="tab">
      <v-tab-item value="filter">
        <v-card color="primary" dark>
          <v-tooltip bottom>
            <v-btn
              slot="activator"
              class="mt-1"
              absolute
              right
              :color="applied.filter ? 'success' : 'error'"
              @click="applied.filter = !applied.filter"
            >
              {{ applied.filter ? 'Enabled' : 'Disabled' }}
            </v-btn>
            Click to {{ applied.filter ? 'disable' : 'enable' }}
          </v-tooltip>
          <v-card-text class="text-xs-center subheading pb-0">
            Filter Materials{{ change.filter ? ' (unsaved changes)' : '' }}
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
                    :disabled="!filter[props.item.name].enabled"
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
            <v-tooltip top class="ma-1">
              <v-btn slot="activator" :disabled="!change.filter" color="success" @click="applyFilterChanges">
                Apply Changes
              </v-btn>
              Click to apply changes made to the filter
            </v-tooltip>
            <v-tooltip top class="ma-1">
              <v-btn slot="activator" color="info" class="primary--text" @click="resetFilter">
                Reset
              </v-btn>
              Click to reset the filter
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-tab-item>
      <v-tab-item value="mats">
        <v-card color="primary" dark>
          <v-tooltip bottom>
            <v-btn
              slot="activator"
              class="mt-1"
              absolute
              right
              :color="applied.parts ? 'success' : 'error'"
              @click="applied.parts = !applied.parts"
            >
              {{ applied.parts ? 'Enabled' : 'Disabled' }}
            </v-btn>
            Click to {{ applied.parts ? 'disable' : 'enable' }}
          </v-tooltip>
          <v-card-text class="subheading text-xs-center pb-0">
            Force Materials{{ change.parts ? ' (unsaved changes)' : '' }}
          </v-card-text>
          <v-container grid-list-xs fluid pa-2>
            <v-layout row wrap>
              <v-flex v-for="(part, index) in parts" :key="index" xs12 md6>
                <v-layout row wrap class="info matOption ma-1">
                  <v-flex xs12 md8>
                    <v-select
                      v-model="part.mat"
                      :items="selectMats"
                      :label="part.name"
                      class="primary--text py-2 px-1"
                      light
                      hide-details
                      clearable
                      @change="change.parts = true"
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
                      @change="change.parts = true"
                    />
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
          <div class="text-xs-center">
            NOTE: Leaving the Quality blank will assume Quality 10 materials
          </div>
          <v-card-actions class="justify-center">
            <v-btn :disabled="!change.parts" color="success" @click="applyPartChanges">
              Apply Changes
            </v-btn>
            <v-btn color="info" class="primary--text" @click="resetParts">
              Reset
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
      applied: {
        filter: false,
        parts: false
      },
      filter: {},
      change: {
        filter: false,
        parts: false
      },
      parts: {
        casing: {
          mat: null,
          quality: null,
          name: 'Casing'
        },
        mech: {
          mat: null,
          quality: null,
          name: 'Mech. Internals'
        },
        comb: {
          mat: null,
          quality: null,
          name: 'Comb. Internals'
        },
        prop: {
          mat: null,
          quality: null,
          name: 'Propeller'
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
        this.selectMats.push(mat.name)
      })
      this.filter = JSON.parse(localStorage.getItem(this.name + 'filter'))
      if (!this.filter) this.resetFilter()
      if (localStorage.getItem(this.name + 'parts'))
        this.parts = JSON.parse(localStorage.getItem(this.name + 'parts'))
      else this.resetParts()
    })
  },
  methods: {
    resetFilter() {
      this.filter = {}
      this.materials.forEach(mat => {
        this.filter[mat.name] = {
          enabled: true,
          maxQ: 10
        }
      })
      this.change.filter = true
    },
    resetParts() {
      this.parts = {
        casing: {
          mat: null,
          quality: null,
          name: 'Casing'
        },
        mech: {
          mat: null,
          quality: null,
          name: 'Mech. Internals'
        },
        comb: {
          mat: null,
          quality: null,
          name: 'Comb. Internals'
        },
        prop: {
          mat: null,
          quality: null,
          name: 'Propeller'
        }
      }
      this.change.parts = true
    },
    applyFilterChanges() {
      localStorage.setItem(this.name + 'filter', JSON.stringify(this.filter))
      this.change.filter = false
    },
    applyPartChanges() {
      localStorage.setItem(this.name + 'parts', JSON.stringify(this.parts))
      this.change.parts = false
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

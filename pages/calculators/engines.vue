<template>
  <v-layout justify-center row wrap>
    <v-flex xs12>
      <v-card color="info">
        <v-form ref="engineForm" v-model="engine.form">
          <v-container grid-list-md fluid>
            <v-layout row wrap justify-center>
              <v-flex grow>
                <v-text-field v-model="engine.res" :rules="[rules.required, rules.number]" box label="Resilience" color="primary" />
              </v-flex>
              <v-flex grow>
                <v-text-field v-model="engine.pwr" :rules="[rules.required, rules.number]" box label="Power" color="primary" />
              </v-flex>
              <v-flex grow>
                <v-text-field v-model="engine.oh" :rules="[rules.required, rules.number]" box label="Overheat" color="primary" />
              </v-flex>
              <v-flex grow>
                <v-text-field v-model="engine.su" :rules="[rules.required, rules.number]" box label="Spin Up" color="primary" />
              </v-flex>
              <v-flex grow>
                <v-text-field v-model="engine.fe" :rules="[rules.required, rules.number]" box label="Fuel Eff." color="primary" />
              </v-flex>
              <v-flex shrink>
                <v-btn color="accent" class="primary--text" @click="filter = true">
                  Filters
                </v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="warning" class="primary--text" @click="reset">
                  Reset
                </v-btn>
              </v-flex>
              <v-flex v-if="filterApplied" xs12 text-xs-center>
                A materials filter has been applied
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card>
    </v-flex>
    <v-flex xs12 md12 lg12 xl6>
      <engine-mats-calc />
    </v-flex>
    <v-flex xs12 md12 lg6>
      <engine-cipher-calc :engine="engine" :filter="filteredMats" />
    </v-flex>
    <v-dialog
      v-if="filteredMats"
      v-model="filter"
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
        >
          <template slot="items" slot-scope="props">
            <tr v-if="filteredMats[props.item.name]">
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.rarity.slice(0, 1).toUpperCase() + props.item.rarity.slice(1) }}</td>
              <td>
                <v-layout justify-center>
                  <v-checkbox v-model="filteredMats[props.item.name].enabled" style="max-width: 24px" />
                </v-layout>
              </td>
              <td>
                <v-select
                  v-model="filteredMats[props.item.name].maxQ"
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
          <v-btn color="success" @click="applyFilters">
            Apply
          </v-btn>
          <v-btn color="info" @click="resetFilters">
            Reset
          </v-btn>
          <v-btn color="warning" @click="filter = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import _ from 'lodash'

import EngineMatsCalc from '@/components/calcs/EngineMaterials'
import EngineCipherCalc from '@/components/calcs/EngineCiphers'
export default {
  name: 'EngineCalculators',
  components: {
    'engine-mats-calc': EngineMatsCalc,
    'engine-cipher-calc': EngineCipherCalc
  },
  head() {
    return {
      title: 'Engine Calculators',
      meta: [
        { hid: 'og:title', name: 'og:title', content: 'Engine Calculators' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Various calculators related to crafting engines'
        }
      ]
    }
  },
  data() {
    return {
      qualities: _.range(1, 11),
      materials: [],
      filter: false,
      filteredMats: {},
      filterApplied: false,
      engineMats: false,
      engine: {
        res: '',
        pwr: '',
        oh: '',
        su: '',
        fe: '',
        form: false
      },
      output: {
        opt: null
      },
      outputCipher: {
        opt: null
      },
      rules: {
        required: v => !!v || 'Required!',
        number: v => !isNaN(v) || 'Must be a number!'
      },
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
      this.resetFilters()
    })
  },
  methods: {
    applyFilters() {
      this.filter = false
      this.filterApplied = true
    },
    resetFilters() {
      this.filter = false
      this.filterApplied = false
      this.materials.forEach(mat => {
        this.filteredMats[mat.name] = {
          enabled: true,
          maxQ: 10
        }
      })
    },
    reset() {
      this.$refs.engineForm.reset()
      this.output = null
    }
  }
}
</script>

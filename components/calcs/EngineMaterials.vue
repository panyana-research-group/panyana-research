<template>
  <base-calc name="Optimal Engine Materials" author="Ziwix" :loading="loading" :form="engine.form" @calc="calc">
    <template v-slot:buttons>
      <v-btn color="accent" class="primary--text" small @click="filterDialog = true">
        Filters
      </v-btn>
      <v-btn :disabled="!engine.form" color="warning" class="primary--text" small @click="reset">
        Reset
      </v-btn>
    </template>
    <v-form ref="engineForm" v-model="engine.form">
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12 pa-0>
            Calculates the optimal materials to use to craft this engine so it will never overheat and go the fastest. Made by Ziwix
          </v-flex>
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
        </v-layout>
      </v-container>
    </v-form>
    <v-container v-if="output" grid-list-md fluid>
      <v-layout row wrap>
        <template v-if="output === 'none'">
          <v-flex xs12 class="text-xs-center warning--text headline">
            No valid material configuration found for that engine!
          </v-flex>
        </template>
        <template v-if="output !== 'none'">
          <v-flex xs12>
            <v-card id="resultsHeader" color="primary">
              <v-card-text class="headline secondary--text text-xs-center">
                Results
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex>
            <v-text-field
              v-model="output.casing"
              :disabled="true"
              outline
              hide-details
              label="Casing"
            />
          </v-flex>
          <v-flex>
            <v-text-field
              v-model="output.mech"
              :disabled="true"
              outline
              hide-details
              label="Mech. Internals"
            />
          </v-flex>
          <v-flex>
            <v-text-field
              v-model="output.comb"
              :disabled="true"
              outline
              hide-details
              label="Comb. Internals"
            />
          </v-flex>
          <v-flex>
            <v-text-field
              v-model="output.prop"
              :disabled="true"
              outline
              hide-details
              label="Propeller"
            />
          </v-flex>
          <v-flex>
            <v-text-field
              v-model="output.speed"
              :disabled="true"
              outline
              hide-details
              label="Speed"
            />
          </v-flex>
          <v-flex>
            <v-text-field
              v-model="output.weight"
              :disabled="true"
              outline
              hide-details
              label="Weight"
            />
          </v-flex>
        </template>
      </v-layout>
    </v-container>
    <v-card-actions v-if="output" class="justify-center">
      <v-btn color="warning" class="primary--text" @click="output = null">
        Clear
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-model="filterDialog"
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
            <tr v-if="filters[props.item.name]">
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.rarity.slice(0, 1).toUpperCase() + props.item.rarity.slice(1) }}</td>
              <td>
                <v-layout justify-center>
                  <v-checkbox v-model="filters[props.item.name].enabled" style="max-width: 24px" />
                </v-layout>
              </td>
              <td>
                <v-select
                  v-model="filters[props.item.name].maxQ"
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
          <v-btn color="warning" @click="filterDialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </base-calc>
</template>
<script>
import _ from 'lodash'

import BaseCalc from '@/components/calcs/BaseCalc'
export default {
  name: 'EngineOptMatsCalc',
  components: {
    'base-calc': BaseCalc
  },
  data() {
    return {
      loading: false,
      filterDialog: false,
      filterApplied: false,
      filters: {},
      output: null,
      materials: [],
      qualities: _.range(1, 11),
      engine: {
        res: '',
        pwr: '',
        oh: '',
        su: '',
        fe: '',
        form: false
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
    calc() {
      this.$api
        .post('/calcs/engine/mats', {
          engine: this.convert(this.engine),
          filter: this.filters
        })
        .then(res => {
          switch (res.data.res) {
            case 'success': {
              this.output = res.data.data
              break
            }
            case 'none found': {
              this.output = 'none'
              break
            }
          }
        })
    },
    convert(obj) {
      const newObj = {}
      Object.keys(obj).forEach(key => {
        newObj[key] = parseInt(obj[key])
      })
      return newObj
    },
    applyFilters() {
      this.filterDialog = false
      this.filterApplied = true
    },
    resetFilters() {
      this.materials.forEach(mat => {
        this.filters[mat.name] = {
          enabled: true,
          maxQ: 10
        }
      })
      this.filterApplied = false
      this.fitlerDialog = false
    },
    reset() {
      this.resetFilters()
      this.$refs.engineForm.reset()
      this.output = null
    }
  }
}
</script>

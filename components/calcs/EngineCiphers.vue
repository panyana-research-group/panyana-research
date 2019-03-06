<template>
  <base-calc name="Optimal Power/OH Ciphering" :loading="loading" :form="engine.form" @calc="calc">
    <template v-slot:buttons>
      <v-btn color="accent" class="primary--text" small @click="$refs.filter.model = true">
        <v-icon left :color="$refs.filter && $refs.filter.applied ? 'green' : 'red'">
          check_circle
        </v-icon>
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
            This calculator only takes into account the Resilience, Spin Up, and Fuel Efficiency of the engine and calculates the optimal stat levels for Power and Overheat Limit to be ciphered to. Made by Ziwix
          </v-flex>
          <v-flex grow>
            <v-text-field v-model="engine.res" :rules="[rules.required, rules.number]" box label="Resilience" color="primary" />
          </v-flex>
          <v-flex grow>
            <v-text-field v-model="engine.su" :rules="[rules.required, rules.number]" box label="Spin Up" color="primary" />
          </v-flex>
          <v-flex grow>
            <v-text-field v-model="engine.fe" :rules="[rules.required, rules.number]" box label="Fuel Eff." color="primary" />
          </v-flex>
        </v-layout>
      </v-container>
      <v-container v-if="output" grid-list-md fluid>
        <v-layout row wrap>
          <template v-if="output === 'none'">
            <v-flex xs12 class="text-xs-center warning--text headline">
              No valid Power and Overheat Limit stats produced an engine that did not overheat!
            </v-flex>
          </template>
          <template v-if="output !== 'none'">
            <v-flex xs12>
              <v-card id="cipherResultsHeader" color="primary">
                <v-card-text class="headline secondary--text text-xs-center">
                  Results
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex>
              <v-text-field v-model="output.points.pwr" :disabled="true" outline hide-details label="Power" />
            </v-flex>
            <v-flex>
              <v-text-field v-model="output.points.oh" :disabled="true" outline hide-details label="Overheat Limit" />
            </v-flex>
          </template>
        </v-layout>
      </v-container>
      <v-card-actions v-if="output" class="justify-center">
        <v-btn color="warning" class="primary--text" @click="output = null">
          Clear
        </v-btn>
      </v-card-actions>
    </v-form>
    <mats-filter ref="filter" @update="filter = $event" />
  </base-calc>
</template>
<script>
import { rules } from '@/components/mixins/rules'
import { convert } from '@/components/mixins/convert'
import BaseCalc from '@/components/calcs/BaseCalc'
import MatsFilter from '@/components/calcs/MatsFilter.vue'
export default {
  name: 'EngineCipherMatsCalc',
  components: {
    'base-calc': BaseCalc,
    'mats-filter': MatsFilter
  },
  mixins: [rules, convert],
  data() {
    return {
      loading: false,
      output: null,
      engine: {
        res: '',
        su: '',
        fe: '',
        form: false
      },
      filter: null
    }
  },
  methods: {
    calc() {
      this.loading = true
      this.$api
        .post('/calcs/engine/cipher', {
          engine: this.convert(this.engine),
          filter: this.filter
        })
        .then(res => {
          this.loading = false
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
          this.$nextTick(() => this.$vuetify.goTo('#cipherResultsHeader'))
        })
    },
    reset() {
      this.$refs.filter.resetFilter()
      this.$refs.engineForm.reset()
      this.output = null
    }
  }
}
</script>

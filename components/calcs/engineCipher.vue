<template>
  <v-card color="info" elevation="5">
    <v-toolbar color="primary" dense>
      <v-toolbar-title class="secondary--text">
        Optimal Power/OH Ciphering
      </v-toolbar-title>
      <v-spacer />
      <v-progress-circular v-if="loading" indeterminate color="info" />
      <v-btn :disabled="!engine.form" small color="accent" class="primary--text" @click="calc">
        Calculate
      </v-btn>
    </v-toolbar>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 pa-0>
          This calculator only takes into account the Resilience, Spin Up, and Fuel Efficiency of the engine and calculates the optimal stat levels for Power and Overheat Limit to be ciphered to. Made by Ziwix
        </v-flex>
        <v-flex v-if="output && output === 'none'" xs12 class="text-xs-center warning--text headline">
          No valid Power and Overheat Limit stats produced an engine that did not overheat!
        </v-flex>
        <v-flex v-if="output && output !== 'none'">
          <v-text-field v-model="output.points.pwr" :disabled="true" outline hide-details label="Power" />
        </v-flex>
        <v-flex v-if="output && output !== 'none'">
          <v-text-field v-model="output.points.oh" :disabled="true" outline hide-details label="Overheat Limit" />
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions v-if="output" class="justify-center">
      <v-btn color="warning" class="primary--text" @click="output = null">
        Clear
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'EngineCipherCalc',
  props: {
    engine: {
      type: Object,
      default: () => null
    },
    filter: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      output: null
    }
  },
  methods: {
    convert(obj) {
      const newObj = {}
      Object.keys(obj).forEach(key => {
        newObj[key] = parseInt(obj[key])
      })
      return newObj
    },
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
        })
    }
  }
}
</script>

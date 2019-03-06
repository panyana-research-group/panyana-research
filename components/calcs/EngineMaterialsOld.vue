<template>
  <v-card color="info" elevation="5">
    <v-toolbar color="primary" dense card>
      <v-toolbar-title class="secondary--text">
        Optimal Engine Materials
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        :disabled="!engine.form"
        :loading="loading"
        small
        color="accent"
        class="primary--text"
        @click="calc"
      >
        Calculate
      </v-btn>
    </v-toolbar>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 pa-0>
          Calculates the optimal materials to use to craft this engine so it will never overheat and go the fastest. Made by Ziwix
        </v-flex>
        <v-flex v-if="output && output === 'none'" xs12 class="text-xs-center warning--text headline">
          No valid material configuration found for that engine!
        </v-flex>
        <v-flex v-if="output && output !== 'none'">
          <v-text-field
            v-model="output.casing"
            :disabled="true"
            outline
            hide-details
            label="Casing"
          />
        </v-flex>
        <v-flex v-if="output && output !== 'none'">
          <v-text-field
            v-model="output.mech"
            :disabled="true"
            outline
            hide-details
            label="Mech. Internals"
          />
        </v-flex>
        <v-flex v-if="output && output !== 'none'">
          <v-text-field
            v-model="output.comb"
            :disabled="true"
            outline
            hide-details
            label="Comb. Internals"
          />
        </v-flex>
        <v-flex v-if="output && output !== 'none'">
          <v-text-field
            v-model="output.prop"
            :disabled="true"
            outline
            hide-details
            label="Propeller"
          />
        </v-flex>
        <v-flex v-if="output && output !== 'none'">
          <v-text-field
            v-model="output.speed"
            :disabled="true"
            outline
            hide-details
            label="Speed"
          />
        </v-flex>
        <v-flex v-if="output && output !== 'none'">
          <v-text-field
            v-model="output.weight"
            :disabled="true"
            outline
            hide-details
            label="Weight"
          />
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
  name: 'EngineMatsCalc',
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
    calc() {
      this.$api
        .post('/calcs/engine/mats', {
          engine: this.convert(this.engine),
          filter: this.filter
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
    }
  }
}
</script>

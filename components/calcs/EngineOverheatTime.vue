<template>
  <base-calc name="Engine Overheat Time" :form="form" :loading="loading" author="Ziwix" @calc="calc">
    <template v-slot:buttons>
      <v-btn :disabled="!form" color="warning" class="secondary--text" small @click="reset">
        Reset
      </v-btn>
    </template>
    <v-form ref="ohForm" v-model="form">
      <v-container grid-list-md fluid>
        <v-layout row wrap justify-center>
          <v-flex xs12 pa-0>
            Calculates the Overheat Time (if there is any) for an engine based on its Overheat Limit, Power, and Cooling Factor. Formula from Ziwix.
          </v-flex>
          <v-flex grow>
            <v-text-field v-model="stats.pwr" :rules="[rules.required, rules.number]" color="primary" label="Power" box />
          </v-flex>
          <v-flex grow>
            <v-text-field v-model="stats.oh" :rules="[rules.required, rules.number]" color="primary" label="Overheat Limit" box />
          </v-flex>
          <v-flex grow>
            <v-text-field v-model="stats.cf" :rules="[rules.required, rules.number]" color="primary" label="Cooling Factor" box />
          </v-flex>
          <template v-if="output.sec">
            <v-flex xs12>
              <v-divider />
            </v-flex>
            <v-flex grow>
              <v-text-field v-model="output.sec" :disabled="true" outline label="Overheat Time (seconds)" hide-details />
            </v-flex>
            <v-flex grow>
              <v-text-field v-model="output.min" :disabled="true" outline label="Overheat Time (minutes)" hide-details />
            </v-flex>
          </template>
        </v-layout>
      </v-container>
      <v-card-actions v-if="output.sec" class="justify-center">
        <v-btn color="warning" class="primary--text" @click="output = {}">
          Clear
        </v-btn>
      </v-card-actions>
    </v-form>
  </base-calc>
</template>
<script>
import { rules } from '@/components/mixins/rules'
import { convert } from '@/components/mixins/convert'
import BaseCalc from '@/components/calcs/BaseCalc'
export default {
  name: 'EngineOverheatTimeCalc',
  components: {
    'base-calc': BaseCalc
  },
  mixins: [rules, convert],
  data() {
    return {
      loading: false,
      form: false,
      stats: {
        pwr: null,
        oh: null,
        cf: null
      },
      output: {}
    }
  },
  methods: {
    calc() {
      this.loading = true
      this.$api
        .post('/calcs/engine/overheat', this.convert(this.stats))
        .then(res => {
          this.loading = false
          this.output = {
            sec: `${res.data.time} seconds`,
            min: `${Math.floor(res.data.time / 60)} minutes and ${res.data
              .time -
              Math.floor(res.data.time / 60) * 60} seconds`
          }
        })
    },
    reset() {
      this.output = {}
      this.form = false
      this.$refs.ohForm.reset()
    },
    round(value, decs) {
      return Number(Math.round(value + 'e' + decs) + 'e-' + decs)
    }
  }
}
</script>

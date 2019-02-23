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
                <v-btn color="warning" class="primary--text" @click="reset">
                  Reset
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card>
    </v-flex>
    <v-flex xs12 md12 lg6>
      <v-card color="info" elevation="5">
        <v-toolbar color="primary" dense card>
          <v-toolbar-title class="secondary--text">
            Optimal Engine Materials
          </v-toolbar-title>
          <v-spacer />
          <v-btn :disabled="!engine.form" small color="accent" class="primary--text" @click="optMatsCalc">
            Calculate
          </v-btn>
        </v-toolbar>
        <v-container v-if="output.opt" grid-list-md fluid>
          <v-layout row wrap>
            <v-flex v-if="output.opt === 'none'" xs12 class="text-xs-center warning--text headline">
              No valid material configuration found for that engine!
            </v-flex>
            <v-flex v-if="output.opt !== 'none'">
              <v-text-field
                v-model="output.opt.casing"
                :disabled="true"
                outline
                hide-details
                label="Casing"
              />
            </v-flex>
            <v-flex v-if="output.opt !== 'none'">
              <v-text-field
                v-model="output.opt.mech"
                :disabled="true"
                outline
                hide-details
                label="Mech. Internals"
              />
            </v-flex>
            <v-flex v-if="output.opt !== 'none'">
              <v-text-field
                v-model="output.opt.comb"
                :disabled="true"
                outline
                hide-details
                label="Comb. Internals"
              />v-if="output.opt !== 'none'" v-model="output.opt.prop"
            </v-flex>
            <v-flex v-if="output.opt !== 'none'">
              <v-text-field
                v-model="output.opt.speed"
                :disabled="true"
                outline
                hide-details
                label="Propeller"
              />
            </v-flex>
            <v-flex v-if="output.opt !== 'none'">
              <v-text-field
                v-model="output.opt.speed"
                :disabled="true"
                outline
                hide-details
                label="Speed"
              />
            </v-flex>
            <v-flex v-if="output.opt !== 'none'">
              <v-text-field
                v-model="output.opt.weight"
                :disabled="true"
                outline
                hide-details
                label="Weight"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions v-if="output.opt" class="justify-center">
          <v-btn color="warning" class="primary--text" @click="output.opt = null">
            Clear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 md12 lg6>
      <v-toolbar color="primary" dense>
        <v-toolbar-title class="secondary--text">
          Optimal Power/OH Ciphering
        </v-toolbar-title>
        <v-spacer />
        <v-btn :disabled="!engine.form || true" small color="accent" class="primary--text">
          Calculate
        </v-btn>
      </v-toolbar>
      <v-card color="accent" />
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  name: 'EngineCalculators',
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
      rules: {
        required: v => !!v || 'Required!',
        number: v => !isNaN(v) || 'Must be a number!'
      }
    }
  },
  methods: {
    reset() {
      this.$refs.engineForm.reset()
      this.output.opt = null
    },
    optMatsCalc() {
      const engine = {}
      Object.keys(this.engine).forEach(key => {
        engine[key] = parseInt(this.engine[key])
      })
      this.$api.post('/calcs/engine/mats', { engine }).then(res => {
        switch (res.data.res) {
          case 'success': {
            this.output.opt = res.data.data
            break
          }
          case 'none found': {
            this.output.opt = 'none'
            break
          }
        }
      })
    }
  }
}
</script>

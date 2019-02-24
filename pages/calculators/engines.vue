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
      <engine-mats-calc :engine="engine" />
    </v-flex>
    <v-flex xs12 md12 lg6>
      <engine-cipher-calc :engine="engine" />
    </v-flex>
  </v-layout>
</template>
<script>
import EngineMatsCalc from '../../components/calcs/engineMats'
import EngineCipherCalc from '../../components/calcs/engineCipher'
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
      }
    }
  },
  methods: {
    reset() {
      this.$refs.engineForm.reset()
      this.output = null
    }
  }
}
</script>

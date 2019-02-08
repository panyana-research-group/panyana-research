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
            <v-flex>
              <v-text-field v-model="output.opt.casing" :disabled="true" outline hide-details label="Casing" />
            </v-flex>
            <v-flex>
              <v-text-field v-model="output.opt.mech" :disabled="true" outline hide-details label="Mech. Internals" />
            </v-flex>
            <v-flex>
              <v-text-field v-model="output.opt.comb" :disabled="true" outline hide-details label="Comb. Internals" />
            </v-flex>
            <v-flex>
              <v-text-field v-model="output.opt.prop" :disabled="true" outline hide-details label="Propeller" />
            </v-flex>
            <v-flex>
              <v-text-field v-model="output.opt.speed" :disabled="true" outline hide-details label="Speed" />
            </v-flex>
            <v-flex>
              <v-text-field v-model="output.opt.weight" :disabled="true" outline hide-details label="Weight" />
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
        <v-btn :disabled="!engine.form" small color="accent" class="primary--text">
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
      materials: require('~/assets/data/materials.json'),
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
      },
      mechPwr: [
        25.17,
        19.21,
        11.26,
        11.26,
        13.25,
        9.27,
        19.21,
        23.18,
        15.23,
        9.27,
        3.31,
        9.27,
        3.31,
        31.13,
        3.31
      ].map(x => x / 100),
      mechOH: [
        4.6,
        16.6,
        13.51,
        19.31,
        13.51,
        31.66,
        4.63,
        13.51,
        28.19,
        37.07,
        4.63,
        10.42,
        4.63,
        46.33,
        4.63
      ].map(x => x / 100),
      combPwr: [
        16.23,
        28.15,
        22.19,
        19.21,
        19.21,
        30.79,
        19.21,
        7.28,
        13.25,
        31.13,
        4.3,
        7.28,
        4.3,
        46.03,
        4.3
      ].map(x => x / 100),
      combOH: [
        3.47,
        11.58,
        9.65,
        13.51,
        9.65,
        21.24,
        3.47,
        9.65,
        19.31,
        25.48,
        3.4,
        7.34,
        3.47,
        31.27,
        3.47
      ].map(x => x / 100)
    }
  },
  methods: {
    reset() {
      this.$refs.engineForm.reset()
      this.output.opt = null
    },
    optMatsCalc() {
      this.output.opt = { speed: 0 }
      Object.keys(this.engine).map((key, index) => {
        this.engine[key] =
          key === 'form' ? this.engine[key] : parseInt(this.engine[key])
      })
      for (let mech = 0; mech < this.materials.length; mech++) {
        for (let comb = 0; comb < this.materials.length; comb++) {
          for (let casing = 0; casing < this.materials.length; casing++) {
            for (let prop = 0; prop < this.materials.length; prop++) {
              const pwr =
                this.engine.pwr +
                this.engine.pwr * this.materials[mech].boosts.engine.mech.pwr +
                this.engine.pwr * this.materials[comb].boosts.engine.comb.pwr
              const oh =
                this.engine.oh +
                this.engine.oh * this.materials[mech].boosts.engine.mech.oh +
                this.engine.oh * this.materials[comb].boosts.engine.comb.oh
              const cf = this.getCF(
                this.materials[casing].name,
                this.materials[prop].name
              )

              const weight = this.getWeight(
                this.materials[casing].name,
                this.materials[mech].name,
                this.materials[comb].name,
                this.materials[prop].name
              )

              let speed = 50 * Math.sqrt((2 * pwr) / weight)

              if (!isNaN(this.ohTime(pwr, oh, cf))) speed = 0
              if (speed > this.output.opt.speed) {
                this.output.opt = {
                  casing: this.materials[casing].name,
                  mech: this.materials[mech].name,
                  comb: this.materials[comb].name,
                  prop: this.materials[prop].name,
                  speed: this.round(speed, 2),
                  weight: this.round(weight, 2)
                }
              }
            }
          }
        }
      }
    },
    getWeight(mCasing, mMech, mComb, mProp) {
      const casing =
        (this.engine.res + this.engine.pwr + this.engine.su) *
        this.materials.find(x => x.name === mCasing).weight
      const mech =
        (this.engine.pwr + this.engine.fe) *
        this.materials.find(x => x.name === mMech).weight
      const comb =
        (this.engine.pwr + this.engine.su) *
        this.materials.find(x => x.name === mComb).weight
      const prop =
        (this.engine.su + this.engine.oh) *
        this.materials.find(x => x.name === mProp).weight
      return 0.7 * 2 * (casing + mech + comb + prop)
    },
    getCF(casing, other, quality = 10) {
      return (
        this.materials.find(x => x.name === casing).cf +
        this.materials.find(x => x.name === other).cf *
          (2 / 3) *
          ((10 + quality) / 20)
      )
    },
    ohTime(pwr, oh, cf) {
      return Math.round(
        Math.log(
          (0.755234428801821 *
            Math.pow(parseInt(pwr), 1.42) *
            Math.pow(parseInt(oh), -1.08)) /
            (0.755234428801821 *
              Math.pow(parseInt(pwr), 1.42) *
              Math.pow(parseInt(oh), -1.08) -
              500 *
                (0.0016915 *
                  Math.pow(parseInt(cf), 0.5) *
                  Math.pow(parseInt(oh), 0.25) *
                  Math.pow(parseInt(pwr), -0.335)))
        ) /
          (0.0016915 *
            Math.pow(parseInt(cf), 0.5) *
            Math.pow(parseInt(oh), 0.25) *
            Math.pow(parseInt(pwr), -0.335))
      )
    },
    round(value, decimals) {
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
    }
  }
}
</script>

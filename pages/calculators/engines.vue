<template>
  <v-container class="primary" xs12 fluid>
    <v-layout justify-center row>
      <v-flex xs6 class="mx-4">
        <v-toolbar color="info">
          <v-toolbar-title class="white--text">
            Optimal Engine Materials
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon>
            <v-icon>link</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card color="accent">
          <v-form ref="optEngineMats" v-model="engineMats">
            <v-container>
              <v-layout row wrap>
                <v-flex xs2 offset-xs1>
                  <v-text-field v-model="optEngineMats.res" box label="Resilience" color="secondary" :rules="[rules.required, rules.number]" />
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="optEngineMats.pwr" box label="Power" color="secondary" :rules="[rules.required, rules.number]" />
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="optEngineMats.oh" box label="Overheat" color="secondary" :rules="[rules.required, rules.number]" />
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="optEngineMats.su" box label="Spin Up" color="secondary" :rules="[rules.required, rules.number]" />
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="optEngineMats.fe" box label="Fuel Eff." color="secondary" :rules="[rules.required, rules.number]" />
                </v-flex>
                <v-flex v-if="optEngineMats.output" xs3>
                  <v-text-field v-model="optEngineMats.output.casing" box :disabled="true" label="Casing" />
                </v-flex>
                <v-flex v-if="optEngineMats.output" xs3>
                  <v-text-field v-model="optEngineMats.output.mech" box :disabled="true" label="Mech. Internals" />
                </v-flex>
                <v-flex v-if="optEngineMats.output" xs3>
                  <v-text-field v-model="optEngineMats.output.comb" box :disabled="true" label="Comb. Internals" />
                </v-flex>
                <v-flex v-if="optEngineMats.output" xs3>
                  <v-text-field v-model="optEngineMats.output.prop" box :disabled="true" label="Prop" />
                </v-flex>
                <v-flex v-if="optEngineMats.output" xs5 offset-xs1>
                  <v-text-field v-model="optEngineMats.output.speed" box :disabled="true" label="Speed" />
                </v-flex>
                <v-flex v-if="optEngineMats.output" xs5>
                  <v-text-field v-model="optEngineMats.output.weight" box :disabled="true" label="Weight" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <v-card-actions class="justify-center">
            <v-btn color="success" :disabled="!engineMats" @click="optMatsCalc">
              Calculate
            </v-btn>
            <v-btn color="warning" @click="reset('optEngineMats')">
              Reset
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs6 class="mx-4">
        <v-toolbar color="info">
          <v-toolbar-title class="white--text">
            Optimal Power/OH Ciphering
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon>
            <v-icon>link</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card color="accent" />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
// eslint-disable-file
export default {
  name: 'EngineCalculators',
  head: {
    title: 'Engine Calculators'
  },
  data() {
    return {
      materials: require('~/assets/data/materials.json'),
      engineMats: false,
      optEngineMats: {
        res: '',
        pwr: '',
        oh: '',
        su: '',
        fe: '',
        output: null
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
    reset(calc) {
      this.$refs[calc].reset()
      this.optEngineMats.output = null
    },
    optMatsCalc() {
      this.optEngineMats.output = { speed: 0 }
      Object.keys(this.optEngineMats).map((key, index) => {
        this.optEngineMats[key] =
          key === 'output'
            ? this.optEngineMats[key]
            : parseInt(this.optEngineMats[key])
      })
      for (let mech = 0; mech < this.materials.length; mech++) {
        for (let comb = 0; comb < this.materials.length; comb++) {
          for (let casing = 0; casing < this.materials.length; casing++) {
            for (let prop = 0; prop < this.materials.length; prop++) {
              let pwr =
                this.optEngineMats.pwr +
                this.optEngineMats.pwr * this.mechPwr[mech] +
                this.optEngineMats.pwr * this.combPwr[comb]
              let oh =
                this.optEngineMats.oh +
                this.optEngineMats.oh * this.mechOH[mech] +
                this.optEngineMats.oh * this.combOH[comb]
              let cf = this.getCF(
                this.materials[casing].name,
                this.materials[prop].name
              )

              // eslint-disable-next-line
              let weight = this.getWeight(this.materials[casing].name, this.materials[mech].name, this.materials[comb].name, this.materials[prop].name)

              let speed = 50 * Math.sqrt((2 * pwr) / weight)

              if (!isNaN(this.ohTime(pwr, oh, cf))) speed = 0
              if (speed > this.optEngineMats.output.speed) {
                this.optEngineMats.output = {
                  casing: this.materials[casing].name,
                  mech: this.materials[mech].name,
                  comb: this.materials[comb].name,
                  prop: this.materials[prop].name,
                  speed,
                  weight
                }
              }
            }
          }
        }
      }
      this.optEngineMats.output.done = true
    },
    /* eslint prefer-const: "off" */
    getWeight(mCasing, mMech, mComb, mProp) {
      let casing =
        (this.optEngineMats.res +
          this.optEngineMats.pwr +
          this.optEngineMats.su) *
        this.materials.find(x => x.name === mCasing).weight
      let mech =
        (this.optEngineMats.pwr + this.optEngineMats.fe) *
        this.materials.find(x => x.name === mMech).weight
      let comb =
        (this.optEngineMats.pwr +
          this.optEngineMats.fe +
          this.optEngineMats.oh) *
        this.materials.find(x => x.name === mComb).weight
      let prop =
        (this.optEngineMats.su + this.optEngineMats.oh) *
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
    }
  }
}
</script>

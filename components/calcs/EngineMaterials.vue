<template>
  <base-calc name="Optimal Engine Materials" author="Ziwix" :loading="loading" :form="engine.form" @calc="calc">
    <template v-slot:buttons>
      <span v-if="$refs.options" class="body-1 text-xs-right secondary--text">
        Filter
        <v-icon small :color="$refs.options.applied.filter ? 'success' : 'error'">
          {{ $refs.options.applied.filter ? 'mdi-checkbox-marked' : 'mdi-close-box' }}
        </v-icon><br>
        Forced Mats
        <v-icon small :color="$refs.options.applied.parts ? 'success' : 'error'">
          {{ $refs.options.applied.parts ? 'mdi-checkbox-marked' : 'mdi-close-box' }}
        </v-icon>
      </span>
      <v-btn color="accent" class="primary--text" small @click="$refs.options.model = true">
        Options
      </v-btn>
      <v-btn :disabled="!engine.form" color="warning" class="primary--text" small @click="reset">
        Reset
      </v-btn>
    </template>
    <v-form ref="engineForm" v-model="engine.form">
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12 py-0>
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
            <v-card id="matsResultsHeader" color="primary">
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
    <mats-filter ref="options" name="EngineMats" />
  </base-calc>
</template>
<script>
import { rules } from '@/components/mixins/rules'
import { convert } from '@/components/mixins/convert'
import BaseCalc from '@/components/calcs/BaseCalc'
import MatsFilter from '@/components/calcs/MatsFilter'
export default {
  name: 'EngineOptMatsCalc',
  components: {
    'base-calc': BaseCalc,
    'mats-filter': MatsFilter
  },
  mixins: [rules, convert],
  data() {
    return {
      loading: false,
      output: null,
      materials: [],
      engine: {
        res: '',
        pwr: '',
        oh: '',
        su: '',
        fe: '',
        form: false
      }
    }
  },
  mounted() {
    if (localStorage.getItem('engineMatsCalc'))
      this.engine = JSON.parse(localStorage.getItem('engineMatsCalc'))
  },
  methods: {
    calc() {
      localStorage.setItem('engineMatsCalc', JSON.stringify(this.engine))
      this.loading = true
      this.$api
        .post('/calcs/engine/mats', {
          engine: this.convert(this.engine),
          filter: this.$refs.options.applied.filter
            ? this.$refs.options.filter
            : null,
          parts: this.$refs.options.applied.parts
            ? this.$refs.options.parts
            : null
        })
        .then(res => {
          this.loading = false
          switch (res.data.res) {
            case 'success': {
              this.output = res.data.data
              this.$nextTick(() => this.$vuetify.goTo('#matsResultsHeader'))
              break
            }
            case 'none found': {
              this.output = 'none'
              break
            }
          }
        })
    },
    reset() {
      this.$refs.options.resetFilter()
      this.$refs.options.resetParts()
      this.$refs.engineForm.reset()
      localStorage.removeItem('engineMatsCalc')
      this.output = null
    }
  }
}
</script>

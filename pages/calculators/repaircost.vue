<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 md12 lg6>
      <base-calc name="Repair Cost" author="Machine Maker" :form="form" :loading="loading" @calc="calc">
        <template v-slot:buttons>
          <v-btn :disabled="!form" color="warning" class="primary--text" small @click="reset">
            Reset
          </v-btn>
        </template>
        <v-form ref="repairForm" v-model="form">
          <v-container grid-list-md fluid>
            <v-layout row wrap justify-center>
              <v-flex xs12 py-0 mb-2>
                Calculates the repair tick of any ship part based on the parts resilience value and the casing cost (or the base resilience value, the material used for the casing and the casing cost).
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="data.res"
                  label="Resilience"
                  :rules="[rules.required, rules.number]"
                  box
                  color="primary"
                />
              </v-flex>
              <v-flex xs12 md6>
                <v-tooltip top>
                  The cost of crafting the casing component of the part
                  <v-text-field
                    slot="activator"
                    v-model="data.casingCost"
                    label="Casing Cost"
                    :rules="[rules.required, rules.number]"
                    box
                    color="primary"
                  />
                </v-tooltip>
              </v-flex>
              <v-flex xs12>
                <v-layout justify-center>
                  <v-checkbox
                    v-model="data.useBaseRes"
                    label="Use base resilience?"
                    color="primary"
                    hide-details
                    class="mt-0 pt-0"
                    style="max-width: 200px;"
                  />
                </v-layout>
              </v-flex>
              <v-flex xs12 md6>
                <v-select
                  v-model="data.casingMat"
                  :items="materials"
                  :disabled="!data.useBaseRes"
                  label="Casing Material"
                  :rules="data.useBaseRes ? [rules.required] : []"
                />
              </v-flex>
              <v-flex xs12 md6>
                <v-select
                  v-model="data.casingQuality"
                  :items="qualities"
                  :disabled="!data.useBaseRes"
                  :rules="data.useBaseRes ? [rules.required] : []"
                  label="Casing Quality"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-container v-if="haveResult" grid-list-md>
          <v-layout row wrap justify-center>
            <v-flex xs12>
              <v-card id="repairResultsHeader" color="primary">
                <v-card-text class="headline secondary--text text-xs-center">
                  Results
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field v-model="result.salvage" outline :disabled="true" hide-details label="Salvage per tick" />
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field v-model="result.repair" outline :disabled="true" hide-details label="Repair per tick" />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions v-if="haveResult" class="justify-center">
          <v-btn color="warning" class="primary--text" @click="haveResult = false">
            Clear
          </v-btn>
        </v-card-actions>
      </base-calc>
    </v-flex>
  </v-layout>
</template>
<script>
import BaseCalc from '@/components/calcs/BaseCalc'
import { rules } from '@/components/mixins/rules'

import _ from 'lodash'
export default {
  name: 'ResilienceCalc',
  components: {
    BaseCalc
  },
  mixins: [rules],
  head() {
    return {
      title: 'Repair Cost Calculator',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Repair Cost Calculator'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Calculator for determining ship part repair costs'
        }
      ]
    }
  },
  data() {
    return {
      form: false,
      haveResult: false,
      loading: false,
      data: {
        res: null,
        casingMat: null,
        casingCost: null,
        casingQuality: null,
        useBaseRes: false
      },
      result: {
        salvage: null,
        repair: null
      },
      materials: [],
      qualities: _.range(1, 11)
    }
  },
  mounted() {
    this.$api.get('/materials').then(res => {
      res.data.forEach(mat => {
        this.materials.push({
          text: mat.name,
          value: mat
        })
      })
    })
  },
  methods: {
    calc() {
      this.loading = true
      this.$api.post('/calcs/repaircost', this.data).then(res => {
        this.loading = false
        this.haveResult = true
        this.result = res.data.data
        this.$nextTick(() => this.$vuetify.goTo('#repairResultsHeader'))
      })
    },
    reset() {
      this.haveResult = false
      this.$refs.repairForm.reset()
    }
  }
}
</script>

<template>
  <v-layout justify-center row wrap>
    <v-flex xs12 md12 lg6>
      <base-calc
        id="inputHeader"
        name="Atlas Sky Core Capacity"
        author="Machine Maker"
        :form="true"
        :loading="loading"
        @calc="calc"
      >
        <v-container grid-list-md fluid>
          <v-layout row wrap justify-center>
            <v-flex xs12 pa-0>
              Calculates the Atlas Sky Core Capacity with chosen metals and qualities. Made by Machine Maker.
            </v-flex>
            <v-flex xs6>
              <v-select
                v-model="casing"
                :items="materials"
                label="Select a casing material"
                color="accent"
                style="max-width: 200px; float: right"
                hide-details
                dense
              />
            </v-flex>
            <v-flex xs6 text-xs-left>
              <v-tooltip top>
                <v-btn slot="activator" color="accent" class="primary--text" @click="copy">
                  Copy first entry
                </v-btn>
                Copies the first material entry for all the materials
              </v-tooltip>
            </v-flex>
            <v-flex xs12 mt-3>
              <v-data-table
                v-model="selected"
                :headers="headers.input"
                :items="parts"
                :loading="data.loading ? 'info': false"
                item-key="name"
                select-all="accent"
                disable-initial-sort
                hide-actions
                dark
              >
                <template v-slot:items="props">
                  <td>
                    <v-checkbox v-model="props.selected" primary hide-details />
                  </td>
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.base }} kgs</td>
                  <td>
                    <v-select
                      v-model="parts[props.index].material"
                      :items="materials"
                      :disabled="!props.selected"
                      color="accent"
                      label="Material"
                      dense
                    />
                  </td>
                  <td>
                    <v-select
                      v-model="props.item.quality"
                      :items="qualities"
                      :disabled="!props.selected"
                      color="accent"
                      dense
                    />
                  </td>
                </template>
                <template v-slot:no-data>
                  <v-alert v-if="!data.loading && data.error" type="error" class="primary--text" :value="true">
                    Error loading material data. Probably a network issue.
                  </v-alert>
                  <v-alert v-if="data.loading && !data.error" type="info" class="primary--text" :value="true">
                    Loading material data...
                  </v-alert>
                </template>
              </v-data-table>
            </v-flex>
            <template v-if="haveResult">
              <v-flex xs12 mt-4>
                <v-card id="resultsHeader" color="primary">
                  <v-card-text class="headline secondary--text text-xs-center">
                    Results
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12>
                <v-data-table
                  id="resultTable"
                  :headers="headers.result"
                  :items="parts"
                  disable-initial-sort
                  hide-actions
                  dark
                >
                  <template v-slot:items="props">
                    <tr v-if="result[props.item.name]">
                      <td>{{ props.item.name }}</td>
                      <td>{{ result[props.item.name] ? `Q${result[props.item.name].material.quality} ${result[props.item.name].material.name}` : 'N/A' }}</td>
                      <td class="text-xs-right">
                        {{ result[props.item.name] ? `${result[props.item.name].capacity} kgs` : 'N/A' }}
                      </td>
                      <td class="text-xs-right">
                        {{ result[props.item.name] ? `${result[props.item.name].capacity - result[props.item.name].weight} kgs` : 'N/A' }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-flex>
              <v-flex>
                <v-text-field readonly :value="totalCapacity" label="Total Sky Core Capacity" outline hide-details />
              </v-flex>
              <v-flex>
                <v-text-field readonly :value="usableCapacity" label="Usable Sky Core Capacity" outline hide-details />
              </v-flex>
              <v-flex xs12 text-xs-center>
                <v-btn color="warning" class="primary--text" @click="clear">
                  Clear
                </v-btn>
              </v-flex>
            </template>
          </v-layout>
        </v-container>
      </base-calc>
    </v-flex>
  </v-layout>
</template>
<script>
import _ from 'lodash'

import BaseCalc from '@/components/calcs/BaseCalc'
export default {
  name: 'SkycoreCalc',
  components: {
    BaseCalc
  },
  head() {
    return {
      title: 'Sky Core Calculator',
      meta: [
        { hid: 'og:title', name: 'og:title', content: 'Sky Core Calculator' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Calculator for determining sky core capacity'
        }
      ]
    }
  },
  data() {
    return {
      loading: false,
      casing: null,
      parts: [],
      selected: [],
      materials: [],
      qualities: _.range(1, 11),
      result: {},
      haveResult: false,
      data: {
        loading: false,
        error: false
      },
      headers: {
        input: [
          { text: 'Part Name', value: 'name', sortable: false },
          { text: 'Base Lift', value: 'base', sortable: false },
          { text: 'Material', sortable: false },
          { text: 'Quality', sortable: false, width: '80px' }
        ],
        result: [
          { text: 'Part Name', value: 'name' },
          { text: 'Material', sortable: false },
          { text: 'Lift Capacity', sortable: false, align: 'right' },
          { text: 'Usable Capacity', sortable: false, align: 'right' }
        ]
      }
    }
  },
  computed: {
    totalCapacity() {
      let cap = 0
      this.parts.forEach(part => {
        if (!this.result[part.name]) return
        cap += this.result[part.name].capacity
      })
      return this.round(cap, 2)
    },
    usableCapacity() {
      let cap = 0
      this.parts.forEach(part => {
        if (!this.result[part.name]) return
        cap += this.round(
          this.result[part.name].capacity - this.result[part.name].weight,
          2
        )
      })
      return cap
    }
  },
  mounted() {
    this.data.loading = true
    this.$api
      .get('/materials/all')
      .then(res => {
        res.data.forEach(mat => {
          this.materials.push({
            text: mat.name,
            value: mat
          })
        })
        this.data.loading = false
        this.casing = this.materials[0].value
        this.$api
          .get('/skycore')
          .then(res => {
            this.parts = res.data.parts
            this.parts.forEach(part => {
              part.material = this.materials[this.materials.length - 1].value
              part.quality = 10
              this.selected.push(part)
            })
          })
          .catch(console.error)
      })
      .catch(err => {
        this.data.loading = false
        this.data.error = true
        console.error(err)
      })
  },
  methods: {
    clear() {
      this.result = {}
      this.haveResult = false
      this.$vuetify.goTo('#inputHeader')
    },
    calc() {
      this.loading = true
      this.$api
        .post('/calcs/skycore/capacity', {
          parts: this.selected,
          casing: this.casing
        })
        .then(res => {
          this.loading = false
          this.result = res.data
          this.haveResult = true
          this.$nextTick(() => this.$vuetify.goTo('#resultsHeader'))
        })
        .catch(console.error)
    },
    copy() {
      const material = this.parts[0].material
      const quality = this.parts[0].quality
      this.parts.forEach(part => {
        part.material = material
        part.quality = quality
      })
      const copy = this.parts.slice(0)
      this.parts = []
      this.parts = copy
    },
    round(value, decs) {
      return Number(Math.round(value + 'e' + decs) + 'e-' + decs)
    }
  }
}
</script>
<style lang="scss">
#resultTable {
  tr:hover {
    background: inherit;
  }
  td {
    height: 30px;
  }
}
</style>

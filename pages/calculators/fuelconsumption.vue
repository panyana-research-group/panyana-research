<template>
  <v-layout row wrap>
    <v-flex>
      <v-card color="primary" style="max-width: 700px" class="mx-auto">
        <v-card-text class="headline secondary--text text-xs-center">
          <div style="position: absolute; top: 0; right: 0;">
            <v-btn :disabled="Object.keys(engines).length < 1" color="warning" class="mr-0" @click="engines = {}; update()">
              Clear List
            </v-btn>
            <v-btn color="success" class="ml-0" @click="addEngine = true">
              Add Engine
            </v-btn>
          </div>
          Engines
        </v-card-text>
        <v-data-table
          :headers="headers"
          :items="Object.keys(engines)"
          hide-actions
          class="pa-2"
          dark
        >
          <template slot="items" slot-scope="props">
            <td>{{ engines[props.item].name }}</td>
            <td>
              <v-text-field
                v-model="engines[props.item].quantity"
                type="number"
                @change="update"
              />
            </td>
            <td>{{ engines[props.item].fe }}</td>
          </template>
          <template slot="no-data">
            <v-alert type="info" :value="true" class="primary--text">
              No Engines!
              <v-btn color="success" small @click="addEngine = true">
                Add Engine
              </v-btn>
            </v-alert>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-card color="info" elevation="5" max-width="700px" class="mx-auto">
        <v-toolbar color="primary" dense>
          <v-toolbar-title class="secondary--text">
            Fuel Consumption
          </v-toolbar-title>
          <v-spacer />
          <v-progress-circular v-if="loading" indeterminate color="info" />
          <v-btn small color="accent" class="primary--text" @click="calc">
            Calculate
          </v-btn>
        </v-toolbar>
        <v-container v-if="usage" grid-list-md fluid>
          <v-layout row wrap>
            <v-flex shrink class="mx-auto">
              <v-text-field
                v-model="usage.sec"
                :disabled="true"
                label="Fuel Usage per Second"
                outline
              />
            </v-flex>
            <v-flex shrink class="mx-auto">
              <v-text-field
                v-model="usage.min"
                :disabled="true"
                label="Fuel Usage per Minute"
                outline
              />
            </v-flex>
            <v-flex xs12 text-xs-center>
              <v-btn color="warning" @click="usage = null">
                Clear
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
    <v-dialog v-model="addEngine" max-width="500px">
      <v-card color="primary" dark>
        <v-card-text class="text-xs-center headline secondary--text">
          Add Engine
        </v-card-text>
        <v-form ref="addEngineForm" v-model="form.value">
          <v-layout row wrap>
            <v-flex xs12 lg6 px-2>
              <v-text-field
                v-model="form.name"
                name="name"
                label="Engine Name"
                color="secondary"
                box
                clearable
                persistent-hint
                :rules="[rules.required]"
              />
            </v-flex>
            <v-flex xs6 lg6 px-2>
              <v-text-field
                v-model="form.fe"
                name="fe"
                label="Fuel Efficiency"
                color="secondary"
                box
                clearable
                persistent-hint
                :rules="[rules.required, rules.number]"
              />
            </v-flex>
          </v-layout>
        </v-form>
        <v-card-text v-show="isInList()">
          This engine configuration is already in your list!
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn :disabled="!form || isInList()" color="success" @click="add">
            Add
          </v-btn>
          <v-btn color="warning" @click="addEngine = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
export default {
  name: 'FuelConsumptionCalc',
  data() {
    return {
      usage: null,
      form: {
        name: null,
        fe: null,
        value: false
      },
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Quantity', sortable: false, width: '40px' },
        { text: 'Fuel Efficiency', sortable: false }
      ],
      engines: {},
      addEngine: false,
      loading: false,
      rules: {
        required: v => !!v || 'Required!',
        number: v => !isNaN(v) || 'Must be a number!'
      }
    }
  },
  mounted() {
    this.engines = JSON.parse(localStorage.getItem('engines')) || {}
  },
  methods: {
    calc() {
      this.loading = true
      this.$api
        .post('/calcs/engine/fueleff', { engines: this.engines })
        .then(res => {
          this.usage = {
            sec: this.round(res.data.fuelEff, 3),
            min: this.round(res.data.fuelEff * 60, 3)
          }
          this.loading = false
        })
    },
    isInList() {
      return Object.keys(this.engines).includes(
        this.form.name + '_' + this.form.fe
      )
    },
    round(value, decs) {
      return Number(Math.round(value + 'e' + decs) + 'e-' + decs)
    },
    update() {
      localStorage.setItem('engines', JSON.stringify(this.engines))
    },
    add() {
      this.engines[this.form.name + '_' + this.form.fe] = {
        name: this.form.name,
        fe: this.form.fe,
        quantity: 1
      }
      this.update()
      this.addEngine = false
      this.$refs.addEngineForm.reset()
    }
  }
}
</script>

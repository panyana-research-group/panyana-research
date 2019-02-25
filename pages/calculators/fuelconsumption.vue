<template>
  <v-layout row wrap>
    <v-flex xs6 offset-xs3>
      <v-card color="primary">
        <v-card-text class="headline secondary--text text-xs-center">
          Engines
        </v-card-text>
        <v-data-table
          :headers="headers"
          :items="engines"
          hide-actions
          class="pa-2"
          dark
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td />
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
        <v-card-actions class="justify-center">
          <v-btn :disabled="!form" color="success" @click="add">
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
      form: {
        name: null,
        fe: null,
        value: false
      },
      headers: [
        { text: 'Name', value: name },
        { text: 'Quantity', sortable: false },
        { text: 'Fuel Efficiency', sortable: false }
      ],
      engines: [],
      addEngine: false,
      loading: false,
      rules: {
        required: v => !!v || 'Required!',
        number: v => !isNaN(v) || 'Must be a number!'
      }
    }
  },
  methods: {
    calc() {
      this.loading = true
      this.loading = false
    },
    add() {
      this.engines.push({
        name: this.form.name,
        fe: this.form.fe
      })
    }
  }
}
</script>

<template>
  <new-data :show="show" name="Clothing">
    <v-form ref="form" v-model="form">
      <v-layout row wrap justify-center>
        <v-flex xs12 md6 px-1>
          <v-text-field
            ref="clothingNameField"
            v-model="formData.name"
            :rules="[rules.required]"
            label="Clothing Name"
            color="accent"
            box
            persistent-hint
          />
        </v-flex>
        <v-flex xs12 md6 px-1>
          <v-select
            v-model="formData.type"
            :rules="[rules.required]"
            :items="['Head', 'Torso', 'Legs']"
            label="Type"
            color="accent"
            box
            persistent-hint
          />
        </v-flex>
        <v-flex xs12 md6 px-1>
          <v-select
            v-model="formData.rarity"
            :items="['Common', 'Uncommon', 'Rare', 'Exotic', 'Stash', 'unknown']"
            :rules="[rules.required]"
            label="Item Rarity"
            color="accent"
            box
            persistent-hint
          />
        </v-flex>
      </v-layout>
    </v-form>
    <template v-slot:actions>
      <v-btn color="error" class="secondary--text" @click="$emit('close'); reset()">
        Cancel
      </v-btn>
      <v-btn color="info" class="primary--text" @click="$refs.form.reset()">
        Reset
      </v-btn>
      <v-btn :disabled="!form" :loading="loading" color="success" class="secondary--text" @click="add">
        Add
      </v-btn>
    </template>
  </new-data>
</template>
<script>
import NewData from '@/components/data/NewData'
import { rules } from '@/components/mixins/rules'
export default {
  name: 'NewClothing',
  components: {
    NewData
  },
  mixins: [rules],
  props: {
    show: Boolean
  },
  data() {
    return {
      form: null,
      loading: false,
      formData: {
        name: null,
        type: null,
        rarity: null
      }
    }
  },
  watch: {
    show: function(newVal, oldVal) {
      if (newVal && localStorage.getItem('clothingTypeSelected') !== 'all')
        this.formData.type =
          localStorage.getItem('clothingTypeSelected') || null

      if (newVal) {
        this.$nextTick(() => this.$refs.clothingNameField.focus())
      }
    }
  },
  mounted() {
    this.reset()
    this.formData.type = localStorage.getItem('clothingTypeSelected') || null
  },
  methods: {
    add() {
      this.loading = true
      this.$api
        .post('/clothing', this.formData)
        .then(res => {
          this.$emit('close', 'success')
          this.reset()
        })
        .catch(err => {
          console.error(err)
          this.$emit('close', 'error')
          this.reset()
        })
    },
    reset() {
      this.loading = false
      this.$refs.form.reset()
    }
  }
}
</script>

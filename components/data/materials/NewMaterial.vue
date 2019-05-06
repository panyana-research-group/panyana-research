<template>
  <new-data :show="show" name="Material">
    <v-form ref="form" v-model="form">
      <v-layout row wrap justify-center>
        <v-flex xs12 md6 px-1>
          <v-text-field
            ref="materialNameField"
            v-model="formData.name"
            :rules="[rules.required]"
            label="Material Name"
            color="accent"
            box
            persistent-hint
          />
        </v-flex>
        <v-flex xs12 md6 px-1>
          <v-select
            v-model="formData.type"
            :items="[{ t: 'Metal', v: 'metal' }, { t: 'Wood', v: 'wood'}]"
            :rules="[rules.required]"
            item-text="t"
            item-value="v"
            label="Type"
            color="accent"
            box
            persistent-hint
          />
        </v-flex>
        <v-flex xs12 md6 px-1>
          <v-select
            v-model="formData.rarity"
            :items="rarities"
            :rules="[rules.required]"
            item-text="t"
            item-value="v"
            label="Rarity"
            color="accent"
            box
            persistent-hint
          />
        </v-flex>
        <v-flex xs12 md6 px-1>
          <v-text-field
            v-model.number="formData.weight"
            :rules="[rules.required, rules.number]"
            label="Weight"
            color="accent"
            box
            persistent-hint
          />
        </v-flex>
        <v-flex xs12 md6 px-1>
          <v-text-field
            v-model="formData.color"
            :rules="[rules.required]"
            label="Color"
            color="accent"
            box
            persistent-hint
          />
        </v-flex>
      </v-layout>
    </v-form>
    <template v-slot:actions>
      <v-btn color="warning" class="secondary--text" @click="$emit('close'); reset()">
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
  name: 'NewMaterial',
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
        weight: null,
        rarity: null,
        color: null,
        type: null
      },
      rarities: [
        { t: 'Common', v: 'common' },
        { t: 'Uncommon', v: 'uncommon' },
        { t: 'Rare', v: 'rare' },
        { t: 'Exotic', v: 'exotic' }
      ]
    }
  },
  watch: {
    show: function(newVal, oldVal) {
      if (newVal) this.$nextTick(() => this.$refs.materialNameField.focus())
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    add() {
      this.loading = true
      this.$api
        .post('/materials', this.formData)
        .then(res => {
          console.log(res)
          this.$emit('close', 'success')
        })
        .catch(err => {
          console.error(err)
          this.$emit('close', 'error')
        })
        .finally(() => {
          this.loading = false
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

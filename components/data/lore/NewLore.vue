<template>
  <new-data :show="show" name="Lore">
    <v-form ref="form" v-model="form">
      <v-layout row wrap>
        <v-flex xs12 md6 px-1>
          <v-text-field
            id="loreTitle"
            ref="loreTitleField"
            v-model="formData.title"
            name="loreTitle"
            label="Lore Title"
            box
            color="secondary"
            clearable
            persistent-hint
            :rules="[rules.required, noQuotesRule]"
          />
        </v-flex>
        <v-flex xs12 md6 px-1>
          <v-text-field
            id="pageCount"
            v-model="formData.pageCount"
            name="pageCount"
            label="Page Count"
            persistent-hint
            box
            color="secondary"
            clearable
            :rules="[rules.required, rules.number]"
          />
        </v-flex>
      </v-layout>
    </v-form>
    <template v-slot:actions>
      <v-btn color="error" @click="$emit('close'); reset()">
        Cancel
      </v-btn>
      <v-btn color="info" class="primary--text" @click="$refs.form.reset()">
        Reset
      </v-btn>
      <v-btn color="success" :loading="loading" :disabled="!form" @click="submit">
        Add
      </v-btn>
    </template>
  </new-data>
</template>
<script>
import _ from 'lodash'

import NewData from '@/components/data/NewData'
import { rules } from '@/components/mixins/rules'
export default {
  name: 'NewLore',
  components: {
    NewData
  },
  mixins: [rules],
  props: {
    show: Boolean
  },
  data() {
    return {
      loading: false,
      form: false,
      formData: {
        title: null,
        pageCount: null
      },
      noQuotesRule: v =>
        (!!v && v.indexOf('"') < 0) ||
        `You cannot use " in the name! Use ' instead`
    }
  },
  watch: {
    show: function(newVal, oldVal) {
      if (newVal) this.$nextTick(() => this.$refs.loreTitleField.focus())
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    submit() {
      const story = {
        title: this.formData.title,
        onWiki: `0/${this.formData.pageCount}`,
        missingWiki: _.range(1, parseInt(this.formData.pageCount) + 1).join(
          ', '
        ),
        missingPics: `title, ${_.range(
          1,
          parseInt(this.formData.pageCount) + 1
        ).join(', ')}`
      }
      this.loading = true
      this.$api
        .post('/lore', story)
        .then(res => {
          this.$emit('close', 'success')
          this.reset()
        })
        .catch(err => {
          console.log(err)
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

<template>
  <v-dialog :value="show" max-width="500px">
    <v-card color="primary" dark>
      <v-card-title class="title secondary--text justify-center">
        New Story
      </v-card-title>
      <v-card-text>
        <v-form ref="newLore" v-model="addComplete">
          <v-text-field
            id="loreTitle"
            v-model="loreTitle"
            name="loreTitle"
            label="Lore Title"
            box
            color="secondary"
            clearable
            persistent-hint
            :rules="rules.titleRules"
          />
          <v-text-field
            id="pageCount"
            v-model="pageCount"
            name="pageCount"
            label="Page Count"
            persistent-hint
            box
            color="secondary"
            clearable
            :rules="rules.pageCountRules"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="error" dark @click="$emit('close')">
          Cancel
        </v-btn>
        <v-btn color="success" :disabled="!addComplete" @click="submit">
          Add
        </v-btn>
      </v-card-actions>
      <div v-if="loading" class="text-xs-center" style="height: 40px">
        <v-progress-circular v-show="loading" indeterminate color="secondary" class="ml-2 dark" />
        Updating...
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'NewStory',
  props: {
    show: Boolean
  },
  data() {
    return {
      loading: false,
      addComplete: false,
      pageCount: '',
      loreTitle: '',
      rules: {
        titleRules: [
          v => !!v || 'Name is required',
          v =>
            (!!v && v.indexOf('"') < 0) ||
            `You cannot use " in the name! Use ' instead`
        ],
        pageCountRules: [
          v => !!v || 'Page count is required',
          v => !isNaN(v) || 'Must be a number'
        ]
      }
    }
  },
  methods: {
    submit() {
      const story = {
        title: this.loreTitle,
        onWiki: `0/${this.pageCount}`,
        missingWiki: _.range(1, parseInt(this.pageCount) + 1).join(', '),
        missingPics: `title, ${_.range(1, parseInt(this.pageCount) + 1).join(
          ', '
        )}`
      }
      this.loading = true
      this.$api
        .post('/lore', story)
        .then(res => {
          this.$emit('close', 'success')
        })
        .catch(err => {
          console.log(err)
          this.$emit('close', 'error')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

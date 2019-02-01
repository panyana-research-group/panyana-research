<template>
  <v-dialog :value="show" max-width="500px">
    <v-card dark>
      <v-card-title class="title justify-center">
        Add Lore
      </v-card-title>
      <v-card-text>
        <v-form ref="newLore" v-model="addComplete">
          <v-text-field
            id="loreTitle"
            v-model="loreTitle"
            name="loreTitle"
            label="Lore Title"
            box
            color="info"
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
            color="info"
            clearable
            :rules="rules.pageCountRules"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="error" dark @click="close">
          Cancel
        </v-btn>
        <v-btn color="success" :disabled="!addComplete" @click="submit()">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'NewStory',
  props: {
    show: Boolean
  },
  data() {
    return {
      addComplete: false,
      showDialog: true,
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
  mounted() {
    this.showDialog = this.show
  },
  methods: {
    submit() {
      this.addLore = false
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

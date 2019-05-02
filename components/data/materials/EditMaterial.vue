<template>
  <edit-data :show="show" name="Material" :item="item || null">
    <v-form v-if="item || !isEmpty(formData)" ref="form" v-model="form">
      <v-layout row wrap>
        <v-flex xs12 px-1>
          <v-text-field
            v-model.lazy="formData.weight"
            :rules="[rules.required, rules.number]"
            label="Weight"
            color="accent"
            box
            persistent-hint
          />
        </v-flex>
      </v-layout>
    </v-form>
    <template v-slot:actions>
      <v-btn color="error" class="secondary--text" @click="$emit('close')">
        Cancel
      </v-btn>
      <v-btn color="info" class="primary--text" @click="reset">
        Reset
      </v-btn>
      <v-btn :disabled="!form" :loading="loading" color="success" class="secondary--text" @click="edit">
        Edit
      </v-btn>
    </template>
  </edit-data>
</template>
<script>
import EditData from '@/components/data/EditData'
// import UploadButton from '@/components/UploadButton'
import { rules } from '@/components/mixins/rules'
export default {
  name: 'EditMaterial',
  components: {
    EditData
    // UploadButton
  },
  mixins: [rules],
  props: {
    show: Boolean,
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: false,
      loading: false,
      formData: {}
    }
  },
  watch: {
    item: function(newVal, oldVal) {
      if (!newVal) this.formData = { weight: null }
      else {
        Object.assign(this.formData, this.item)
      }
    }
  },
  methods: {
    reset() {
      this.formData = this.resetObj(this.formData)
      this.$nextTick(() => Object.assign(this.formData, this.item))
    },
    edit() {
      console.log('edit')
    },
    isEmpty(obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) return false
      }
      return true
    },
    resetObj(obj) {
      const copy = Object.assign({}, obj)
      for (const i in copy) {
        if (copy.hasOwnProperty(i)) {
          if (typeof copy[i] === 'object') {
            copy[i] = this.resetObj(copy[i])
          } else copy[i] = null
        }
      }
      return copy
    }
  }
}
</script>

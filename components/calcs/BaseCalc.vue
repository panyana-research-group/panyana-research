<template>
  <v-card color="info" elevation="5">
    <v-toolbar color="primary" dense card>
      <v-toolbar-title class="secondary--text">
        {{ name || '' }}
        <span v-if="author" class="body-2 font-weight-regular">
          by: {{ author }}
        </span>
      </v-toolbar-title>
      <v-spacer />
      <slot name="buttons" />
      <v-btn
        :disabled="form === null ? false : !form"
        :loading="loading"
        small
        color="success"
        @click="emit"
      >
        Calculate
      </v-btn>
    </v-toolbar>
    <slot />
  </v-card>
</template>
<script>
export default {
  name: 'BaseCalc',
  props: {
    name: {
      type: String,
      default: null
    },
    author: {
      type: String,
      default: null
    },
    form: {
      type: Boolean,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emit() {
      this.$emit('calc')
    }
  }
}
</script>

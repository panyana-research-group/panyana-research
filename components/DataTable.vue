<template>
  <v-card color="info" elevation="5">
    <v-toolbar color="primary" extension-height="65px" dense card>
      <v-toolbar-title class="secondary--text">
        {{ name || '' }}
      </v-toolbar-title>
      <v-spacer />
      <slot name="buttons" />
      <v-btn
        v-if="add"
        :loading="loading"
        color="success"
        class="secondary--text"
        small
        @click="$emit('add')"
      >
        Add{{ name ? ' ' + name : '' }}
      </v-btn>
      <template v-if="useSearch" v-slot:extension>
        <v-text-field
          v-model="searchModel"
          append-icon="search"
          :label="`Search ${name}`"
          color="accent"
          class="grow"
          persistent-hint
          box
          hide-details
          clearable
          dark
        />
        <slot name="extension" />
      </template>
    </v-toolbar>
    <slot />
    <v-snackbar v-model="snack.show" :timeout="5000" :color="snack.color">
      {{ snack.text }}
      <v-btn dark flat @click.native="snack.show = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-card>
</template>
<script>
export default {
  name: 'DataTable',
  props: {
    name: {
      type: String,
      default: null
    },
    add: Boolean,
    useSearch: Boolean,
    search: {
      type: String,
      default: null
    },
    loading: Boolean,
    snack: {
      type: Object,
      default: () => {
        return {
          text: 'none',
          color: 'error',
          show: false
        }
      }
    }
  },
  computed: {
    searchModel: {
      get() {
        return this.search
      },
      set(value) {
        this.$emit('update:search', value)
      }
    }
  }
}
</script>

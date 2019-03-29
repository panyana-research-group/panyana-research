<template>
  <v-card color="info" elevation="5">
    <v-toolbar color="primary" extension-height="65px" dense card>
      <v-toolbar-title class="secondary--text">
        {{ name || '' }}
      </v-toolbar-title>
      <v-spacer />
      <slot name="buttons" />
      <v-btn v-if="add" color="success" class="secondary--text" small @click="$emit('add')">
        Add{{ name ? ' ' + name : '' }}
      </v-btn>
      <template v-if="useSearch" v-slot:extension>
        <v-text-field
          v-model="searchModel"
          append-icon="search"
          label="Search Clothing"
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

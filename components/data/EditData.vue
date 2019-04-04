<template>
  <v-dialog :value="show" max-width="500px" persistent>
    <v-card color="primary" dark>
      <v-card-title class="title secondary--text justify-center pb-0">
        Edit{{ name ? ' ' + name : '' }}{{ item && item.type ? ' ' + item.type.slice(0,1).toUpperCase() + item.type.slice(1) : '' }}
      </v-card-title>
      <v-card-title v-if="item" class="body-2 secondary--text justify-center py-0">
        {{ item.name || '' }}
      </v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions class="justify-center">
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'EditData',
  props: {
    name: {
      type: String,
      default: null
    },
    item: {
      type: Object,
      default: () => {}
    },
    show: Boolean
  }
}
</script>

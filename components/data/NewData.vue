<template>
  <v-dialog :value="show" max-width="500px" persistent>
    <v-card color="primary" dark>
      <v-card-title class="title secondary--text justify-center">
        New{{ name ? ' ' + name : '' }}
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
  name: 'NewData',
  props: {
    name: {
      type: String,
      default: null
    },
    show: Boolean
  }
}
</script>

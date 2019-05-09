<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 md8 lg6>
      <engine-oh-time-calc />
    </v-flex>
  </v-layout>
</template>
<script>
import EngineOverheatTimeCalc from '@/components/calcs/EngineOverheatTime'
export default {
  name: 'OverheatCalc',
  components: {
    'engine-oh-time-calc': EngineOverheatTimeCalc
  },
  head() {
    return {
      title: 'Engine Overheat Time',
      meta: [
        { hid: 'og:title', name: 'og:title', content: 'Engine Overheat Time' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Calculates the overheat time for engines'
        }
      ]
    }
  }
}
</script>

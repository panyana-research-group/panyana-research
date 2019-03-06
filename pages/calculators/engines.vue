<template>
  <v-layout justify-center row wrap>
    <v-flex xs12 md12 lg12 xl6>
      <engine-mats-calc />
    </v-flex>
    <v-flex xs12 md12 lg12 xl6>
      <engine-cipher-calc />
    </v-flex>
  </v-layout>
</template>
<script>
import EngineMatsCalc from '@/components/calcs/EngineMaterials'
import EngineCipherCalc from '@/components/calcs/EngineCiphers'
export default {
  name: 'EngineCalculators',
  components: {
    'engine-mats-calc': EngineMatsCalc,
    'engine-cipher-calc': EngineCipherCalc
  },
  head() {
    return {
      title: 'Engine Calculators',
      meta: [
        { hid: 'og:title', name: 'og:title', content: 'Engine Calculators' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Various calculators related to crafting engines'
        }
      ]
    }
  }
}
</script>

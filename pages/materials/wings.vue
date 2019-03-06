<template>
  <materials-chart type="Wing" :type-options="options" :headers="headers" />
</template>
<script>
import MaterialsChart from '@/components/MaterialBoostChart'
export default {
  name: 'WingMaterialsChart',
  components: {
    'materials-chart': MaterialsChart
  },
  head() {
    return {
      title: 'Wing Boosts',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Wing Boosts'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Shows various materials effects on crafting wings'
        }
      ]
    }
  },
  data() {
    return {
      options: [
        { text: 'Mechanical Internals', value: 'mech' },
        { text: 'Aileron', value: 'aileron' }
      ],
      headers: {
        mech: [
          { text: 'Power', value: 'boosts.wing.mech.pwr' },
          { text: 'Pivot Spd.', value: 'boosts.wing.mech.piv' }
        ],
        aileron: [
          { text: 'Power', value: 'boosts.wing.aileron.pwr' },
          { text: 'Pivot Spd.', value: 'boosts.wing.aileron.piv' }
        ]
      }
    }
  }
}
</script>

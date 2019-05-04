<template>
  <materials-chart type="Wing" :type-options="options" :headers="headers" embed />
</template>
<script>
import MaterialsChart from '@/components/MaterialBoostChart'
export default {
  name: 'WingMaterialsChart',
  layout: 'embed',
  components: {
    'materials-chart': MaterialsChart
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

<template>
  <materials-chart type="Engine" :type-options="options" :headers="headers" embed />
</template>
<script>
import MaterialsChart from '@/components/MaterialBoostChart'
export default {
  name: 'EngineMaterialsChart',
  layout: 'embed',
  components: {
    'materials-chart': MaterialsChart
  },
  data() {
    return {
      options: [
        { text: 'Mechanical Internals', value: 'mech' },
        { text: 'Combustion Internals', value: 'comb' },
        { text: 'Propeller', value: 'prop' }
      ],
      headers: {
        mech: [
          { text: 'Power', value: 'boosts.engine.mech.pwr' },
          { text: 'Overheat', value: 'boosts.engine.mech.oh' },
          { text: 'Fuel Eff.', value: 'boosts.engine.mech.fe' }
        ],
        comb: [
          { text: 'Power', value: 'boosts.engine.comb.pwr' },
          { text: 'Overheat', value: 'boosts.engine.comb.oh' },
          { text: 'Spin Up', value: 'boosts.engine.comb.su' }
        ],
        prop: [
          { text: 'Spin Up', value: 'boosts.engine.prop.su' },
          { text: 'Fuel Efficiency', value: 'boosts.engine.prop.fe' }
        ]
      }
    }
  }
}
</script>

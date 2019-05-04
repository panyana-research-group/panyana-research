<template>
  <materials-chart type="Cannon/Swivel" :type-options="options" :headers="headers" embed />
</template>
<script>
import MaterialsChart from '@/components/MaterialBoostChart'
export default {
  name: 'CannonSwivelMaterialsChart',
  layout: 'embed',
  components: {
    MaterialsChart
  },
  data() {
    return {
      options: [
        { text: 'Firing Mechanism', value: 'firing' },
        { text: 'Barrel', value: 'barrel' },
        { text: 'Ammo Loader', value: 'ammo' }
      ],
      headers: {
        firing: [
          { text: 'Power', value: 'boosts["cannon/swivel"].firing.pwr' },
          { text: 'Rate Of Fire', value: 'boosts["cannon/swivel"].firing.rof' }
        ],
        barrel: [
          { text: 'Power', value: 'boosts["cannon/swivel"].firing.pwr' },
          { text: 'Capacity', value: 'boosts["cannon/swivel"].firing.cap' },
          { text: 'Overheat Limit', value: 'boosts["cannon/swivel"].firing.oh' }
        ],
        ammo: [
          { text: 'Capacity', value: 'boosts["cannon/swivel"].firing.cap' },
          {
            text: 'Overheat Limit',
            value: 'boosts["cannon/swivel"].firing.oh'
          },
          { text: 'Rate Of Fire', value: 'boosts["cannon/swivel"].firing.rof' }
        ]
      }
    }
  }
}
</script>

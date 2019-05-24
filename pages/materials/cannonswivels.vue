<template>
  <materials-chart type="Cannon/Swivel" :type-options="options" :headers="headers" />
</template>
<script>
import MaterialsChart from '@/components/MaterialBoostChart'
export default {
  name: 'CannonSwivelMaterialsChart',
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
          { text: 'Power', value: 'boosts.cannon/swivel.firing.pwr' },
          { text: 'Rate Of Fire', value: 'boosts.cannon/swivel.firing.rof' }
        ],
        barrel: [
          { text: 'Power', value: 'boosts.cannon/swivel.barrel.pwr' },
          { text: 'Capacity', value: 'boosts.cannon/swivel.barrel.cap' },
          { text: 'Overheat Limit', value: 'boosts.cannon/swivel.barrel.oh' }
        ],
        ammo: [
          { text: 'Capacity', value: 'boosts.cannon/swivel.ammo.cap' },
          {
            text: 'Overheat Limit',
            value: 'boosts.cannon/swivel.ammo.oh'
          },
          { text: 'Rate Of Fire', value: 'boosts.cannon/swivel.ammo.rof' }
        ]
      }
    }
  }
}
</script>

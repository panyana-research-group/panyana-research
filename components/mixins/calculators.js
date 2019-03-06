export const calculators = {
  data() {
    return {
      calculatorsButtonInfo: {
        name: 'Calculators',
        icon: 'mdi-calculator',
        rows: [
          { name: 'Engine', icon: 'mdi-engine', to: '/calculators/engines' },
          {
            name: 'Overheat',
            icon: 'mdi-radiator',
            to: '/calculators/overheat'
          },
          {
            name: 'Fuel Consumption',
            icon: 'local_gas_station',
            to: '/calculators/fuelconsumption'
          },
          {
            name: 'Atlas Sky Core Capacity',
            icon: 'mdi-arrow-up-bold-circle',
            to: '/calculators/skycore'
          }
        ]
      }
    }
  }
}

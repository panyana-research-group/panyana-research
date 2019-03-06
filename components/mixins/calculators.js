export const calculators = {
  data() {
    return {
      calculatorsButtonInfo: {
        name: 'Calculators',
        icon: 'mdi-calculator',
        rows: [
          {
            name: 'Engine Materials',
            icon: 'mdi-engine',
            to: '/calculators/engines'
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

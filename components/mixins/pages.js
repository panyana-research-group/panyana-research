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
          },
          {
            name: 'Repair Cost',
            icon: 'mdi-wrench',
            to: '/calculators/repaircost'
          }
        ]
      }
    }
  }
}

export const materials = {
  data() {
    return {
      materialsButtonInfo: {
        name: 'Material Info',
        icon: 'mdi-information',
        rows: [
          {
            name: 'Cooling',
            icon: 'mdi-radiator-off',
            to: '/materials/cooling'
          },
          { name: 'Engines', icon: 'mdi-engine', to: '/materials/engines' },
          {
            name: 'Wings',
            icon: 'mdi-airplane-takeoff',
            to: '/materials/wings'
          },
          {
            name: 'Cannons/Swivels',
            icon: 'mdi-pistol',
            to: '/materials/cannonswivels'
          },
          {
            name: 'Resilience',
            icon: 'mdi-hard-hat',
            to: '/materials/resilience'
          },
          {
            name: 'Atlas Core Boosts',
            icon: 'mdi-arrow-up-bold-circle',
            to: '/materials/skycore'
          }
        ]
      }
    }
  }
}

export const data = {
  data() {
    return {
      dataButtonInfo: {
        name: 'Data',
        icon: 'mdi-database',
        rows: [
          { name: 'Materials', icon: 'mdi-information', to: '/data/materials' },
          { name: 'Clothing', icon: 'mdi-tshirt-crew', to: '/data/clothing' },
          { name: 'Salvage', icon: 'attachment' },
          { name: 'Procedurals', icon: 'memory' },
          { name: 'Lore', icon: 'mdi-book-open-variant', to: '/data/lore' },
          { name: 'Schematics', icon: 'settings' }
        ]
      }
    }
  }
}

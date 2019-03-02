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
          { name: 'Cannons/Swivels', icon: 'mdi-pistol' },
          {
            name: 'Resilience',
            icon: 'mdi-hard-hat',
            to: '/materials/resilience'
          }
        ]
      }
    }
  }
}

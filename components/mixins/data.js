export const data = {
  data() {
    return {
      dataButtonInfo: {
        name: 'Data',
        icon: 'mdi-database',
        rows: [
          { name: 'Clothing', icon: 'mdi-tshirt-crew' },
          { name: 'Salvage', icon: 'attachment' },
          { name: 'Procedurals', icon: 'memory' },
          { name: 'Lore', icon: 'mdi-book-open-variant', to: '/data/lore' },
          { name: 'Schematics', icon: 'settings' }
        ]
      }
    }
  }
}

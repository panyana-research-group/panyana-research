import chroma from 'chroma-js'
export const boosts = {
  data() {
    return {
      baseHeaders: [
        { text: 'Name', value: 'name', width: '110px', align: 'right' },
        {
          text: 'Weight',
          value: 'weight',
          width: '50px',
          align: 'center',
          class: 'px-0'
        }
      ],
      scale: chroma
        .bezier(['lightyellow', 'orange', 'deeppink', 'darkred'])
        .scale(),
      pagination: {
        sortBy: 'weight',
        rowsPerPage: -1
      },
      max: {}
    }
  },
  methods: {
    getStyle(value, type) {
      switch (type) {
        case 'statValue': {
          if (value === 0) {
            return {
              backgroundColor: '#949494',
              color: '#000000'
            }
          }
          const color = this.scale
            .domain([0, this.max[this.slot]])(value)
            .hex()
          return {
            backgroundColor: color,
            color:
              chroma.contrast(this.$vuetify.theme.primary, color) > 4.5
                ? this.$vuetify.theme.primary
                : this.$vuetify.theme.secondary
          }
        }
        case 'weight': {
          const color = this.scale
            .domain([this.max.weightMin, this.max.weightMax])(value)
            .hex()
          return {
            backgroundColor: color,
            color:
              chroma.contrast(this.$vuetify.theme.primary, color) > 4.5
                ? this.$vuetify.theme.primary
                : this.$vuetify.theme.secondary,
            textAlign: 'center',
            borderRight: '5px solid black'
          }
        }
      }
    },
    round(value, decs) {
      return Number(Math.round(value + 'e' + decs) + 'e-' + decs)
    }
  }
}

<template>
  <v-container class="accent" xs12 fluid>
    <v-flex xs10 offset-xs1>
      <table id="cooling-data">
        <tr>
          <td class="upper-corner text-xs-center body-2">
            Quality
            <v-select v-model="quality"
                      :items="qualities"
                      single-line
                      hide-details
                      color="secondary"
                      class="quality-select pt-0 mt-0 mx-1"
            />
          </td>
          <td v-for="mat in Object.keys(baseData)" :key="mat" class="material" :class="mat.toLowerCase()">
            <div style="width: 65px;">{{ mat }}</div>
          </td>
        </tr>
        <tr v-for="mat in Object.keys(baseData)" :key="mat+'Row'">
          <td class="material" :class="mat.toLowerCase()">{{ mat }}</td>
          <td v-for="mat2 in Object.keys(baseData)" :key="mat2+'Item'" class="number" :class="cfClass(baseData[mat2]+baseData[mat]*(2/3)*(10+quality)/20)">
            {{ baseData[mat2]+baseData[mat]*(2/3)*(10+quality)/20 }}
          </td>
        </tr>
      </table>
    </v-flex>
  </v-container>
</template>
<script>
export default {
  name: "Cooling",
  metaInfo: {
    title: "Cooling Factor"
  },
  data() {
    return {
      baseData: require("../assets/data/cooling_factors.json"),
      quality: 10,
      qualities: [10,9,8,7,6,5,4,3,2,1]
    }
  },
  methods: {
    cfClass(value) {
      if (value >= 90) return "value-90"
      else if (value >= 80) return "value-80"
      else if (value >= 70) return "value-70"
      else if (value >= 60) return "value-60"
      else if (value >= 50) return "value-50"
      else if (value >= 40) return "value-40"
      else if (value >= 30) return "value-30"
      else if (value >= 20) return "value-20"
      else if (value >= 10) return "value-10"
      else return "value-0"
    }
  }
}
</script>
<style lang="scss">
#cooling-data {
  table-layout: fixed;
  width: auto;
  margin: auto;
  border-collapse: collapse;
}
.upper-corner {
  width: 65px;
  height: 65px;
}
.material {
  width: 65px;
  height: 65px;
  text-align: center;
  margin: auto;
}

.number {
  width: 65px;
  height: 65px;
  text-align: center;
  border: 1px solid #000
}

.material {
  &.aluminum {
    background-color: #00ffff;
  }

  &.titanium {
    background-color: #6a9cee;
  }

  &.tin {
    background-color: #efefef;
  }

  &.iron {
    background-color: #999999;
  }

  &.bronze {
    background-color: #e26563;
  }

  &.nickel {
    background-color: #91c579;
  }

  &.orthite {
    background-color: #facc99;
  }

  &.epilar {
    background-color: #b5d8a6;
  }

  &.steel {
    background-color: #cccccc;
  }

  &.eternium {
    background-color: #b4a6d8;
  }

  &.copper {
    background-color: #f2c314;
  }

  &.lead {
    background-color: #b7b7b7;
  }

  &.silver {
    background-color: #d0e0e3;
  }

  &.tungsten {
    background-color: #999999;
  }

  &.gold {
    background-color: #ffe694;
  }
}

.value-0 {
  background-color: #fffedf;
}

.value-10 {
  background-color: #ffe4ac;
}

.value-20 {
  background-color: #ffc685;
}

.value-30 {
  background-color: #ffa470
}

.value-40 {
  background-color: #fc8161
}

.value-50 {
  background-color: #ef6358
}

.value-60 {
  background-color: #dd434d
}

.value-70 {
  background-color: #c7253d
}

.value-80 {
  background-color: #ac0723
}

.value-90 {
  background-color: #8c0000
}
</style>

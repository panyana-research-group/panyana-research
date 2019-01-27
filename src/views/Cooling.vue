<template>
  <v-container class="accent" xs12 fluid>
    <v-flex xs10 offset-xs1>
      <table id="cooling-data">
        <tr>
          <td class="upper-corner">
            <v-select v-model="select"
                      :items="qualities"
                      label="Q"
                      single-line
            />
          </td>
          <td v-for="mat in Object.keys(baseData)" :key="mat" class="material">
            {{ mat }}
          </td>
        </tr>
        <tr v-for="mat in Object.keys(baseData)" :key="mat+'Row'">
          <td class="material">{{ mat }}</td>
          <td v-for="mat2 in Object.keys(baseData)" :key="mat2+'Item'" class="number">
            {{ baseData[mat2]+baseData[mat]*(2/3) }}
          </td>
        </tr>
      </table>
    </v-flex>
  </v-container>
</template>
<script>
export default {
  name: "Cooling",
  data() {
    return {
      baseData: require("../assets/data/cooling_factors.json"),
      qualities: [10,9,8,7,6,5,4,3,2,1]
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
  width: 80px;
  height: 80px;
}
.material {
  width: 80px;
  height: 80px;
  text-align: center;
  margin: auto;
}

.number {
  width: 80px;
  height: 80px;
  text-align: center;
  border: 1px solid #000
}
</style>

<template>
  <v-container class="primary" xs12>
    <v-flex xs10 offset-xs1>
      <table>
        <tr>
          <td class="upper-corner" />
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
      baseData: require("../assets/data/cooling_factors.json")
    }
  }
}
</script>
<style lang="scss">
.material {
  width: 40px;
  height: 40px;
  text-align: center;
}

.number {
  text-align: center;
}
</style>

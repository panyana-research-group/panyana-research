<template>
  <v-layout fill-height row wrap align-center justify-center>
    <v-flex v-if="!materials" xs12 class="text-xs-center info--text">
      <v-progress-circular indeterminate color="secondary" size="60" width="8" />
      <span class="pl-1 headline">
        Loading
      </span>
    </v-flex>
    <v-flex v-if="materials" xs12 px-2>
      <div class="label">
        Casing
      </div>
      <div style="width: 100%; overflow-x: auto">
        <table id="cooling-data" class="primary--text">
          <tr>
            <td />
            <td class="upper-corner text-xs-center body-2 secondary--text">
              Quality
              <v-select
                v-model="quality"
                :items="qualities"
                single-line
                hide-details
                class="quality-select pt-0 mt-0 mx-1"
              />
            </td>
            <td v-for="mat in materials" :key="mat.name" class="material top-row" :class="mat.name.toLowerCase()">
              <div style="width: 65px;">
                {{ mat.name }}
              </div>
            </td>
          </tr>
          <tr v-for="(mat, index) in materials" :key="mat.name+'Row'">
            <td v-if="index===0" :rowspan="materials.length+1">
              <span class="label rotated secondary--text">
                Propeller/Barrel
              </span>
            </td>
            <td class="material left-column" :class="mat.name.toLowerCase()">
              {{ mat.name }}
            </td>
            <td v-for="mat2 in materials" :key="mat2.name+'Item'" class="number" :class="cfClass(mat2.cf+mat.cf*(2/3)*(10+quality)/20)">
              {{ mat2.cf+mat.cf*(2/3)*(10+quality)/20 }}
            </td>
          </tr>
        </table>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  name: 'Cooling',
  head() {
    return {
      title: 'Cooling Factor',
      meta: [
        { hid: 'og:title', name: 'og:title', content: 'Cooling Factor' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Shows various materials affects on the Cooling Factor'
        }
      ]
    }
  },
  data() {
    return {
      materials: null,
      quality: 10,
      qualities: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    }
  },
  created() {
    this.$api
      .get('/materials')
      .then(res => {
        this.materials = res.data
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    cfClass(value) {
      if (value >= 90) return 'value-90'
      else if (value >= 80) return 'value-80'
      else if (value >= 70) return 'value-70'
      else if (value >= 60) return 'value-60'
      else if (value >= 50) return 'value-50'
      else if (value >= 40) return 'value-40'
      else if (value >= 30) return 'value-30'
      else if (value >= 20) return 'value-20'
      else if (value >= 10) return 'value-10'
      else return 'value-0'
    }
  }
}
</script>
<style lang="scss">
.label {
  width: 100%;
  font-size: 30px;
  text-align: center;
  word-wrap: break-word;
  white-space: nowrap;

  &.rotated {
    float: left;
    transform: rotate(-90deg);
    white-space: nowrap;
    width: 50px;
  }
}
#cooling-data {
  table-layout: fixed;
  width: auto;
  margin: auto;
  border-collapse: collapse;
  position: relative;
  left: -30px;
  overflow: hidden;
}
@media screen and (max-width: 1147px) {
  #cooling-data {
    margin-left: 23px;
  }
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
  border: 1px solid #000;
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
  &.top-row {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  &.left-column {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
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
  background-color: #ffa470;
}
.value-40 {
  background-color: #fc8161;
}
.value-50 {
  background-color: #ef6358;
}
.value-60 {
  background-color: #dd434d;
}
.value-70 {
  background-color: #c7253d;
}
.value-80 {
  background-color: #ac0723;
}
.value-90 {
  background-color: #8c0000;
}
</style>

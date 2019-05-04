<template>
  <edit-data :show="show" name="Material" :item="item || null">
    <template v-if="!isEmpty(formData)">
      <v-tabs
        v-model="tab"
        color="accent"
        class="mb-2"
        grow
      >
        <v-tabs-slider color="info" />
        <v-tab v-for="t in tabs" :key="t" :href="`#${t}`" class="primary--text">
          {{ t }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="info">
          <v-layout row wrap justify-center>
            <v-flex xs12 md6 px-1>
              <v-text-field
                v-model.lazy.number="formData.weight"
                :rules="[rules.number]"
                label="Weight"
                color="accent"
                box
                persistent-hint
              />
            </v-flex>
            <v-flex xs12 md6 px-1>
              <v-select
                v-model="formData.rarity"
                :items="rarities"
                label="Rarity"
                color="accent"
                hide-details
                box
                persistent-hint
              />
            </v-flex>
            <v-flex xs12 md6 px-1>
              <v-text-field
                v-model.lazy="formData.color"
                label="Color"
                color="accent"
                box
                persistent-hint
              />
            </v-flex>
            <v-flex xs12>
              <v-layout v-if="item" row wrap>
                <v-flex xs12 md6 px-1>
                  <div class="text-xs-center title">
                    Flavor Text Image
                  </div>
                  <upload-button
                    ref="flavor"
                    :disabled="!!item.flavor"
                    :no-title-update="!!item.flavor"
                    :label-class="`primary--text accent`"
                    block
                    class="px-1"
                    @file-update="formData.flavor = $event"
                  >
                    <template v-slot:icon-left>
                      <v-icon color="primary">
                        attach_file
                      </v-icon>
                    </template>
                  </upload-button>
                </v-flex>
                <v-flex xs12 md6 px-1>
                  <div class="text-xs-center title">
                    Icon Image
                  </div>
                  <upload-button
                    ref="icon"
                    :disabled="!!item.icon"
                    :no-title-update="!!item.icon"
                    :label-class="`primary--text accent`"
                    block
                    class="px-1"
                    @file-update="formData.icon = $event"
                  >
                    <template v-slot:icon-left>
                      <v-icon color="primary">
                        attach_file
                      </v-icon>
                    </template>
                  </upload-button>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-tab-item>
        <v-tab-item value="engines">
          <v-layout row wrap justify-center>
            <template v-for="(part, i) in boosts.engine">
              <v-flex :key="i" xs12 text-xs-center>
                <span class="title">{{ types[i] }}</span>
              </v-flex>
              <v-flex v-for="stat in part" :key="`engine_${i}_${stat}`" xs12 md6 px-1>
                <v-text-field
                  v-model.lazy.number="formData[`boosts.engine.${i}.${stat}`]"
                  :rules="[rules.number]"
                  :label="types[stat]"
                  color="accent"
                  box
                  persistent-hint
                />
              </v-flex>
            </template>
          </v-layout>
        </v-tab-item>
        <v-tab-item value="wings">
          <v-layout row wrap justify-center>
            <template v-for="(part, i) in boosts.wing">
              <v-flex :key="i" xs12 text-xs-center>
                <span class="title">{{ types[i] }}</span>
              </v-flex>
              <v-flex v-for="stat in part" :key="`engine_${i}_${stat}`" xs12 md6 px-1>
                <v-text-field
                  v-model.lazy.number="formData[`boosts.wing.${i}.${stat}`]"
                  :rules="[rules.number]"
                  :label="types[stat]"
                  color="accent"
                  box
                  persistent-hint
                />
              </v-flex>
            </template>
          </v-layout>
        </v-tab-item>
        <v-tab-item value="cannons/swivel guns">
          <v-layout row wrap justify-center>
            <template v-for="(part, i) in boosts['cannon/swivel']">
              <v-flex :key="i" xs12 text-xs-center>
                <span class="title">{{ types[i] }}</span>
              </v-flex>
              <v-flex v-for="stat in part" :key="`engine_${i}_${stat}`" xs12 md6 px-1>
                <v-text-field
                  v-model.lazy.number="formData[`boosts.cannon/swivel.${i}.${stat}`]"
                  :rules="[rules.number]"
                  :label="types[stat]"
                  color="accent"
                  box
                  persistent-hint
                />
              </v-flex>
            </template>
          </v-layout>
        </v-tab-item>
        <v-tab-item value="other">
          <v-layout row wrap justify-center>
            <v-flex xs12 text-xs-center>
              <span class="title">Other Boosts</span>
            </v-flex>
            <v-flex xs12 md6 px-1>
              <v-text-field
                v-model="formData.cf"
                :rules="[rules.number]"
                label="Cooling Factor"
                color="accent"
                box
                persistent-hint
              />
            </v-flex>
            <v-flex xs12 md6 px-1>
              <v-text-field
                v-model="formData['boosts.res']"
                :rules="[rules.number]"
                label="Resilience"
                color="accent"
                box
                persistent-hint
              />
            </v-flex>
            <v-flex xs12 md6 px-1>
              <v-text-field
                v-model="formData['boosts.core']"
                :rules="[rules.number]"
                label="Sky Core"
                color="accent"
                box
                persistent-hint
              />
            </v-flex>
          </v-layout>
        </v-tab-item>
      </v-tabs-items>
    </template>
    <template v-slot:actions>
      <v-btn color="error" class="secondary--text" @click="$emit('close')">
        Cancel
      </v-btn>
      <v-btn color="info" class="primary--text" @click="reset">
        Reset
      </v-btn>
      <v-btn :loading="loading" color="success" class="secondary--text" @click="edit">
        Edit
      </v-btn>
    </template>
  </edit-data>
</template>
<script>
import EditData from '@/components/data/EditData'
import UploadButton from '@/components/UploadButton'
import { rules } from '@/components/mixins/rules'
export default {
  name: 'EditMaterial',
  components: {
    EditData,
    UploadButton
  },
  mixins: [rules],
  props: {
    show: Boolean,
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tab: 'info',
      tabs: ['info', 'engines', 'wings', 'cannons/swivel guns', 'other'],
      loading: false,
      formData: {},
      rarities: [
        { text: 'Common', value: 'common' },
        { text: 'Uncommon', value: 'uncommon' },
        { text: 'Rare', value: 'rare' },
        { text: 'Exotic', value: 'exotic' }
      ],
      boosts: {
        engine: {
          mech: ['pwr', 'oh', 'fe'],
          comb: ['pwr', 'oh', 'su'],
          prop: ['su', 'fe']
        },
        wing: {
          mech: ['pwr', 'piv'],
          aileron: ['pwr', 'piv']
        },
        'cannon/swivel': {
          firing: ['pwr', 'rof'],
          barrel: ['pwr', 'cap', 'oh'],
          ammo: ['cap', 'oh', 'rof']
        }
      },
      types: {
        mech: 'Mechanical Internals',
        comb: 'Combustion Internals',
        prop: 'Propellor',
        aileron: 'Aileron',
        firing: 'Firing Mechanism',
        barrel: 'Barrel',
        ammo: 'Ammo Loader',
        pwr: 'Power',
        oh: 'Overheat Limit',
        fe: 'Fuel Efficiency',
        su: 'Spin Up',
        piv: 'Pivot Speed',
        rof: 'Rate Of Fire',
        cap: 'Capacity'
      }
    }
  },
  watch: {
    item: function(newVal, oldVal) {
      if (!newVal) this.formData = {}
      else Object.assign(this.formData, this.item)
    }
  },
  methods: {
    reset() {
      this.formData = this.resetObj(this.formData)
      this.$refs.flavor.clear()
      this.$refs.icon.clear()
      this.$nextTick(() => Object.assign(this.formData, this.item))
    },
    edit() {
      console.log('edit')
    },
    resetObj(obj) {
      const copy = Object.assign({}, obj)
      for (const i in copy) {
        if (copy.hasOwnProperty(i)) {
          if (typeof copy[i] === 'object') {
            copy[i] = this.resetObj(copy[i])
          } else copy[i] = null
        }
      }
      return copy
    },
    isEmpty(obj) {
      for (const key in obj) if (obj.hasOwnProperty(key)) return false
      return true
    }
  }
}
</script>
<style lang="scss">
.v-tabs__slider {
  height: 3px;
}
</style>

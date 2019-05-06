<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 lg11 xl8>
      <data-table
        name="Clothing"
        :search.sync="search"
        :loading.sync="newLoading"
        :snack="snack"
        add
        use-search
        @add="openNew"
      >
        <template v-slot:buttons>
          <v-btn :loading="data.loading" color="accent" class="primary--text" small @click="refresh">
            Refresh
          </v-btn>
        </template>
        <template v-slot:extension>
          <v-select
            v-model="typeSelected"
            :items="['Head', 'Torso', 'Legs', { text: '(all)', value: 'all' }]"
            label="Select a type"
            color="accent"
            class="ml-2 shrink"
            style="max-width: 200px"
            hide-details
            dark
            @change="storage('clothingTypeSelected', $event)"
          />
          <v-select
            v-model="rarityFilter"
            :items="['Common', 'Uncommon', 'Rare', 'Exotic', 'Stash']"
            label="Rarities"
            color="accent"
            class="ml-2 shrink"
            style="width: 355px"
            hide-details
            clearable
            multiple
            dark
            @change="rarityFilter.sort(); storage('clothingRaritiesSelected', JSON.stringify($event))"
          />
        </template>

        <v-data-table
          :headers="typeSelected === 'all' ? [{ text: 'Type', value: 'type' }, ...headers] : headers"
          :items="compClothing.filter(c => rarityFilter.indexOf(c.rarity) > -1)"
          :loading="data.loading ? 'info' : false"
          :search="search"
          class="pa-2"
          dark
          must-sort
          hide-actions
        >
          <template v-slot:items="props">
            <td v-if="typeSelected === 'all'">
              {{ props.item.type.slice(0, 1).toUpperCase() + props.item.type.slice(1) }}
            </td>
            <td v-if="props.item.base" class="px-2 text-xs-center">
              <img :src="`https://drive.google.com/uc?id=${props.item.base}`" :width="width(props.item.type)">
            </td>
            <td v-else>
              Missing
            </td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.rarity }}</td>
            <td>{{ props.item.tiers.join(', ') || 'unknown' }}</td>
            <td>{{ props.item.cultures.join(', ') || 'unknown' }}</td>
            <td v-if="props.item.flavor" class="text-xs-center">
              <v-dialog :value="props.item.dialog" max-width="200px">
                <template v-slot:activator="{ on: dialog }">
                  <span>
                    <v-tooltip top>
                      Flavor text image
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn color="info" class="primary--text" small v-on="{ ...dialog, ...tooltip }">
                          Image
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </span>
                </template>
                <v-img :src="`https://drive.google.com/uc?id=${props.item.flavor}`" class="primary lighten-2" />
              </v-dialog>
            </td>
            <td v-else class="text-xs-center">
              Missing
            </td>
            <td class="text-xs-center">
              <v-tooltip top>
                <v-btn
                  slot="activator"
                  color="primary"
                  icon
                  @click="edit(props.item)"
                >
                  <v-icon color="info">
                    edit
                  </v-icon>
                </v-btn>
                Edit the story
              </v-tooltip>
            </td>
            <td class="caption">
              {{ props.item.notes }}
            </td>
          </template>
          <template v-slot:no-data>
            <v-alert v-if="!data.loading && data.error" type="error" class="primary--text" :value="true">
              Error loading clothing data. Probably a network issue.
            </v-alert>
            <v-alert v-else-if="data.loading && !data.error" type="info" class="primary--text" :value="true">
              Loading clothing data...
            </v-alert>
            <v-alert v-else-if="!data.loading && !data.error" type="info" class="primary--text" :value="true">
              No clothing data!
            </v-alert>
          </template>
        </v-data-table>
      </data-table>
      <new-clothing :show="dialogs.new" @close="close('new', $event)" />
      <edit-clothing :show="dialogs.edit" :item="currentEdit" @close="close('edit', $event)" />
    </v-flex>
  </v-layout>
</template>
<script>
import DataTable from '@/components/DataTable'
import NewClothing from '@/components/data/clothing/NewClothing'
import EditClothing from '@/components/data/clothing/EditClothing'
import { auth } from '@/components/mixins/auth'
export default {
  name: 'Clothing',
  head() {
    return {
      title: 'Clothing',
      meta: [
        { hid: 'og:title', name: 'og:title', content: 'Clothing' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'A ongoing collection of all the clothing'
        }
      ]
    }
  },
  components: {
    DataTable,
    NewClothing,
    EditClothing
  },
  mixins: [auth],
  data() {
    return {
      newLoading: false,
      data: {
        loading: true,
        error: false
      },
      snack: {
        text: 'none',
        color: 'error',
        show: false
      },
      dialogs: {
        new: false,
        edit: false
      },
      clothing: {
        head: [],
        torso: [],
        legs: []
      },
      typeSelected: 'Head',
      rarityFilter: ['Common', 'Uncommon', 'Rare', 'Exotic', 'Stash'],
      currentEdit: null,
      search: null,
      headers: [
        { text: 'Image', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Rarity', value: 'rarity' },
        { text: 'Tier(s)', sortable: false },
        { text: 'Culture(s)', sortable: false },
        { text: 'Flavor Image', sortable: false, align: 'center' },
        { text: 'Edit', sortable: false, align: 'center' },
        { text: 'Notes', sortable: false, width: '200px' }
      ]
    }
  },
  computed: {
    compClothing() {
      switch (this.typeSelected) {
        case 'all': {
          return [
            ...this.clothing.head,
            ...this.clothing.torso,
            ...this.clothing.legs
          ]
        }
        default: {
          return this.clothing[this.typeSelected.toLowerCase()]
        }
      }
    }
  },
  mounted() {
    this.refresh()
    this.typeSelected = localStorage.getItem('clothingTypeSelected') || 'Head'
    if (localStorage.getItem('clothingRaritiesSelected'))
      this.rarityFilter = JSON.parse(
        localStorage.getItem('clothingRaritiesSelected')
      )
  },
  methods: {
    refresh() {
      this.data.loading = true
      this.clothing = {
        head: [],
        torso: [],
        legs: []
      }
      this.$api
        .get('/clothing/all')
        .then(res => {
          res.data.forEach(cloth => {
            this.clothing[cloth.type].push(cloth)
          })
        })
        .catch(err => {
          console.error(err)
          this.data.error = true
        })
        .finally(() => (this.data.loading = false))
    },
    openNew() {
      this.newLoading = true
      this.checkRole('Collector').then(check => {
        this.newLoading = false
        if (check) this.dialogs.new = true
        else this.noPerms()
      })
    },
    close(type, value) {
      this.currentEdit = null
      this.dialogs[type] = false
      switch (value) {
        case 'success': {
          this.snack.color = 'success'
          this.snack.text = 'Successfully updated clothing!'
          this.refresh()
          break
        }
        case 'error': {
          this.snack.color = 'error'
          this.snack.text = 'Error updating clothing!'
          break
        }
      }
      if (value) this.snack.show = true
    },
    edit(item) {
      this.checkRole('Collector').then(check => {
        if (check) {
          this.dialogs.edit = true
          this.currentEdit = item
        } else this.noPerms()
      })
    },
    width(type) {
      switch (type) {
        case 'head':
          return '100px'
        case 'torso':
          return '80px'
        case 'legs':
          return '50px'
      }
    },
    storage(key, value) {
      localStorage.setItem(key, value)
    }
  }
}
</script>

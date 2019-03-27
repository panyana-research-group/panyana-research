<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 lg11 xl8>
      <data-table name="Clothing" :search.sync="search" add use-search @add="openNew">
        <template v-slot:buttons>
          <v-btn :loading="data.loading" color="accent" class="primary--text" small @click="refresh">
            Refresh
          </v-btn>
        </template>
        <template v-slot:extension>
          <v-select
            v-model="typeSelected"
            :items="['Head', 'Torso', 'Legs']"
            label="Select a type"
            color="accent"
            class="ml-2"
            style="max-width: 200px"
            hide-details
            dark
          />
        </template>

        <v-data-table
          :headers="headers"
          :items="clothing[typeSelected.toLowerCase()]"
          :loading="data.loading"
          :search="search"
          class="pa-2"
          dark
          must-sort
          hide-actions
        >
          <template v-slot:items="props">
            <td v-if="props.item.base" class="px-2">
              <v-img :src="`https://drive.google.com/uc?id=${props.item.base}`" max-height="100px" />
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
                <template v-slot:activator="{ on }">
                  <span>
                    <v-btn color="info" class="primary--text" v-on="on">
                      Image
                    </v-btn>
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
      <v-snackbar v-model="snack.show" :timeout="5000" :color="snack.color">
        {{ snack.text }}
        <v-btn dark flat @click.native="snack.show = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>
<script>
import DataTable from '@/components/DataTable'
import NewClothing from '@/components/data/clothing/NewClothing'
import EditClothing from '@/components/data/clothing/EditClothing'

import _ from 'lodash'
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
  data() {
    return {
      data: {
        loading: true,
        error: false
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
      snack: {
        text: 'none',
        color: 'error',
        show: false
      },
      typeSelected: 'Head',
      currentEdit: null,
      search: null,
      headers: [
        { text: 'Image', sortable: false, width: '100px' },
        { text: 'Name', value: 'name' },
        { text: 'Rarity', value: 'rarity' },
        { text: 'Tier(s)', sortable: false },
        { text: 'Culture(s)', sortable: false },
        { text: 'Flavor Image', sortable: false, align: 'center' },
        { text: 'Edit', sortable: false, align: 'center' }
      ]
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
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
          this.data.loading = false
          res.data.forEach(cloth => {
            this.clothing[cloth.type].push(cloth)
          })
        })
        .catch(err => {
          console.error(err)
          this.data.loading = false
          this.data.error = true
        })
    },
    edit(item) {
      if (!this.checkRole(['Admin'])) return
      this.dialogs.edit = true
      this.currentEdit = item
    },
    openNew() {
      if (!this.checkRole(['Admin'])) return
      this.dialogs.new = true
    },
    checkRole(roles) {
      if (!this.$store.state.loggedIn || !this.$auth.userProfile) {
        this.snack.text = 'Not logged in!'
        this.snack.show = true
        return false
      } else if (
        !this.$auth.userProfile.roles ||
        _.intersection(this.$auth.userProfile.roles, roles).length === 0
      ) {
        this.snack.text = 'Insufficient permissions!'
        this.snack.show = true
        return false
      }
      return true
    }
  }
}
</script>
<style lang="scss">
.upload-btn.v-btn--disabled {
  background-color: gray !important;
}
</style>

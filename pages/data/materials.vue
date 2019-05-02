<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 lg11 xl8>
      <data-table
        name="Materials"
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
        <!-- <template v-slot:extension>

        </template> -->
        <v-data-table
          :headers="headers"
          :items="materials"
          :loading="true"
          :search="search"
          :expand="expand"
          class="pa-2"
          item-key="_id"
          dark
          must-sort
          hide-actions
        >
          <template v-slot:items="props">
            <tr class="data-row" @click="props.expanded = !props.expanded">
              <td class="text-xs-center">
                <img :src="props.item.icon" alt="missing">
              </td>
              <td :style="`color: ${props.item.color};`">
                {{ props.item.name }}
              </td>
              <td>{{ props.item.weight }}</td>
              <td>{{ props.item.rarity.slice(0, 1).toUpperCase() + props.item.rarity.slice(1) }}</td>
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
                    @click.stop="edit(props.item)"
                  >
                    <v-icon color="info">
                      edit
                    </v-icon>
                  </v-btn>
                  Edit the material
                </v-tooltip>
              </td>
            </tr>
          </template>
          <template v-slot:expand="props">
            <v-card flat>
              <v-card-text>
                HEY
              </v-card-text>
            </v-card>
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
      <new-material :show="dialogs.new" @close="close('new', $event)" />
      <edit-material :show="dialogs.edit" :item="currentEdit" @close="close('edit', $event)" />
    </v-flex>
  </v-layout>
</template>
<script>
import DataTable from '@/components/DataTable'
import NewMaterial from '@/components/data/materials/NewMaterial'
import EditMaterial from '@/components/data/materials/EditMaterial'
export default {
  name: 'Materials',
  head() {
    return {
      title: 'Materials',
      meta: [
        { hid: 'og:title', name: 'og:title', content: 'Materials' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'A collection of materials in WA'
        }
      ]
    }
  },
  components: {
    DataTable,
    NewMaterial,
    EditMaterial
  },
  data() {
    return {
      newLoading: false,
      expand: false,
      data: {
        loading: true,
        error: false
      },
      snack: {
        text: 'none',
        color: 'error',
        show: false
      },
      pagination: null,
      search: '',
      materials: [],
      dialogs: {
        new: false,
        edit: false
      },
      headers: [
        { text: 'Icon', sortable: false, align: 'center' },
        { text: 'Name', value: 'name' },
        { text: 'Weight', value: 'weight' },
        { text: 'Rarity', value: 'rarity' },
        { text: 'Flavor Text', sortable: false, align: 'center' },
        { text: 'Edit', sortable: false, align: 'center' }
      ],
      currentEdit: null
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.data.loading = true
      this.materials = []
      this.$api
        .get('/materials/all')
        .then(res => {
          this.materials = res.data
        })
        .catch(err => {
          console.error(err)
          this.data.error = true
        })
        .finally(() => (this.data.loading = false))
    },
    openNew() {
      this.newLoading = true
      this.$auth.getUserRoles().then(res => {
        if (res.find(r => r.name === 'Admin')) this.dialogs.new = true
        else {
          this.snack.text = 'Insufficient permissions or not logged in!'
          this.snack.show = true
        }
        this.newLoading = false
      })
    },
    close(type, value) {
      this.currentEdit = null
      this.dialogs[type] = false
      switch (value) {
        case 'success': {
          this.snack.text = 'Successfully updated materials!'
          this.refresh()
          break
        }
        case 'error': {
          this.snack.text = 'Something went wrong...'
          break
        }
      }
      if (value) {
        this.snack.color = value
        this.snack.show = true
      }
    },
    edit(item) {
      this.$auth.getUserRoles().then(res => {
        if (res.find(r => r.name === 'Admin')) {
          this.dialogs.edit = true
          this.currentEdit = item
        } else {
          this.snack.text = 'Insufficient permissions or not logged in!'
          this.snack.show = true
        }
      })
    }
  }
}
</script>
<style lang="scss">
.data-row:hover {
  cursor: pointer;
}
</style>

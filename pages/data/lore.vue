<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 lg11 xl8>
      <v-card class="secondary elevation-4">
        <v-container grid-list-xs justify-center>
          <v-layout row wrap>
            <v-flex shrink>
              <v-btn color="accent primary--text" @click="openNewLore">
                New Story
              </v-btn>
            </v-flex>
            <v-flex shrink>
              <v-btn color="accent primary--text" @click="refreshLore">
                Refresh Lore
              </v-btn>
            </v-flex>
            <v-flex grow>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search Lore"
                persistent-hint
                hide-details
                box
                color="accent"
                clearable
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-data-table
          id="lore-table"
          class="secondary pa-2"
          :items="lore"
          :headers="headers"
          :custom-sort="customSort"
          :search="search"
          item-key="title"
          hide-actions
          :pagination.sync="pagination"
          :loading="loading"
          :must-sort="true"
        >
          <template slot="items" slot-scope="props">
            <tr :class="getClasses(props.item)">
              <td>{{ props.item.title }}</td>
              <td class="text-xs-center">
                {{ props.item.onWiki }}
              </td>
              <td>{{ props.item.missingWiki }}</td>
              <td>{{ props.item.missingPics }}</td>
              <td>{{ props.item.addWiki }}</td>
              <td class="text-xs-center">
                <v-tooltip top>
                  <v-btn slot="activator" :href="`https://drive.google.com/drive/folders/${props.item.folderId}`" color="orange" small target="_blank">
                    Pictures
                  </v-btn>
                  Images of the story's pages
                </v-tooltip>
              </td>
              <td class="text-xs-center">
                <v-tooltip top>
                  <v-btn :disabled="props.item.missingWiki==='COMPLETED'" color="error" class="lighten-2" icon @click="editStory(props.item)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  Edit the story
                </v-tooltip>
              </td>
            </tr>
          </template>
          <v-alert slot="no-results" :value="true" type="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
          <v-alert v-if="!loading" slot="no-data" :value="true" type="error">
            No lore data availible. Probably a network issue :)
          </v-alert>
          <v-alert v-if="loading" slot="no-data" :value="true" type="info">
            Loading data...
          </v-alert>
        </v-data-table>
      </v-card>
      <edit-story
        ref="editStory"
        :show="show.editLore"
        :current-edit="currentEdit"
        :have-wiki="currentHaveWiki"
        @close="onClose('editLore', $event)"
        @update="update($event)"
      />
      <new-story ref="newStory" :show="show.newLore" @close="onClose('newLore', $event)" />
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
import _ from 'lodash'
import NewStory from '@/components/lore/NewStory'
import EditStory from '@/components/lore/EditStory'
export default {
  name: 'Lore',
  head() {
    return {
      title: 'Lore',
      meta: [
        { hid: 'og:title', name: 'og:title', content: 'Lore' },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'A ongoing collection of all the lore in WA'
        }
      ]
    }
  },
  components: {
    'new-story': NewStory,
    'edit-story': EditStory
  },
  data() {
    return {
      pagination: { sortBy: 'title', descending: true, rowsPerPage: -1 },
      snack: {
        text: 'none',
        color: 'error',
        show: false
      },
      search: '',
      lore: [],
      loading: true,
      show: {
        newLore: false,
        editLore: false
      },
      headers: [
        {
          text: 'Title',
          value: 'title',
          width: '23%',
          class: 'info'
        },
        {
          text: 'On Wiki',
          value: 'onWiki',
          width: '7%',
          class: 'info'
        },
        {
          text: 'Missing from wiki',
          value: 'missingWiki',
          width: '18%',
          class: 'info'
        },
        {
          text: 'Missing images',
          value: 'missingPics',
          width: '17%',
          class: 'info'
        },
        {
          text: 'Add to wiki',
          value: 'addWiki',
          width: '10%',
          class: 'info'
        },
        {
          text: 'Drive Folder',
          sortable: false,
          width: '15%',
          class: 'info',
          align: 'center'
        },
        {
          text: 'Edit',
          sortable: false,
          width: '10%',
          class: 'info',
          align: 'center'
        }
      ],
      currentEdit: {
        title: '',
        onWiki: '',
        missingWiki: '',
        missingPics: '',
        addWiki: '',
        pages: []
      },
      currentHaveWiki: ''
    }
  },
  created() {
    this.refreshLore()
  },
  methods: {
    update(event) {
      this.currentHaveWiki = event.join(', ')
    },
    onClose(type, value) {
      this.show[type] = false
      switch (value) {
        case 'success':
          this.snack.color = 'success'
          this.snack.text = 'Successfully updated lore!'
          this.refreshLore()
          break
        case 'error':
          this.snack.color = 'error'
          this.snack.text = 'Error updating lore!'
          break
      }
      if (value) this.snack.show = true
    },
    refreshLore() {
      this.loading = true
      this.lore = []
      this.$api
        .get('/lore/all')
        .then(res => {
          this.lore.push(...res.data)
          this.loading = false
        })
        .catch(err => {
          console.error(err)
          this.lore = []
          this.loading = false
        })
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
    },
    openNewLore() {
      if (!this.checkRole(['Admin'])) return
      this.$refs.newStory.$refs.newLore.reset()
      this.show.newLore = true
    },
    editStory(item) {
      if (!this.checkRole(['Admin', 'Collector'])) return
      const pageCount = parseInt(item.onWiki.split('/')[1])
      this.currentEdit = Object.assign({}, item)
      this.currentEdit.pages = [{ page: 'title' }]
      _.range(1, pageCount + 1).forEach(p => {
        this.currentEdit.pages.push({ page: p })
      })
      const haveWiki = ['title']
      for (let i = 1; i <= pageCount; i++) {
        if (this.currentEdit.missingWiki.split(', ').indexOf(String(i)) < 0)
          haveWiki.push(String(i))
      }
      this.currentHaveWiki = haveWiki.join(', ')
      this.show.editLore = true
    },
    getClasses(item) {
      if (item.missingWiki === 'COMPLETED') return 'green lighten-2'
      else if (item.addWiki !== '') return 'cyan lighten-2'
      else if (item.missingPics.split(', ').length > 10) return 'red lighten-2'
      else if (item.missingPics.split(', ').length > 5)
        return 'orange lighten-3'
      else return 'yellow lighten-4'
    },
    customSort(items, attr, isDescending) {
      items.sort((a, b) => {
        switch (attr) {
          case 'title':
            if (isDescending) return a.title < b.title ? -1 : 1
            else return a.title < b.title ? 1 : -1
          case 'addWiki': {
            const lenA = a.addWiki === '' ? 0 : a.addWiki.split(', ').length
            const lenB = b.addWiki === '' ? 0 : b.addWiki.split(', ').length
            if (lenA === lenB) return 0
            if (isDescending) return lenA < lenB ? -1 : 1
            else return lenA < lenB ? 1 : -1
          }
          case 'missingPics': {
            const lenA =
              a.missingPics === 'COMPLETED'
                ? 0
                : a.missingPics.split(', ').length
            const lenB =
              b.missingPics === 'COMPLETED'
                ? 0
                : b.missingPics.split(', ').length
            if (lenA === lenB) return 0
            if (isDescending) return lenA < lenB ? -1 : 1
            else return lenA < lenB ? 1 : -1
          }
          case 'missingWiki': {
            const lenA =
              a.missingWiki === 'COMPLETED'
                ? 0
                : a.missingWiki.split(', ').length
            const lenB =
              b.missingWiki === 'COMPLETED'
                ? 0
                : b.missingWiki.split(', ').length
            if (lenA === lenB) return 0
            if (isDescending) return lenA < lenB ? -1 : 0
            else return lenA < lenB ? 1 : -1
          }
        }
      })
      return items
    }
  }
}
</script>
<style lang="scss">
#lore-table table {
  table-layout: fixed;
  overflow: hidden;
  min-width: 1200px;
  thead tr {
    border-bottom: 1px solid black !important;
  }
  tbody tr {
    border: 1px solid black !important;
  }
}
.upload-btn.v-btn--disabled {
  background-color: gray !important;
}
</style>

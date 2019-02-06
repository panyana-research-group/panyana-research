<template>
  <v-flex xs12 class="px-2">
    <v-card class="primary lighten-2 mb-2 elevation-4">
      <v-card-title class="primary lighten-2 headline">
        <v-btn color="info" @click="openNewLore()">
          New Story
        </v-btn>
        <v-btn color="success" class="mr-3" @click="refreshLore()">
          Refresh Lore
        </v-btn>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search Lore"
          persistent-hint
          box
          class="ml-3"
          color="secondary"
          clearable
        />
      </v-card-title>
      <v-data-table
        id="lore-table"
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
                <v-btn slot="activator" :href="props.item.driveFolder" color="orange" small target="_blank">
                  Pictures
                </v-btn>
                Images of the story's pages
              </v-tooltip>
            </td>
            <td class="text-xs-center">
              <v-btn :disabled="props.item.missingWiki==='COMPLETED'" color="error" class="lighten-2" icon @click="editStory(props.item)">
                <v-icon>edit</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <v-alert slot="no-results" :value="true" type="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
        <v-alert slot="no-data" :value="true" type="error" icon="warning">
          No lore data availible. Probably a network issue :)
        </v-alert>
      </v-data-table>
    </v-card>
    <edit-story ref="editStory" :show="show.editLore" :current-edit="currentEdit" @close="onClose('editLore', $event)" />
    <new-story ref="newStory" :show="show.newLore" @close="onClose('newLore', $event)" />
    <v-snackbar v-model="snack.show" :timeout="5000" :color="snack.color">
      {{ snack.text }}
      <v-btn dark flat @click.native="snack.show = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-flex>
</template>
<script>
import _ from 'lodash'
import axios from 'axios'
import NewStory from '@/components/NewStory'
import EditStory from '@/components/EditStory'
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
          class: 'primary lighten-2'
        },
        {
          text: 'On Wiki',
          value: 'onWiki',
          width: '7%',
          class: 'primary lighten-2'
        },
        {
          text: 'Missing from wiki',
          value: 'missingWiki',
          width: '18%',
          class: 'primary lighten-2'
        },
        {
          text: 'Missing images',
          value: 'missingPics',
          width: '17%',
          class: 'primary lighten-2'
        },
        {
          text: 'Add to wiki',
          value: 'addWiki',
          width: '10%',
          class: 'primary lighten-2'
        },
        {
          text: 'Drive Folder',
          sortable: false,
          width: '15%',
          class: 'primary lighten-2',
          align: 'center'
        },
        {
          text: 'Edit',
          sortable: false,
          width: '10%',
          class: 'primary lighten-2',
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
      }
    }
  },
  created() {
    this.refreshLore()
  },
  methods: {
    onClose(type, value) {
      console.log(value)
      this.show[type] = false
      switch (value) {
        case 'success':
          this.snack.color = 'success'
          this.snack.text = 'Successfully updated lore!'
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
      axios
        .get('https://panyana-api.glitch.me/lore/all')
        .then(res => {
          console.log(res)
          res.data.forEach(story => {
            this.lore.push(story)
            // this.lore.push({
            //   title: story[0],
            //   onWiki: story[1],
            //   missingWiki: story[2],
            //   missingPics: story[3],
            //   addWiki: story[4],
            //   driveFolder: 'https://drive.google.com/drive/folders/' + story[7]
            // })
          })
          this.loading = false
        })
        .catch(err => {
          console.error(err)
          this.lore = []
          this.loading = false
        })
    },
    checkAdmin() {
      if (!this.$store.state.authLoggedIn || !this.$auth.user) {
        this.snack.text = 'Not logged in!'
        this.snack.show = true
        return false
      } else if (
        !this.$auth.user.roles ||
        !this.$auth.user.roles.includes('Admin')
      ) {
        this.snack.text = 'Insufficient permission!'
        this.snack.show = true
        return false
      }
      return true
    },
    openNewLore() {
      if (!this.checkAdmin()) return
      this.$refs.newStory.$refs.newLore.reset()
      this.show.newLore = true
    },
    editStory(item) {
      if (!this.checkAdmin()) return
      this.currentEdit = item
      this.currentEdit.pages = _.range(
        1,
        parseInt(item.onWiki.split('/')[1]) + 1
      )
      this.show.editLore = true
    },
    getClasses(item) {
      if (item.missingWiki === 'COMPLETED') return 'green lighten-2'
      else if (item.addWiki !== '') return 'cyan lighten-2'
      else if (item.missingPics.split(',').length > 10) return 'red lighten-2'
      else if (item.missingPics.split(',').length > 5) return 'orange lighten-3'
      else return 'yellow lighten-4'
    },
    customSort(items, attr, isDescending) {
      items.sort((a, b) => {
        switch (attr) {
          case 'title':
            if (isDescending) return a.title < b.title ? -1 : 1
            else return a.title < b.title ? 1 : -1
          case 'addWiki': {
            const lenA = a.addWiki === '' ? 0 : a.addWiki.split(',').length
            const lenB = b.addWiki === '' ? 0 : b.addWiki.split(',').length
            if (lenA === lenB) return 0
            if (isDescending) return lenA < lenB ? -1 : 1
            else return lenA < lenB ? 1 : -1
          }
          case 'missingPics': {
            const lenA =
              a.missingPics === 'COMPLETED'
                ? 0
                : a.missingPics.split(',').length
            const lenB =
              b.missingPics === 'COMPLETED'
                ? 0
                : b.missingPics.split(',').length
            if (lenA === lenB) return 0
            if (isDescending) return lenA < lenB ? -1 : 1
            else return lenA < lenB ? 1 : -1
          }
          case 'missingWiki': {
            const lenA =
              a.missingWiki === 'N/A' ? 0 : a.missingWiki.split(',').length
            const lenB =
              b.missingWiki === 'N/A' ? 0 : b.missingWiki.split(',').length
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
  word-wrap: break-word;
  overflow: hidden;
  tr {
    border-bottom: 1px solid black !important;
    &:hover {
      filter: brightness(80%);
      transition: none;
    }
  }
}
.upload-btn.v-btn--disabled {
  background-color: gray !important;
}
</style>

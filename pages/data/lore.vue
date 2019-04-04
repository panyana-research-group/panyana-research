<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 lg11 xl8>
      <data-table name="Lore" :search.sync="search" add use-search @add="openNew">
        <template v-slot:buttons>
          <v-btn :loading="data.loading" color="accent" class="primary--text" small @click="refresh">
            Refresh
          </v-btn>
        </template>
        <v-data-table
          id="lore-table"
          :headers="headers"
          :items="lore"
          :loading="data.loading"
          :search="search"
          :custom-sort="customSort"
          :pagination.sync="pagination"
          item-key="title"
          class="ma-2"
          dark
          must-sort
          hide-actions
        >
          <template v-slot:items="props">
            <tr :class="getClasses(props.item) + ' black--text'">
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
                <v-tooltip :disabled="props.item.missingWiki==='COMPLETED'" top>
                  <v-btn
                    slot="activator"
                    :disabled="props.item.missingWiki==='COMPLETED'"
                    color="primary"
                    class="lighten-2"
                    icon
                    @click="editStory(props.item)"
                  >
                    <v-icon color="info">
                      edit
                    </v-icon>
                  </v-btn>
                  Edit the story
                </v-tooltip>
              </td>
            </tr>
          </template>
          <v-alert slot="no-results" :value="true" type="warning" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
          <template v-slot:no-data>
            <v-alert v-if="!data.loading && data.error" type="error" class="primary--text" :value="true">
              Error loading lore data. Probably a network issue.
            </v-alert>
            <v-alert v-else-if="data.loading && !data.error" type="info" class="primary--text" :value="true">
              Loading lore data...
            </v-alert>
            <v-alert v-else-if="!data.loading && !data.error" type="info" class="primary--text" :value="true">
              No lore data!
            </v-alert>
          </template>
        </v-data-table>
      </data-table>
      <edit-lore
        ref="editStory"
        :show="dialogs.edit"
        :item="currentEdit"
        :have-wiki="currentHaveWiki"
        @close="close('edit', $event)"
        @update="update($event)"
      />
      <new-lore :show="dialogs.new" @close="close('new', $event)" />
    </v-flex>
  </v-layout>
</template>
<script>
import _ from 'lodash'

import DataTable from '@/components/DataTable'
import NewLore from '@/components/data/lore/NewLore'
import EditLore from '@/components/data/lore/EditLore'
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
    DataTable,
    NewLore,
    EditLore
  },
  data() {
    return {
      data: {
        loading: true,
        error: false
      },
      pagination: { sortBy: 'title', descending: true, rowsPerPage: -1 },
      search: '',
      lore: [],
      dialogs: {
        new: false,
        edit: false
      },
      headers: [
        { text: 'Title', value: 'title', width: '23%' },
        { text: 'On Wiki', value: 'onWiki', width: '7%' },
        { text: 'Missing from wiki', value: 'missingWiki', width: '18%' },
        { text: 'Missing images', value: 'missingPics', width: '17%' },
        { text: 'Add to wiki', value: 'addWiki', width: '10%' },
        {
          text: 'Lore Pages',
          sortable: false,
          width: '15%',
          align: 'center'
        },
        { text: 'Edit', sortable: false, width: '10%', align: 'center' }
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
    this.refresh()
  },
  methods: {
    refresh() {
      this.data.loading = true
      this.lore = []
      this.$api
        .get('/lore/all')
        .then(res => {
          this.data.loading = false
          this.lore.push(...res.data)
        })
        .catch(err => {
          console.error(err)
          this.data.loading = false
          this.data.error = false
        })
    },
    openNew() {
      if (!this.checkRole(['Admin'])) return
      this.dialogs.new = true
    },
    update(event) {
      this.currentHaveWiki = event.join(', ')
    },
    close(type, value) {
      this.dialogs[type] = false
      switch (value) {
        case 'success':
          this.snack.color = 'success'
          this.snack.text = 'Successfully updated lore!'
          this.refresh()
          break
        case 'error':
          this.snack.color = 'error'
          this.snack.text = 'Error updating lore!'
          break
      }
      if (value) this.snack.show = true
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
      this.dialogs.edit = true
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
  //   table-layout: fixed;
  //   overflow: hidden;
  //   min-width: 1200px;
  thead tr {
    border-bottom: 1px solid black !important;
  }
  tbody {
    tr {
      border-top: 1px solid black !important;
      border-bottom: 1px solid black !important;
    }
  }
}
.upload-btn.v-btn--disabled {
  background-color: gray !important;
}
</style>

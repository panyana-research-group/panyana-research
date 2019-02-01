<template>
  <v-container class="primary" xs12 fluid>
    <no-ssr>
      <v-flex xs12 class="px-2">
        <v-card class="primary lighten-2 mb-2 elevation-4">
          <v-card-title class="primary lighten-2 headline">
            <v-btn color="info" @click="openNewLore()">
              Add Story
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
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Your search for "{{ search }}" found no results.
            </v-alert>
          </v-data-table>
        </v-card>
        <v-dialog v-model="addLore" max-width="500px">
          <v-card dark>
            <v-card-title class="title justify-center">
              Add Lore
            </v-card-title>
            <v-card-text>
              <v-form ref="newLore" v-model="addComplete">
                <v-text-field
                  id="loreTitle"
                  v-model="loreTitle"
                  name="loreTitle"
                  label="Lore Title"
                  box
                  color="info"
                  clearable
                  persistent-hint
                  :rules="rules.titleRules"
                />
                <v-text-field
                  id="pageCount"
                  v-model="pageCount"
                  name="pageCount"
                  label="Page Count"
                  persistent-hint
                  box
                  color="info"
                  clearable
                  :rules="rules.pageCountRules"
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn color="error" dark @click="addLore=false">
                Cancel
              </v-btn>
              <v-btn color="success" :disabled="!addComplete" @click="submit()">
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="editLore" max-width="500px">
          <v-card dark>
            <v-card-title class="title justify-center pb-0">
              {{ currentEdit.title }}
            </v-card-title>
            <v-card-title class="heading justify-center pt-0">
              {{ currentEdit.onWiki.split("/")[1] }} Page(s)
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="editHeaders"
                :items="currentEdit.pages"
                hide-actions
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item }}</td>
                  <td>
                    <v-layout justify-center>
                      <v-checkbox :input-value="isOnWiki(String(props.item))" :disabled="isOnWiki(String(props.item)) || (currentEdit.addWiki && !currentEdit.addWiki.split(',').includes(String(props.item)))" style="max-width: 24px;" hide-details @click="addToWiki(props.item)" />
                    </v-layout>
                  </td>
                  <td class="text-xs-center">
                    <upload-btn :ripple="false" :disabled="currentEdit.missingPics && !currentEdit.missingPics.split(',').includes(String(props.item))" :title="currentEdit.missingPics && !currentEdit.missingPics.split(',').includes(String(props.item)) ? 'Uploaded' : 'Upload'">
                      <template slot="icon-left">
                        <v-icon>attach_file</v-icon>
                      </template>
                    </upload-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn color="error" dark @click="editLore=false">
                Cancel
              </v-btn>
              <v-btn color="success" @click="edit()">
                Edit
              </v-btn>
              <v-btn color="info" @click="reset()">
                Reset
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-snackbar v-model="showError" :timeout="5000" color="error">
        {{ errorText }}
        <v-btn dark flat @click.native="showError = false">
          Close
        </v-btn>
      </v-snackbar>
    </no-ssr>
  </v-container>
</template>
<script>
import _ from 'lodash'
import UploadButton from 'vuetify-upload-button'
export default {
  name: 'Lore',
  metaInfo: {
    title: 'Lore'
  },
  components: {
    'upload-btn': UploadButton
  },
  data() {
    return {
      pagination: { sortBy: 'title', descending: true, rowsPerPage: -1 },
      rules: {
        titleRules: [
          v => !!v || 'Name is required',
          v =>
            (!!v && v.indexOf('"') < 0) ||
            `You cannot use " in the name! Use ' instead`
        ],
        pageCountRules: [
          v => !!v || 'Page count is required',
          v => !isNaN(v) || 'Must be a number'
        ]
      },
      search: '',
      lore: [],
      loading: true,
      showError: false,
      errorText: 'none specified',
      addLore: false,
      editLore: false,
      addComplete: false,
      editHeaders: [
        { text: 'Page', sortable: false },
        { text: 'On wiki', align: 'center', sortable: false },
        { text: 'Upload image', align: 'center', sortable: false }
      ],
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
      loreTitle: null,
      pageCount: null,
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
    console.log(process.env)
  },
  methods: {
    refreshLore() {
      this.loading = true
      this.lore = []
      this.$api.getSheet('lore').then((res, err) => {
        if (err) return console.error(err)
        res.data.data.values.forEach(story => {
          this.lore.push({
            title: story[0],
            onWiki: story[1],
            missingWiki: story[2],
            missingPics: story[3],
            addWiki: story[4],
            driveFolder: 'https://drive.google.com/drive/folders/' + story[7]
          })
        })
        this.loading = false
      })
    },
    checkAdmin() {
      if (!this.$store.state.authLoggedIn || !this.$auth.user) {
        this.errorText = 'Not logged in!'
        this.showError = true
        return false
      } else if (
        !this.$auth.user.roles ||
        !this.$auth.user.roles.includes('Admin')
      ) {
        this.errorText = 'Insufficient permission!'
        this.showError = true
        return false
      }
      return true
    },
    isOnWiki(page) {
      if (this.currentEdit.missingWiki === 'COMPLETED') return true
      return this.currentEdit.missingWiki.split(',').indexOf(page) < 0
    },
    openNewLore() {
      if (!this.checkAdmin()) return
      this.$refs.newLore.reset()
      this.addLore = true
    },
    editStory(item) {
      if (!this.checkAdmin()) return
      this.currentEdit = item
      this.currentEdit.pages = _.range(
        1,
        parseInt(item.onWiki.split('/')[1]) + 1
      )
      this.editLore = true
    },
    submit() {
      this.addLore = false
      // this.lore.push({
      //   title: this.loreTitle,
      //   onWiki: `0/${this.pageCount}`,
      //   missingWiki: _.range(1, parseInt(this.pageCount)+1).join(","),
      //   missingPics: _.range(1, parseInt(this.pageCount)+1).join(","),
      //   addWiki: ""
      // })
      // this.lore.sort((a, b) => {
      //   return a.title < b.title ? -1 : 1
      // })
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

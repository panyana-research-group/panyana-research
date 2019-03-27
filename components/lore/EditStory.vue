<template>
  <v-dialog
    :value="show"
    max-width="550px"
    persistent
  >
    <v-card dark>
      <v-card-title class="title justify-center pb-0">
        {{ currentEdit.title }}
      </v-card-title>
      <v-card-title class="heading justify-center pt-0">
        {{ currentEdit.onWiki.split("/")[1] }} Page{{ currentEdit.onWiki.split('/')[1] === "1" ? '' : 's' }}
      </v-card-title>
      <v-card-text>
        <v-data-table
          id="edit-story"
          ref="editStory"
          :headers="editHeaders"
          :items="currentEdit.pages"
          hide-actions
          class="elevation-1"
        >
          <template
            slot="items"
            slot-scope="props"
          >
            <tr>
              <td>{{ props.item.page }}</td>
              <td>
                <v-layout justify-center>
                  <v-checkbox
                    v-model="have"
                    :value="String(props.item.page)"
                    :disabled="checkDisabled(String(props.item.page))"
                    style="max-width: 24px;"
                    hide-details
                  />
                </v-layout>
              </td>
              <td
                class="text-xs-left"
                style="padding-left: 0px"
              >
                <upload-btn
                  :ref="`ref-${props.item.page}`"
                  :unique-id="true"
                  :page="String(props.item.page)"
                  :disabled="currentEdit.missingPics && !currentEdit.missingPics.split(', ').includes(String(props.item.page))"
                  :file-changed-callback="upload"
                >
                  <template slot="icon-left">
                    <v-icon :class="currentEdit.missingPics && !currentEdit.missingPics.split(', ').includes(String(props.item.page)) ? 'green--text' : 'blue--text'">
                      {{ currentEdit.missingPics && !currentEdit.missingPics.split(', ').includes(String(props.item.page)) ? 'check_circle' : 'attach_file' }}
                    </v-icon>
                  </template>
                </upload-btn>
              </td>
              <td>
                <v-layout justify-center>
                  <v-checkbox
                    v-model="twoPages"
                    :disabled="currentEdit.missingPics && !currentEdit.missingPics.split(', ').includes(String(props.item.page))"
                    :indeterminate="currentEdit.missingPics && !currentEdit.missingPics.split(', ').includes(String(props.item.page))"
                    :value="props.item.page"
                    hide-details
                    style="max-width: 24px;"
                    @change="openTwoPage(props.item.page)"
                  />
                </v-layout>
              </td>
            </tr>
            <tr
              :ref="'twoPage-' + props.item.page"
              style="display: none;"
            >
              <td>{{ props.item.page }}<br>Page 2</td>
              <td />
              <td
                class="text-xs-left"
                style="padding-left: 0px;"
              >
                <upload-btn
                  :ref="`twoPageFile-${props.item.page}`"
                  :unique-id="true"
                  :page="`page2-${props.item.page}`"
                  :file-changed-callback="upload"
                >
                  <template slot="icon-left">
                    <v-icon class="blue--text">
                      attach_file
                    </v-icon>
                  </template>
                </upload-btn>
              </td>
              <td />
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn
          color="error"
          dark
          @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="success"
          :loading="loading"
          @click="edit"
        >
          Edit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import UploadButton from '@/components/UploadButton'
export default {
  name: 'EditStory',
  components: {
    'upload-btn': UploadButton
  },
  props: {
    show: Boolean,
    currentEdit: {
      type: Object,
      default: () => {
        return {
          title: '',
          onWiki: '',
          missingWiki: '',
          missingPics: '',
          addWiki: '',
          pages: [],
          _id: ''
        }
      }
    },
    haveWiki: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      editHeaders: [
        { text: 'Page', sortable: false, width: '100px' },
        { text: 'On wiki', align: 'center', sortable: false, width: '100px' },
        {
          text: 'Upload image',
          align: 'center',
          sortable: false,
          width: '200px'
        },
        { text: '2 pages?', align: 'center', sortable: false, width: '100px' }
      ],
      uploaded: [],
      uploadedTwo: [],
      twoPages: []
    }
  },
  computed: {
    have: {
      get() {
        if (this.haveWiki === '') {
          return []
        }
        return this.haveWiki.split(', ')
      },
      set(value) {
        this.$emit('update', value)
      }
    }
  },
  methods: {
    openTwoPage(page) {
      !this.twoPages.includes(page)
        ? (this.$refs['twoPage-' + page].style.display = 'none')
        : (this.$refs['twoPage-' + page].style.display = 'table-row')
    },
    checkDisabled(page) {
      if (this.isOnWiki(page)) return true
      else if (!this.currentEdit.addWiki) return true
      if (!this.currentEdit.addWiki.split(', ').includes(String(page)))
        return true
    },
    isOnWiki(page) {
      if (this.currentEdit.missingWiki === 'COMPLETED') return true
      return this.currentEdit.missingWiki.split(', ').indexOf(page) < 0
    },
    upload(file, page) {
      if (file) {
        if (page.search(/page/) > -1) {
          if (file.name.length > 14)
            this.$refs['twoPageFile-' + page.split('-')[1]].title =
              file.name.slice(0, 14) + '...'
          else this.$refs['twoPageFile-' + page.split('-')[1]].title = file.name
          if (this.uploadedTwo.indexOf(page.split('-')[1]) < 0)
            this.uploadedTwo.push(page.split('-')[1])
        } else {
          if (file.name.length > 14)
            this.$refs['ref-' + page].title = file.name.slice(0, 14) + '...'
          else this.$refs['ref-' + page].title = file.name
          if (this.uploaded.indexOf(page) < 0) this.uploaded.push(page)
        }
      } else if (page.search(/page/) > -1) {
        this.$refs['twoPageFile-' + page.split('-')[1]].title = 'Upload'
        this.uploadedTwo = this.uploadedTwo.filter(
          p => p !== page.split('-')[1]
        )
      } else {
        this.$refs['ref-' + page].title = 'Upload'
        this.uploaded = this.uploaded.filter(p => p !== page)
      }
    },
    edit() {
      this.loading = true
      this.$api.get('/lore/' + this.currentEdit._id).then(data => {
        const pageCount = parseInt(this.currentEdit.onWiki.split('/')[1])
        const haveWiki = ['title']
        for (let i = 1; i <= pageCount; i++) {
          if (this.currentEdit.missingWiki.split(', ').indexOf(String(i)) < 0)
            haveWiki.push(String(i))
        }
        this.have = [...new Set([...haveWiki, ...this.have])]
        this.currentEdit.missingPics = data.data.missingPics
        this.currentEdit.missingWiki = data.data.missingWiki
        this.currentEdit.onWiki = data.data.onWiki
        this.currentEdit.addWiki = data.data.addWiki

        const update = {
          title: this.currentEdit.title,
          onWiki: `${this.have.length - 1}/${pageCount}`,
          folderId: this.currentEdit.folderId,
          missingPics: this.currentEdit.missingPics
            .split(', ')
            .filter(p => this.uploaded.indexOf(p) < 0)
            .join(', '),
          missingWiki: this.currentEdit.missingWiki
            .split(', ')
            .filter(p => this.have.indexOf(p) < 0)
            .join(', ')
        }
        if (!this.currentEdit.addWiki || this.currentEdit.addWiki === '')
          update.addWiki = []
        else update.addWiki = this.currentEdit.addWiki.split(', ')
        update.addWiki = update.addWiki
          .concat(this.uploaded)
          .filter(p => p !== 'title')
          .filter(p => update.missingWiki.split(', ').indexOf(p) > -1)
          .sort((a, b) => {
            if (parseInt(a) < parseInt(b)) return -1
            else return 1
          })
          .join(', ')
        if (update.missingPics === '') update.missingPics = 'COMPLETED'
        if (update.missingWiki === '') update.missingWiki = 'COMPLETED'
        const formData = new FormData()

        for (const prop in update) {
          if (update.hasOwnProperty(prop)) formData.append(prop, update[prop])
        }

        // Pictures
        for (let i = 0; i < this.uploaded.length; i++) {
          const input = this.$refs['ref-' + this.uploaded[i]].$refs.fileInput
          formData.append('page-' + this.uploaded[i] + '-0', input.files[0])
        }

        for (let i = 0; i < this.uploadedTwo.length; i++) {
          const input = this.$refs['twoPageFile-' + this.uploadedTwo[i]].$refs
            .fileInput
          formData.append('page-' + this.uploadedTwo[i] + '-1', input.files[0])
        }

        this.$api
          .put('/lore/' + this.currentEdit._id, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .then(res => {
            this.$emit('close', 'success')
          })
          .catch(err => {
            console.log(err)
            this.$emit('close', 'error')
          })
          .finally(() => {
            this.reset()
          })
      })
      /* eslint-disable */
      return


    },
    reset() {
      this.loading = false
      for (let i = 0; i < this.uploaded.length; i++) {
        const btn = this.$refs['ref-' + this.uploaded[i]]
        btn.title = 'Upload'
        btn.$refs.fileInput.value = null
      }
      this.uploaded = []
      for (let i = 0; i < this.uploadedTwo.length; i++) {
        const btn = this.$refs['twoPageFile-' + this.uploadedTwo[i]]
        btn.title = 'Upload'
        btn.$refs.fileInput.value = null
      }
      this.uploadedTwo = []
      for (let i = 0; i < this.twoPages.length; i++)
        this.$refs['twoPage-' + this.twoPages[i]].style.display = 'none'
      this.twoPages = []
    },
    cancel() {
      this.reset()
      this.$emit('close')
    }
  }
}
</script>

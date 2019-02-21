<template>
  <v-dialog :value="show" max-width="500px" persistent>
    <v-card dark>
      <v-card-title class="title justify-center pb-0">
        {{ currentEdit.title }}
      </v-card-title>
      <v-card-title class="heading justify-center pt-0">
        {{ currentEdit.onWiki.split("/")[1] }} Page{{ currentEdit.onWiki.split('/')[1] === "1" ? '' : 's' }}
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="editHeaders"
          :items="currentEdit.pages"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td>{{ props.item }}</td>
              <td>
                <v-layout justify-center>
                  <v-checkbox
                    v-model="have"
                    :value="String(props.item)"
                    :disabled="checkDisabled(String(props.item))"
                    style="max-width: 24px;"
                    hide-details
                  />
                </v-layout>
              </td>
              <td class="text-xs-left" style="padding-left: 0px">
                <upload-btn
                  :ref="`ref-${props.item}`"
                  :unique-id="true"
                  :page="String(props.item)"
                  :disabled="currentEdit.missingPics && !currentEdit.missingPics.split(', ').includes(String(props.item))"
                  :file-changed-callback="upload"
                >
                  <template slot="icon-left">
                    <v-icon :class="currentEdit.missingPics && !currentEdit.missingPics.split(', ').includes(String(props.item)) ? 'green--text' : 'blue--text'">
                      {{ currentEdit.missingPics && !currentEdit.missingPics.split(', ').includes(String(props.item)) ? 'check_circle' : 'attach_file' }}
                    </v-icon>
                  </template>
                </upload-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="error" dark @click="cancel">
          Cancel
        </v-btn>
        <v-btn color="success" @click="edit">
          Edit
        </v-btn>
      </v-card-actions>
      <div v-if="loading" class="text-xs-center" style="height: 40px">
        <v-progress-circular v-show="loading" indeterminate color="secondary" class="ml-2 dark" />
        Updating...
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import UploadButton from '@/components/UploadButton'
import axios from 'axios'
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
        { text: 'Page', sortable: false },
        { text: 'On wiki', align: 'center', sortable: false },
        { text: 'Upload image', align: 'left', sortable: false }
      ],
      uploaded: []
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
    checkDisabled(page) {
      if (this.isOnWiki(page)) return true
      if (
        this.currentEdit.addWiki &&
        !this.currentEdit.addWiki.split(', ').includes(String(page))
      )
        return true
    },
    isOnWiki(page) {
      if (this.currentEdit.missingWiki === 'COMPLETED') return true
      return this.currentEdit.missingWiki.split(', ').indexOf(page) < 0
    },
    upload(file, page) {
      if (file) {
        if (file.name.length > 20)
          this.$refs['ref-' + page].title = file.name.slice(0, 20)
        else this.$refs['ref-' + page].title = file.name
        if (this.uploaded.indexOf(page) < 0) this.uploaded.push(page)
      } else {
        this.$refs['ref-' + page].title = 'Upload'
        this.uploaded = this.uploaded.filter(p => p !== page)
      }
    },
    edit() {
      const formData = new FormData()

      // Title
      formData.append('title', this.currentEdit.title)

      // On Wiki x/x
      formData.append(
        'onWiki',
        `${this.have.length - 1}/${this.currentEdit.onWiki.split('/')[1]}`
      )

      // Missing Pictures
      this.currentEdit.missingPics = this.currentEdit.missingPics
        .split(', ')
        .filter(p => this.uploaded.indexOf(p) < 0)
        .join(', ')
      if (this.currentEdit.missingPics === '')
        this.currentEdit.missingPics = 'COMPLETED'
      formData.append(
        'missingPics',
        this.currentEdit.missingPics
          .split(', ')
          .filter(p => this.uploaded.indexOf(p) < 0)
          .join(', ')
      )

      // Missing from Wiki
      this.currentEdit.missingWiki = this.currentEdit.missingWiki
        .split(', ')
        .filter(p => this.have.indexOf(p) < 0)
        .join(', ')
      if (this.currentEdit.missingWiki === '')
        this.currentEdit.missingWiki = 'COMPLETED'
      formData.append('missingWiki', this.currentEdit.missingWiki)

      // Add to Wiki
      if (!this.currentEdit.addWiki || this.currentEdit.addWiki === '')
        this.currentEdit.addWiki = []
      else this.currentEdit.addWiki = this.currentEdit.addWiki.split(', ')
      this.currentEdit.addWiki = this.currentEdit.addWiki
        .concat(this.uploaded)
        .filter(p => p !== 'title')
        .filter(p => this.currentEdit.missingWiki.split(', ').indexOf(p) > -1)
        .sort((a, b) => {
          if (parseInt(a) < parseInt(b)) return -1
          else return 1
        })
        .join(', ')
      formData.append('addWiki', this.currentEdit.addWiki)

      // Folder ID
      formData.append('folderId', this.currentEdit.folderId)

      // Pictures
      for (let i = 0; i < this.uploaded.length; i++) {
        const input = this.$refs['ref-' + this.uploaded[i]].$refs.fileInput
        for (let j = 0; j < input.files.length; j++) {
          formData.append('page-' + this.uploaded[i] + '-' + j, input.files[j])
        }
      }
      this.loading = true
      axios
        .put(
          'https://panyana-api.glitch.me/lore/' + this.currentEdit._id,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        .then(res => {
          this.$emit('close', 'success')
        })
        .catch(err => {
          console.log(err)
          this.$emit('close', 'error')
        })
        .finally(() => {
          this.loading = false
          for (let i = 0; i < this.uploaded.length; i++) {
            const btn = this.$refs['ref-' + this.uploaded[i]]
            btn.title = 'Upload'
            btn.$refs.fileInput.value = null
          }
          this.uploaded = []
        })
    },
    cancel() {
      for (let i = 0; i < this.uploaded.length; i++) {
        const btn = this.$refs['ref-' + this.uploaded[i]]
        btn.title = 'Upload'
        btn.$refs.fileInput.value = null
      }
      this.uploaded = []
      this.$emit('close')
    }
  }
}
</script>

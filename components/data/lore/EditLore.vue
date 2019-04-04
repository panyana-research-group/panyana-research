<template>
  <edit-data :show="show" name="Lore" :item="item || null">
    <v-data-table
      v-if="item"
      id="edit-story"
      ref="editStory"
      :headers="headers"
      :items="item.pages"
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
          <td class="px-0">
            <upload-btn
              :ref="`ref-${props.item.page}`"
              :disabled="item.missingPics && !item.missingPics.split(', ').includes(String(props.item.page))"
              fixed-width="180px"
              class="px-0"
              block
              @file-update="upload($event, String(props.item.page))"
            >
              <template slot="icon-left">
                <v-icon :class="item.missingPics && !item.missingPics.split(', ').includes(String(props.item.page)) ? 'green--text' : 'blue--text'">
                  {{ item.missingPics && !item.missingPics.split(', ').includes(String(props.item.page)) ? 'check_circle' : 'attach_file' }}
                </v-icon>
              </template>
            </upload-btn>
          </td>
          <td>
            <v-layout justify-center>
              <v-checkbox
                v-model="twoPages"
                :disabled="item.missingPics && !item.missingPics.split(', ').includes(String(props.item.page))"
                :indeterminate="item.missingPics && !item.missingPics.split(', ').includes(String(props.item.page))"
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
          <td class="px-0">
            <upload-btn
              :ref="`twoPageFile-${props.item.page}`"
              fixed-width="180px"
              class="px-0"
              block
              @file-update="upload($event, `page2-${props.item.page}`)"
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
    <template v-slot:actions>
      <v-btn color="error" dark @click="cancel">
        Cancel
      </v-btn>
      <v-btn color="success" :loading="loading" @click="edit">
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
  name: 'EditLore',
  components: {
    EditData,
    'upload-btn': UploadButton
  },
  mixins: [rules],
  props: {
    show: Boolean,
    item: {
      type: Object,
      default: () => {}
    },
    haveWiki: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: false,
      loading: false,
      uploaded: [],
      uploadedTwo: [],
      twoPages: [],
      headers: [
        { text: 'Page', sortable: false },
        { text: 'On wiki', align: 'center', sortable: false },
        {
          text: 'Upload image',
          align: 'center',
          sortable: false,
          width: '180px'
        },
        { text: '2 pages?', align: 'center', sortable: false }
      ]
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
      else if (!this.item.addWiki) return true
      if (!this.item.addWiki.split(', ').includes(String(page))) return true
    },
    isOnWiki(page) {
      if (this.item.missingWiki === 'COMPLETED') return true
      return this.item.missingWiki.split(', ').indexOf(page) < 0
    },
    upload(file, page) {
      if (file) {
        if (page.search(/page/) > -1) {
          if (this.uploadedTwo.indexOf(page.split('-')[1]) < 0)
            this.uploadedTwo.push(page.split('-')[1])
        } else if (this.uploaded.indexOf(page) < 0) this.uploaded.push(page)
      } else if (page.search(/page/) > -1) {
        this.uploadedTwo = this.uploadedTwo.filter(
          p => p !== page.split('-')[1]
        )
      } else {
        this.uploaded = this.uploaded.filter(p => p !== page)
      }
    },
    edit() {
      this.loading = true
      this.$api.get('/lore/' + this.item._id).then(data => {
        const pageCount = parseInt(this.item.onWiki.split('/')[1])
        const haveWiki = ['title']
        for (let i = 1; i <= pageCount; i++) {
          if (this.item.missingWiki.split(', ').indexOf(String(i)) < 0)
            haveWiki.push(String(i))
        }
        this.have = [...new Set([...haveWiki, ...this.have])]
        this.item.missingPics = data.data.missingPics
        this.item.missingWiki = data.data.missingWiki
        this.item.onWiki = data.data.onWiki
        this.item.addWiki = data.data.addWiki

        const update = {
          title: this.item.title,
          onWiki: `${this.have.length - 1}/${pageCount}`,
          folderId: this.item.folderId,
          missingPics: this.item.missingPics
            .split(', ')
            .filter(p => this.uploaded.indexOf(p) < 0)
            .join(', '),
          missingWiki: this.item.missingWiki
            .split(', ')
            .filter(p => this.have.indexOf(p) < 0)
            .join(', ')
        }
        if (!this.item.addWiki || this.item.addWiki === '') update.addWiki = []
        else update.addWiki = this.item.addWiki.split(', ')
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
          .put('/lore/' + this.item._id, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .then(res => {
            this.$emit('close', 'success')
          })
          .catch(err => {
            console.error(err)
            this.$emit('close', 'error')
          })
          .finally(() => {
            this.reset()
          })
      })
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

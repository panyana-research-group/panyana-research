<template>
  <v-dialog :value="show" max-width="500px" persistent>
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
              <upload-btn :disabled="currentEdit.missingPics && !currentEdit.missingPics.split(',').includes(String(props.item))" :title="currentEdit.missingPics && !currentEdit.missingPics.split(',').includes(String(props.item)) ? 'Uploaded' : 'Upload'">
                <template slot="icon-left">
                  <v-icon>attach_file</v-icon>
                </template>
              </upload-btn>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="error" dark @click="$emit('close')">
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
          pages: []
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      editHeaders: [
        { text: 'Page', sortable: false },
        { text: 'On wiki', align: 'center', sortable: false },
        { text: 'Upload image', align: 'center', sortable: false }
      ]
    }
  },
  methods: {
    isOnWiki(page) {
      if (this.currentEdit.missingWiki === 'COMPLETED') return true
      return this.currentEdit.missingWiki.split(',').indexOf(page) < 0
    }
  }
}
</script>

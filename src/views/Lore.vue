<template>
  <v-container class="primary" xs12>
    <v-flex xs10 offset-xs1>
      <v-card class="primary lighten-2 mb-2 elevation-4">
        <v-card-title class="primary lighten-2 headline">
          <v-btn color="info" class="mr-3" @click="openNewLore()">Add Story</v-btn>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search Lore"
            single-line
            hide-details
            box
            class="ml-3"
            color="secondary"
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
        >
          <template slot="items" slot-scope="props">
            <tr :class="getClasses(props.item)">
              <td>{{ props.item.title }}</td>
              <td class="text-xs-center">{{ props.item.onWiki }}</td>
              <td>{{ props.item.missingWiki }}</td>
              <td>{{ props.item.missingPics }}</td>
              <td>{{ props.item.addWiki }}</td>
              <td>
                <v-btn color="primary" class="lighten-2" icon @click="editStory(props.item)">
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
          <v-card-title class="title justify-center">Add Lore</v-card-title>
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
                :rules="titleRules"
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
                :rules="pageCountRules"
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="error" dark @click="addLore=false">Cancel</v-btn>
            <v-btn color="success" :disabled="!addComplete" @click="submit()">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="editLore" max-width="500px">
        <v-card dark>
          <v-card-title class="title justify-center pb-0">{{ currentEdit.title }}</v-card-title>
          <v-card-title class="heading justify-center pt-0">
            {{ currentEdit.onWiki.split("/")[1] }} Page(s)
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="editHeaders"
              :items="pages"
              hide-actions
              class="elevation-1"
              loading="true"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item }}</td>
                <td>
                  <v-checkbox :input-value="isOnWiki(String(props.item))" :disabled="isOnWiki(String(props.item))" @click="addToWiki(props.item)" />
                </td>
                <td class="text-xs-center">
                  <upload-btn :ripple="false">
                    <template slot="icon-left">
                      <v-icon>attach_file</v-icon>
                    </template>
                  </upload-btn>
                </td>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="error" dark @click="editLore=false">Cancel</v-btn>
            <v-btn color="success" @click="edit()">Edit</v-btn>
            <v-btn color="info" @click="reset()">Reset</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
    <v-snackbar v-model="showError" :timeout="5000" color="error">
      {{ errorText }}
      <v-btn dark flat @click.native="showError = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import _ from "lodash"
// import fs from "fs"
import UploadButton from "vuetify-upload-button"

export default {
  name: "Lore",
  components: {
    'upload-btn': UploadButton
  },
  data() {
    return {
      pagination: {sortBy: "title", descending: true, rowsPerPage: -1},
      titleRules: [
        v => !!v || "Name is required"
      ],
      pageCountRules: [
        v => !!v || "Page count is required",
        v => !isNaN(v) || "Must be a number"
      ],
      search: "",
      lore: require("../assets/lore.json").lore,
      pages: [],
      showError: false,
      errorText: "none specified",
      addLore: false,
      editLore: false,
      addComplete: false,
      editHeaders: [
        { text: "Page", sortable: false },
        { text: "On wiki", sortable: false },
        { text: "Upload image", align: "center", sortable: false }
      ],
      headers: [
        { text: "Title", value: "title", width: "25%", class:"primary lighten-2" },
        { text: "On Wiki", value: "onWiki", width: "10%", class:"primary lighten-2" },
        { text: "Missing from wiki", value: "missingWiki", width: "20%", class:"primary lighten-2" },
        { text: "Missing images", value: "missingPics", width: "20%", class:"primary lighten-2" },
        { text: "Add to wiki", value: "addWiki", width: "15%", class:"primary lighten-2" },
        { text: "Edit", sortable: false, width: "10%", class: "primary lighten-2"}
      ],
      loreTitle: null,
      pageCount: null,
      currentEdit: {
        title: "",
        onWiki: "",
        missingWiki: "",
        missingPics: "",
        addWiki: "",
      },
    }
  },
  methods: {
    showErrorMsg(msg) {
      this.errorText = msg
      this.showError = true
    },
    isOnWiki(page) {
      if (this.currentEdit.missingWiki === "N/A") return true
      return this.currentEdit.missingWiki.split(",").indexOf(page) < 0
    },
    addToWiki() {
      console.log(this.currentEdit.missingWiki)

    },
    openNewLore() {
      if (this.$store.state.loggedIn && this.$auth.user && this.$auth.user.roles && this.$auth.user.roles.includes("Admin")) {
        this.$refs.newLore.reset()
        this.addLore = true
      }
      else if (!this.$store.state.loggedIn || !this.$auth.user) {
        this.showErrorMsg("Not logged in!")
      }
      else this.showErrorMsg("Insufficient permissions!")
    },
    editStory(item) {
      this.currentEdit = item
      this.pages = _.range(1, parseInt(item.onWiki.split("/")[1])+1)
      this.editLore = true
    },
    submit() {
      this.addLore = false
      this.lore.push({
        title: this.loreTitle,
        onWiki: `0/${this.pageCount}`,
        missingWiki: _.range(1, parseInt(this.pageCount)+1).join(","),
        missingPics: _.range(1, parseInt(this.pageCount)+1).join(","),
        addWiki: ""
      })
      this.lore.sort((a, b) => {
        return a.title < b.title ? -1 : 1
      })
      // fs.writeFile("../assets/lore.json", JSON.stringify({ lore: this.lore }, null, 2), (err) => {
      //   if (err) return console.error(err)
      //   console.log("Updated lore")
      // })

    },
    getClasses(item) {
      if (item.missingWiki === "N/A") return "green lighten-2"
      else if (item.addWiki !== "") return "cyan lighten-2"
      else if (item.missingPics.split(",").length > 10) return "red lighten-2"
      else if (item.missingPics.split(",").length > 5) return "orange lighten-3"
      else return "yellow lighten-4"
    },
    customSort(items, attr, isDescending) {
      items.sort((a, b) => {
        switch (attr) {
          case "title":
            if (isDescending) return a.title < b.title ? -1 : 1
            else return a.title < b.title ? 1 : -1
            break
          case "addWiki": {
            let lenA = a.addWiki === "" ? 0 : a.addWiki.split(",").length
            let lenB = b.addWiki === "" ? 0 : b.addWiki.split(",").length
            if (lenA === lenB) return 0
            if (isDescending) return lenA < lenB ? -1 : 1
            else return lenA < lenB ? 1 : -1
            break
          }
          case "missingPics": {
            let lenA = a.missingPics === "COMPLETED" ? 0 : a.missingPics.split(",").length
            let lenB = b.missingPics === "COMPLETED" ? 0 : b.missingPics.split(",").length
            if (lenA === lenB) return 0
            if (isDescending) return lenA < lenB ? -1 : 1
            else return lenA < lenB ? 1 : -1
            break
          }
          case "missingWiki":{
            let lenA = a.missingWiki === "N/A" ? 0 : a.missingWiki.split(",").length
            let lenB = b.missingWiki === "N/A" ? 0 : b.missingWiki.split(",").length
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
</style>

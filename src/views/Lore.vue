<template>
  <v-container class="primary" xs12>
    <v-flex xs10 offset-xs1>
      <v-card class="primary lighten-2 mb-2 elevation-4">
        <v-card-title class="primary lighten-2 headline">
          Search Lore
          <v-spacer />
          <v-text-field v-model="search"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
          />
        </v-card-title>
        <v-data-table id="lore-table"
                      :items="lore"
                      :headers="headers"
                      :custom-sort="customSort"
                      :search="search"
                      item-key="title"
                      hide-actions
        >
          <template slot="items" slot-scope="props">
            <tr :class="getClasses(props.item)">
              <td>{{ props.item.title }}</td>
              <td class="text-xs-center">{{ props.item.onWiki }}</td>
              <td>{{ props.item.missingWiki }}</td>
              <td>{{ props.item.missingPics }}</td>
              <td>{{ props.item.addWiki }}</td>
              <td>
                <v-btn color="secondary" icon>
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
    </v-flex>
  </v-container>
</template>
<script>
export default {
  name: "Lore",
  data() {
    return {
      search: "",
      lore: require("../assets/lore.json").lore,
      headers: [
        { text: "Title", value: "title", width: "25%", class:"primary lighten-2" },
        { text: "On Wiki", value: "onWiki", width: "10%", class:"primary lighten-2" },
        { text: "Missing from wiki", value: "missingWiki", width: "20%", class:"primary lighten-2" },
        { text: "Missing images", value: "missingPics", width: "20%", class:"primary lighten-2" },
        { text: "Add to wiki", value: "addWiki", width: "15%", class:"primary lighten-2" },
        { text: "Edit", sortable: false, width: "10%", class: "primary lighten-2"}
      ]
    }
  },
  methods: {
    getClasses: (item) => {
      if (item.missingWiki === "N/A") return "green lighten-2"
      else if (item.addWiki !== "") return "cyan lighten-2"
      else if (item.missingPics.split(",").length > 10) return "red lighten-2"
      else if (item.missingPics.split(",").length > 5) return "orange lighten-3"
      else return "yellow lighten-4"
    },
    customSort: (items, attr, isDescending) => {
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

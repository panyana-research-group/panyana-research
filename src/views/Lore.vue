<template>
  <v-container class="primary">
    <v-flex xs10 offset-xs1>
      <v-data-table id="lore-table"
                    :items="lore"
                    :headers="headers"
                    :custom-sort="customSort"
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
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-container>
</template>
<script>
export default {
  name: "Lore",
  data() {
    return {
      lore: require("../assets/lore.json").lore,
      headers: [
        { text: "Title", value: "title", width: "25%", class:"primary lighten-2" },
        { text: "On Wiki", value: "onWiki", width: "10%", class:"primary lighten-2" },
        { text: "Missing from wiki", value: "missingWiki", width: "25%", class:"primary lighten-2" },
        { text: "Missing images", value: "missingPics", width: "25%", class:"primary lighten-2" },
        { text: "Add to wiki", value: "addWiki", width: "15%", class:"primary lighten-2" }
      ]
    }
  },
  methods: {
    getClasses: (item) => {
      if (item.missingWiki === "N/A") return "green lighten-2"
      else if (item.addWiki !== "") return "cyan lighten-2"
    },
    customSort: (items, attr, isDescending) => {
      items.sort((a, b) => {
        switch (attr) {
          case "title":
            if (isDescending) return a.title < b.title ? -1 : 1
            else return a.title < b.title ? 1 : -1
            break
          case "addWiki":
            const lenA = a.addWiki === "" ? 0 : a.addWiki.split(",").length
            const lenB = b.addWiki === "" ? 0 : b.addWiki.split(",").length
            if (lenA === lenB) return 0
            if (isDescending) return lenA < lenB ? -1 : 1
            else return lenA < lenB ? 1 : -1
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

  tr {
    border-bottom: 1px solid black !important;

    &:hover {
      filter: brightness(80%)
    }
  }
}
</style>

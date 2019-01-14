<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Panyana Research</v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat to="/">Home</v-btn>
        <v-btn flat to="/about">About</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content> <router-view /> </v-content>
    <v-navigation-drawer v-model="drawer" temporary absolute dark>
      <v-list>
        <v-list-tile v-for="type in dataTypes" :key="type.name" avatar>
          <v-list-tile-avatar>
            <v-icon>{{ type.icon }}</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>{{ type.name }}</v-list-tile-content>

          <v-list-tile-action>
            <v-btn icon ripple>
              <v-icon>edit</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      drawer: false,
      dataTypes: [
        {
          name: "Clothing",
          icon: "accessibility_new"
        },
        {
          name: "Salvage",
          icon: "attachment"
        },
        {
          name: "Procedurals",
          icon: "memory"
        },
        {
          name: "Lore",
          icon: "library_books"
        },
        {
          name: "Schematics",
          icon: "settings"
        }
      ]
    }
  }
}
</script>

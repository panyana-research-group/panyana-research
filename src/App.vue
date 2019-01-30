<template>
  <v-app>
    <v-toolbar color="info" app>
      <v-toolbar-side-icon class="secondary--text" @click.stop="drawer = !drawer" />
      <v-toolbar-title color="secondary" class="secondary--text">Panyana Research</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <!-- <v-btn color="secondary" flat to="/">Home</v-btn>
        <v-btn color="secondary" flat to="/about">About</v-btn> -->
        <v-menu :nudge-width="200"
                :close-on-content-click="false"
                :disabled="!$auth.isAuthenticated()"
                offset-y
                transition="scale-transition"
                origin="top right"
        >
          <v-btn slot="activator" color="secondary" flat @click="showInfo()">
            <v-icon :color="$auth.isAuthenticated() ? 'green' : 'red'" large>account_circle</v-icon>
          </v-btn>
          <v-card>
            <v-card-title class="title">
              Account
            </v-card-title>
          </v-card>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-content> <router-view /> </v-content>
    <v-navigation-drawer v-model="drawer" class="info darken-1" temporary absolute dark>
      <v-list>
        <v-list-tile v-for="type in scienceTypes" :key="type.name" :to="'/'+type.name.toLowerCase()" active-class="secondary--text" avatar>
          <v-list-tile-avatar>
            <v-icon>{{ type.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>{{ type.name }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list>
        <v-list-tile v-for="type in dataTypes" :key="type.name" avatar :to="'/'+type.name.toLowerCase()" active-class="secondary--text">
          <v-list-tile-avatar>
            <v-icon>{{ type.icon }}</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>{{ type.name }}</v-list-tile-content>
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
      ],
      scienceTypes: [
        {
          name: "Cooling",
          icon: "wb_sunny"
        }
      ]
    }
  },
  methods: {
    showInfo() {
      console.log(this.$auth.user)
    }
  }
}
</script>

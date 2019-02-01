<template>
  <v-app>
    <v-toolbar color="info" app>
      <v-toolbar-side-icon class="white--text" @click.stop="drawer = !drawer" />
      <v-toolbar-title class="white--text">
        Panyana Research
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <!-- <v-btn color="secondary" flat to="/">Home</v-btn>
        <v-btn color="secondary" flat to="/about">About</v-btn> -->
        <v-menu :close-on-content-click="false" offset-y>
          <v-btn slot="activator" color="secondary" flat class="title" dark>
            {{ $store.state.authLoggedIn ? $auth.user.name : "Guest" }}
            <v-icon :color="$store.state.authLoggedIn ? 'green' : 'red'" class="pl-1" large>
              account_circle
            </v-icon>
          </v-btn>
          <v-card>
            <v-card-title class="title">
              Account
            </v-card-title>
            <v-card-text v-if="$store.state.authLoggedIn">
              Roles: {{ $auth.user.roles ? $auth.user.roles.join(",") : "None" }}
            </v-card-text>
            <v-card-title class="title">
              Auth0
            </v-card-title>
            <v-card-actions>
              <v-btn v-if="!$store.state.authLoggedIn" color="success" @click="$auth.login()">
                Login
              </v-btn>
              <v-btn v-if="$store.state.authLoggedIn" color="error" @click="$auth.logout()">
                Logout
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-content> <nuxt /> </v-content>
    <v-navigation-drawer v-model="drawer" class="info darken-1" temporary absolute dark>
      <v-list>
        <v-list-tile to="/" avatar active-class="secondary--text" nuxt>
          <v-list-tile-avatar>
            <v-icon>home</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            Home
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/about" avatar active-class="secondary--text" nuxt>
          <v-list-tile-avatar>
            <v-icon>chat</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            About
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list>
        <v-list-tile 
          v-for="type in scienceTypes" 
          :key="type.name" 
          :to="'/'+type.name.toLowerCase()" 
          active-class="secondary--text" 
          avatar 
          nuxt
        >
          <v-list-tile-avatar>
            <v-icon>{{ type.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>{{ type.name }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list>
        <v-list-tile 
          v-for="type in dataTypes" 
          :key="type.name" 
          avatar 
          :to="'/data/'+type.name.toLowerCase()" 
          active-class="secondary--text" 
          nuxt
        >
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
  name: 'App',
  metaInfo: {
    titleTemplate: '%s | Panyana Research',
    title: 'Unnamed'
  },
  data() {
    return {
      drawer: false,
      accountMenu: false,
      dataTypes: [
        {
          name: 'Clothing',
          icon: 'accessibility_new'
        },
        {
          name: 'Salvage',
          icon: 'attachment'
        },
        {
          name: 'Procedurals',
          icon: 'memory'
        },
        {
          name: 'Lore',
          icon: 'library_books'
        },
        {
          name: 'Schematics',
          icon: 'settings'
        }
      ],
      scienceTypes: [
        {
          name: 'Cooling',
          icon: 'wb_sunny'
        }
      ]
    }
  },
  created() {
    // console.log(this)
  }
}
</script>
<style lang="scss">
.v-list__tile--active .v-icon {
  color: inherit;
}
</style>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" class="info darken-1" temporary absolute dark>
      <v-list v-for="type in Object.keys(navDrawer)" :key="type">
        <v-subheader class="nav">
          {{ type }}
        </v-subheader>
        <v-list-tile
          v-for="item in navDrawer[type]"
          :key="item.name"
          :to="item.to || ''"
          active-class="secondary--text"
          avatar
          nuxt
        >
          <v-list-tile-avatar>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            {{ item.name }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="info" app>
      <v-toolbar-side-icon class="white--text" @click.stop="drawer = !drawer" />
      <v-toolbar-title class="white--text">
        Panyana Research
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
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
            <v-card-text v-if="!$store.state.authLoggedIn">
              If you have permissions, logging in allows you to change certain data
            </v-card-text>
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
    <v-content>
      <v-container class="grey darken-2" fluid>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      drawer: false,
      accountMenu: false,
      navDrawer: {
        Calculators: [
          { name: 'Engine', icon: '', to: '/calculators/engines' },
          { name: 'Fuel Efficiency', icon: 'local_gas_station' },
          { name: 'Skycore Capacity', icon: '' }
        ],
        'Material Info': [
          { name: 'Cooling', icon: 'waves', to: '/materials/cooling' },
          { name: 'Engines', icon: '' },
          { name: 'Wings', icon: '' },
          { name: 'Cannons/Swivels', icon: '' },
          { name: 'Resilience', icon: '' }
        ],
        Data: [
          { name: 'Clothing', icon: 'accessibility_new' },
          { name: 'Salvage', icon: 'attachment' },
          { name: 'Procedurals', icon: 'memory' },
          { name: 'Lore', icon: 'library_books', to: '/data/lore' },
          { name: 'Schematics', icon: 'settings' }
        ]
      }
    }
  },
  mounted() {
    if (process.browser) {
      if (this.$auth.isAuthenticated()) this.$store.commit('authLogIn')
    }
  }
}
</script>
<style lang="scss">
.v-list__tile--active .v-icon {
  color: inherit;
}
.v-subheader.nav {
  height: 20px;
}
</style>

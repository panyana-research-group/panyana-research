<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary absolute dark>
      <v-list class="pa-2 ma-3">
        <v-list-tile class="text-uppercase elevation-2 primary py-3 mb-3" avatar>
          <v-list-tile-content class="text-xs-center headline">
            Panyana Resarch Menu
          </v-list-tile-content>
        </v-list-tile>
        <v-list-group v-for="type in Object.keys(navDrawer)" :key="type" class="info darken-1 elevation-2 my-2">
          <v-list-tile slot="activator" class="py-2">
            {{ type }}
          </v-list-tile>
          <template v-for="(item, index) in navDrawer[type]">
            <v-list-tile :key="item.name" :to="item.to || ''" active-class="secondary--text" avatar nuxt>
              <v-list-tile-avatar>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                {{ item.name }}
              </v-list-tile-content>
            </v-list-tile>
            <v-divider v-if="index + 1 < navDrawer[type].length" :key="`divider-${index}`" />
          </template>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="primary" app>
      <v-toolbar-side-icon class="white--text accent" @click.stop="drawer = !drawer" />
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
      <v-container grid-list-md class="grey darken-2" fluid style="min-height: 100%">
        <nuxt @openDrawer="drawer = true" />
      </v-container>
    </v-content>
    <v-footer height="auto" class="primary">
      <v-layout row wrap justify-center>
        <v-btn nuxt to="/">
          Home
        </v-btn>
        <v-btn nuxt to="/about">
          About Us
        </v-btn>
        <v-btn :disabled="true">
          Team
        </v-btn>
        <v-btn :disabled="true">
          Services
        </v-btn>
        <v-btn :disabled="true">
          Blog
        </v-btn>
        <v-btn :disabled="true">
          Contact Us
        </v-btn>
        <v-flex xs12 pb-1 text-xs-center white--text>
          &copy;2019 — <strong>Panyana Research Group</strong>
        </v-flex>
      </v-layout>
    </v-footer>
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

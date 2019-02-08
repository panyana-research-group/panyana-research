<template>
  <v-app class="secondary--text">
    <v-navigation-drawer v-model="drawer" temporary absolute class="primary">
      <v-list class="pa-2 ma-3">
        <v-list-tile class="text-uppercase elevation-2 primary lighten-2 secondary--text mb-3" avatar>
          <div class="text-xs-center headline" style="width: 100%">
            Menu
          </div>
          <!-- <v-list-tile-title class="text-xs-center">Menu</v-list-tile-title> -->
        </v-list-tile>
        <v-list-group v-for="type in Object.keys(navDrawer)" :key="type" class="secondary primary--text elevation-2 my-2">
          <v-list-tile slot="activator" class="py-2">
            {{ type }}
          </v-list-tile>
          <template v-for="(item, index) in navDrawer[type]">
            <v-list-tile :key="item.name" :to="item.to || ''" active-class="accent" avatar nuxt>
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
      <v-toolbar-side-icon class="secondary--text" @click.stop="drawer = !drawer" />
      <v-toolbar-title class="secondary--text">
        Panyana Research Group
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
          <v-card color="secondary">
            <v-card-title class="title justify-center">
              Account
            </v-card-title>
            <v-card-text v-if="!$store.state.authLoggedIn" class="py-0 text-xs-center">
              If you have permissions, logging in allows you to change certain data
            </v-card-text>
            <v-card-text v-if="$store.state.authLoggedIn" class="py-0 text-xs-center">
              Roles: {{ $auth.user.roles ? $auth.user.roles.join(",") : "None" }}
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn v-if="!$store.state.authLoggedIn" color="success" @click="$auth.login()">
                Login
              </v-btn>
              <v-btn v-if="$store.state.authLoggedIn" color="warning" @click="$auth.logout()">
                Logout
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container grid-list-md class="primary lighten-2" fluid style="min-height: 100%">
        <nuxt @openDrawer="drawer = true" />
      </v-container>
    </v-content>
    <v-footer height="auto" class="primary">
      <v-layout row wrap justify-center>
        <v-btn active-class="v-btn--active darken-4" color="secondary" nuxt to="/" class="primary--text">
          Home
        </v-btn>
        <v-btn active-class="v-btn--active darken-4" color="secondary" nuxt to="/about" class="primary--text">
          About Us
        </v-btn>
        <v-flex xs12 pb-1 text-xs-center secondary--text>
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

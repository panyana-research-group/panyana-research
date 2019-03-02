<template>
  <v-app class="secondary--text">
    <v-navigation-drawer v-model="drawer" temporary fixed class="primary">
      <v-list class="pa-2 ma-3">
        <v-list-tile class="text-uppercase elevation-2 primary lighten-2 secondary--text mb-3" avatar>
          <div class="text-xs-center headline" style="width: 100%">
            Menu
          </div>
          <!-- <v-list-tile-title class="text-xs-center">Menu</v-list-tile-title> -->
        </v-list-tile>
        <v-list-group v-for="type in navDrawer" :key="type.name" :prepend-icon="type.icon" class="secondary primary--text elevation-2 my-2">
          <v-list-tile slot="activator" class="py-2">
            {{ type.name }}
          </v-list-tile>
          <template v-for="(item, index) in type.rows">
            <v-list-tile
              :key="item.name"
              :to="item.to || ''"
              active-class="accent"
              :class="{ 'red lighten-3': !item.to }"
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
            <v-divider v-if="index + 1 < type.rows.length" :key="`divider-${index}`" />
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
            <span class="hidden-xs-only">
              {{ $store.state.loggedIn ? $auth.userProfile.name : "Guest" }}
            </span>
            <v-icon :color="$store.state.loggedIn ? 'green' : 'red'" class="pl-1" large>
              account_circle
            </v-icon>
          </v-btn>
          <v-card color="secondary">
            <v-card-title class="title justify-center">
              Account
            </v-card-title>
            <v-card-text v-if="!$store.state.loggedIn" class="py-0 text-xs-center">
              If you have permissions, logging in with Auth0 allows you to change certain data
            </v-card-text>
            <v-card-text v-if="$store.state.loggedIn" class="py-0 text-xs-center">
              Roles: {{ $auth.userProfile.roles ? $auth.userProfile.roles.join(",") : "None" }}
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn v-if="!$store.state.loggedIn" color="success" @click="$auth.login()">
                Login
              </v-btn>
              <v-btn v-if="$store.state.loggedIn" color="warning" @click="$auth.logout(); $store.commit('authLogOut')">
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
    <v-footer height="auto" color="primary" app fixed>
      <v-layout row wrap justify-center>
        <v-btn active-class="v-btn--active darken-4" color="secondary" nuxt to="/" class="primary--text">
          Home
        </v-btn>
        <v-btn active-class="v-btn--active darken-4" color="secondary" nuxt to="/about" class="primary--text">
          About Us
        </v-btn>
        <v-btn color="error" target="_blank" href="https://github.com/PanyanaResearch/panyana-science/issues/new">
          Report an Issue
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
      navDrawer: [
        {
          name: 'Calculators',
          icon: 'mdi-calculator',
          rows: [
            { name: 'Engine', icon: 'mdi-engine', to: '/calculators/engines' },
            {
              name: 'Fuel Consumption',
              icon: 'local_gas_station',
              to: '/calculators/fuelconsumption'
            },
            { name: 'Skycore Capacity', icon: 'mdi-arrow-up-bold-circle' }
          ]
        },
        {
          name: 'Material Info',
          icon: 'mdi-information',
          rows: [
            {
              name: 'Cooling',
              icon: 'mdi-radiator-off',
              to: '/materials/cooling'
            },
            { name: 'Engines', icon: 'mdi-engine', to: '/materials/engines' },
            {
              name: 'Wings',
              icon: 'mdi-airplane-takeoff',
              to: '/materials/wings'
            },
            { name: 'Cannons/Swivels', icon: 'mdi-pistol' },
            { name: 'Resilience', icon: 'mdi-hard-hat' }
          ]
        },
        {
          name: 'Data',
          icon: 'mdi-database',
          rows: [
            { name: 'Clothing', icon: 'mdi-tshirt-crew' },
            { name: 'Salvage', icon: 'attachment' },
            { name: 'Procedurals', icon: 'memory' },
            { name: 'Lore', icon: 'mdi-book-open-variant', to: '/data/lore' },
            { name: 'Schematics', icon: 'settings' }
          ]
        }
      ]
    }
  },
  created() {
    this.$auth.authNotifier.on('authChange', authState => {
      this.$store.commit('changeAuth', authState.authenticated)
    })

    if (process.browser && this.$auth.getAuthenticatedFlag() === 'true') {
      this.$auth.renewSession()
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

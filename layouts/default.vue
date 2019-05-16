<template>
  <v-app class="secondary--text">
    <v-navigation-drawer v-model="drawer.nav" app fixed class="primary">
      <v-list class="pa-2 ma-3">
        <v-list-tile class="text-uppercase elevation-2 primary lighten-2 secondary--text mb-3" avatar>
          <div class="text-xs-center headline" style="width: 100%">
            Menu
          </div>
        </v-list-tile>
        <v-list-group v-for="type in buttonInfo" :key="type.name" :prepend-icon="type.icon" class="secondary primary--text elevation-2 my-2">
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
      <v-btn color="accent" class="primary--text" @click="drawer.nav = !drawer.nav">
        <v-icon left>
          {{ drawer.nav ? 'arrow_back' : 'menu' }}
        </v-icon>
        Menu
      </v-btn>
      <v-toolbar-title class="secondary--text">
        Panyana Research Group
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn color="accent" class="title" flat @click="drawer.acct = !drawer.acct">
          {{ auth.loggedIn ? auth.user.name : "Guest" }}
          <v-icon :color="auth.loggedIn ? 'green' : 'red'" class="ml-1" large>
            account_circle
          </v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-dialog
      v-model="drawer.acct"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="400px"
      transition="scale-transition"
      origin="center center"
    >
      <v-card dark>
        <v-toolbar color="primary" class="account">
          <template v-if="auth.loggedIn">
            <v-img :src="auth.user.picture" max-width="50px" style="border-radius: 4px;" class="mr-2" contain />
            <span class="d-inline-block">
              <span class="title">{{ auth.user.name }}</span><br>
              <span class="body-1">{{ auth.user.email }}</span>
            </span>
          </template>
          <template v-else>
            <span class="subheading pl-2">Guest</span>
          </template>
          <v-spacer />
          <v-toolbar-items>
            <v-btn color="warning" icon flat @click="drawer.acct = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text v-if="auth.loggedIn && auth.roles && auth.roles.length" class="text-xs-center">
          <span class="subheading">Roles</span>
          <v-divider class="mx-5" />
          <span v-for="r in auth.roles" :key="r.name">{{ r.name }}<br></span>
        </v-card-text>
        <v-card-actions v-if="!auth.loggedIn" class="justify-center">
          <v-btn color="success" @click="$auth.login(); drawer.acct = false">
            Login
          </v-btn>
        </v-card-actions>
        <v-card-actions v-else class="justify-center">
          <v-btn
            v-if="auth.roles && auth.roles.length && auth.roles.find(r => r.name === 'Admin')"
            color="info"
            class="primary--text"
            to="/admin"
            nuxt
            @click="drawer.acct = false"
          >
            Admin
          </v-btn>
          <v-btn color="warning" @click="$auth.logout(); drawer.acct = false">
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-content>
      <v-container grid-list-md class="primary lighten-2" fluid style="min-height: 100%; min-width: 600px">
        <nuxt />
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
import { calculators, materials, data } from '@/components/mixins/pages'
export default {
  name: 'App',
  // middleware: 'drawer',
  mixins: [calculators, materials, data],
  data() {
    return {
      roles: [],
      drawer: {
        acct: null,
        nav: null
      }
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
    buttonInfo() {
      return [
        this.calculatorsButtonInfo,
        this.materialsButtonInfo,
        this.dataButtonInfo
      ]
    }
    // drawer: {
    //   get() {
    //     return this.$store.state.navDrawer
    //   },
    //   set(value) {
    //     this.$store.commit('drawerState', value)
    //   }
    // }
  },
  methods: {
    handleLoginEvent(data) {
      console.log(data)
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

.account > .v-toolbar__content {
  padding-left: 8px;
  padding-right: 8px;
}
</style>

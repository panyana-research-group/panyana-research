<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 xl8>
      <v-card color="primary" dark>
        <v-card-text class="headline text-xs-center">
          Users
        </v-card-text>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="users"
            :loading="loading"
            class="ma-2"
            hide-actions
          >
            <template v-slot:items="props">
              <td>
                <img :src="props.item.picture" alt="No Image" width="50px">
              </td>
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.email }}</td>
              <td>{{ props.item.logins_count }}</td>
              <td>{{ props.item.roles.join(', ') }}</td>
              <td>{{ parseTime(props.item.last_login) }}</td>
              <td class="text-xs-center">
                <v-tooltip top>
                  Edit user's info
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" icon v-on="on">
                      <v-icon color="info">
                        edit
                      </v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import moment from 'moment'

export default {
  name: 'AdminHome',
  middleware: 'admin',
  data() {
    return {
      loading: true,
      headers: [
        { text: '', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: '# of Logins', value: 'logins_count' },
        { text: 'Roles', sortable: false },
        { text: 'Last Login', value: 'last_login' },
        { text: 'Edit', sortable: false, align: 'center' }
      ],
      users: [],
      roles: []
    }
  },
  mounted() {
    this.$api.get('/auth/users/all').then(resUsers => {
      resUsers.data.forEach(u => {
        u.roles = []
      })
      this.$api.get('/auth/roles/all').then(resRoles => {
        this.roles = resRoles.data
        this.asyncForEach(this.roles, async r => {
          const resRole = await this.$api.get(`/auth/roles/${r.id}/users`)
          resRole.data.forEach(u => {
            resUsers.data
              .find(usr => usr.user_id === u.user_id)
              .roles.push(r.name)
          })
        })
        this.loading = false
        this.users = resUsers.data
      })
    })
  },
  methods: {
    parseTime(time) {
      return moment(time).format('MM/DD/YY h:mm a')
    },
    async asyncForEach(array, callback) {
      for (let i = 0; i < array.length; i++) {
        await callback(array[i], i, array)
      }
    }
  }
}
</script>

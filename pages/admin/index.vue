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
                <img :src="props.item.picture" alt="No Image" height="50px" class="d-block mx-auto">
              </td>
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.email }}</td>
              <td>{{ props.item.logins_count }}</td>
              <td>{{ props.item.roles.map(r => r.text).join(', ') }}</td>
              <td>{{ parseTime(props.item.last_login) }}</td>
              <td class="text-xs-center">
                <v-tooltip top>
                  Edit user's info
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" icon v-on="on" @click="editDialog(props.item)">
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
    <v-dialog
      v-if="editUser"
      v-model="editUserMenu"
      max-width="500px"
      persistent
    >
      <v-card color="primary" dark>
        <v-card-text class="text-xs-center">
          <span class="headline">{{ editUser.name }}</span><br>
          <span class="subtitle">{{ editUser.email }}</span>
        </v-card-text>
        <v-card-text>
          <v-select
            v-model="editUser.roles"
            :items="roles"
            label="User Roles"
            hide-details
            persistent-hint
            multiple
            small-chips
            @change="editDisabled = false"
          />
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="warning" @click="close(true)">
            Cancel
          </v-btn>
          <v-btn color="success" :disabled="editDisabled" :loading="editLoading" @click="edit">
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snack.show" :timeout="5000" :color="snack.color">
      {{ snack.text }}
      <v-btn dark flat @click.native="snack.show = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>
<script>
import moment from 'moment'

export default {
  name: 'AdminHome',
  middleware: 'admin',
  data() {
    return {
      loading: 'info',
      editLoading: false,
      editDisabled: true,
      editUserMenu: false,
      editUser: null,
      snack: {
        show: false,
        color: 'success',
        text: 'No info'
      },
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
      roles: [],
      roleData: []
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    parseTime(time) {
      return moment(time).format('MM/DD/YY h:mm a')
    },
    refresh() {
      this.loading = 'info'
      this.users = []
      this.roles = []
      this.roleData = []
      this.$api.get('/auth/users/all').then(resUsers => {
        resUsers.data.forEach(u => {
          u.roles = []
        })
        this.$api.get('/auth/roles/all').then(resRoles => {
          this.roleData = resRoles.data
          resRoles.data.forEach(r => {
            this.roles.push({
              text: r.name,
              value: r.id
            })
          })
          this.asyncForEach(this.roles, async r => {
            const resRole = await this.$api.get(`/auth/roles/${r.value}/users`)
            resRole.data.forEach(u => {
              resUsers.data.find(usr => usr.user_id === u.user_id).roles.push(r)
            })
          })
          this.loading = false
          this.users = resUsers.data
        })
      })
    },
    editDialog(user) {
      this.editUser = user
      this.editUserMenu = true
    },
    edit() {
      this.editLoading = true
      this.$api
        .post(`/auth/users/${this.editUser.user_id}/editroles`, {
          roles: this.editUser.roles
        })
        .then(res => {
          this.snack.color = 'success'
          this.snack.text = 'Successfully updated users!'
        })
        .catch(() => {
          this.snack.color = 'error'
          this.snack.text = 'Something went wrong...'
        })
        .finally(() => {
          this.editLoading = false
          this.close(false)
        })
    },
    close(cancel) {
      if (!cancel) this.snack.show = true
      this.editUserMenu = false
      this.editUser = null
      this.editDisabled = true
      if (!cancel) this.refresh()
    }
  }
}
</script>

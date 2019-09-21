<template>
  <v-app v-cloak>
    <v-toolbar app dense :fixed="true" color="blue">
      <v-toolbar-side-icon class="white--text" @click="toggleDrawer"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-view name="header_icons"></router-view>
    </v-toolbar>

    <v-navigation-drawer
      app
      v-model="drawer"
      absolute
      temporary
    >
      <v-list class="pa-1" two-lines>
        <v-list-tile
          avatar
          tag="div"
          :ripple="true"
          :to="{ name: 'list_index' }"
          @click="closeDrawer"
          active-class=""
          >
          <v-list-tile-avatar>
            <img src="./assets/logo.svg" alt="">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title class="title">{{ $t('name') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list two-lines>
        <v-divider light></v-divider>

        <v-list-tile
          v-for="(list, index) in lists"
          :ripple="true"
          :to="{ name: 'list_detail', params: { id: index } }"
          @click="closeDrawer"
          active-class="black--text"
          class="py-1"
        >
          <v-list-tile-action>
            <v-icon>shopping_basket</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ list.name || '[senza nome]' }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $tc('list_num_items', list.items.length) }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider class="mt-5" :inset="true" v-if="lists.length"></v-divider>

        <v-list-tile
          :ripple="true"
          :to="{ name: 'list_new'}"
          @click="closeDrawer"
        >
          <v-list-tile-action>
            <v-icon>border_color</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ $t('list_create') }}</v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>

        <v-divider :inset="true"></v-divider>

        <v-list-tile
          :ripple="true"
          @click="pushNotificationToggle"
          v-if="pushNotificationSupported"
        >
          <v-list-tile-action>
            <v-icon>{{ pushNotificationEnabled ? 'notifications_off' : 'notifications' }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ $t(pushNotificationEnabled ? 'notification_disabled' : 'notification_enabled') }}</v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content class="pt-5 blue-grey lighten-5">
      <v-container fluid>
        <transition name="page" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-content>

    <NotificationBar></NotificationBar>
  </v-app>
</template>


<script>
import NotificationBar from './components/NotificationBar.vue'
import { mapState, mapActions } from 'vuex'
import PushNotificationManager from '@/plugins/pushnotification'

export default {
  name: 'app',
  mixins: [
    PushNotificationManager
  ],
  components: {
    NotificationBar
  },
  data: () => {
    return {
      notification: '',
    }
  },
  computed:{
    drawer: {
      get: function () {
        return this.$store.state.drawer
      },
      set: function (newValue) {
        if (newValue)
          this.$store.dispatch('openDrawer')
        else
          this.$store.dispatch('closeDrawer')
      }
    },
    ...mapState({
      title: state => state.title,
      lists: state => state.lists
    })
  },
  methods: {
    ...mapActions([ 'toggleDrawer', 'closeDrawer' ])
  }
}
</script>

<style>
[v-cloak] {
  display: none
}
html, body {
  font:400 16px 'Roboto', sans-serif;
}
.page-enter-active, .page-leave-active {
  transition: opacity .3s, transform .3s;
}
.page-enter, .page-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>

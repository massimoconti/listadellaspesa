<template>
  <v-app v-cloak>

    <v-navigation-drawer
      app
      v-model="drawer"
      temporary
      fixed
      width="300px"
    >
      <v-list two-lines class="py-0">
        <v-list-item
          tag="div"
          :ripple="true"
          :to="{ name: 'list_index' }"
          @click="closeDrawer"
          >
          <v-list-item-avatar>
            <img src="./assets/logo.svg" alt="">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="title ma-0 pa-0">{{ $t('name') }}</v-list-item-title>
            <v-list-item-subtitle class="caption ma-0 pa-0">
              Versione 1.6.1
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list two-lines class="pt-0">
        <v-divider light></v-divider>

        <v-list-item
          v-for="(list, index) in lists"
          :ripple="true"
          :to="{ name: 'list_detail', params: { id: index } }"
          @click="closeDrawer"
          active-class="black--text"
          class="py-0"
        >
          <v-list-item-action>
            <v-icon>shopping_basket</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ list.name || '[senza nome]' }}</v-list-item-title>
            <v-list-item-subtitle>{{ $tc('list_num_items', list.items.length) }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider v-if="lists.length"></v-divider>

        <v-list-item
          :ripple="true"
          :to="{ name: 'list_new'}"
          @click="closeDrawer"
        >
          <v-list-item-action>
            <v-icon>border_color</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">{{ $t('list_create') }}</v-list-item-title>
          </v-list-item-content>

        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      dark
      dense
      :fixed="true"
      color="blue"
      >
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <div class="flex-grow-1"></div>
      <router-view name="header_icons"></router-view>
    </v-app-bar>

    <v-content class="pt-2 mt-12 px-1 blue-grey lighten-5">
      <v-container fluid>
        <transition name="page" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-content>

    <v-scroll-x-transition>
      <router-view name="footer"></router-view>
    </v-scroll-x-transition>

    <NotificationBar></NotificationBar>
  </v-app>
</template>

<script>
import NotificationBar from './components/NotificationBar.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'app',
  components: {
    NotificationBar
  },
  data: () => {
    return {
      notification: ''
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
  methods: mapActions([ 'toggleDrawer', 'closeDrawer' ])
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

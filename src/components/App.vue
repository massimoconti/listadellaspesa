<template>
  <div v-cloak>
    <SidebarNavigation>
      <aside>
        <h2>
          <router-link :to="{ name: 'list_index' }">
            <img src="../assets/logo.svg" alt=""> Lista della spesa
          </router-link>
        </h2>

        <ul>
          <li v-for="(list, index) in lists" @click="closeNav">
            <router-link :to="{ name: 'list_detail', params: { id: index } }">
              {{ list.name || '[senza nome]' }}
              <br><small>{{ list.items.length }} {{ list.items.length==1 ? 'articolo' : 'articoli' }}</small>
            </router-link>
          </li>
          <li class="create" @click="closeNav">
            <router-link :to="{ name: 'list_new' }">
              <i class="ico ico-plus">+</i> Crea nuova lista
            </router-link>
          </li>
        </ul>
      </aside>
    </SidebarNavigation>

    <header>
      <div id="header-wrapper">
        <a href="#" @click.prevent="openNav">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </a>
        <h1>{{ title }}</h1>

        <router-view name="header_icons"></router-view>
      </div>
    </header>

    <main>
      <transition name="page" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>

    <NotificationBar></NotificationBar>
  </div>
</template>


<script>
import NotificationBar from './NotificationBar.vue'
import SidebarNavigation from './SidebarNavigation.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'app',
  components: {
    NotificationBar,
    SidebarNavigation
  },
  data: () => {
    return {
      notification: ''
    }
  },
  computed: mapState({
    title: state => state.title,
    lists: state => state.lists
  }),
  methods: {
    ...mapActions([ 'closeNav' ]),
    openNav: function(){
      this.$store.dispatch('openNav');
    }
  }
}
</script>

<style>
[v-cloak] {
  display: none
}
* {
  margin: 0;
  padding: 0;
  border:0;
}
html, body {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background: #01a3e1;
  font:300 16px 'Roboto', sans-serif;
}
ul, li {
  display:block;
}
header {
  background: #0C7DAF;
  padding:0.4rem 0;
  margin-bottom: 1rem;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}
header h1 {
  display:inline-block;
  overflow: hidden;
  width:75%;
  padding: 0 0 0 0.5rem;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
  font:500 1.3rem 'Roboto', sans-serif;
  color:#fff;
}
header a {
  display:inline-block;
  text-decoration: none;
  color:#fff;
  vertical-align: middle;
}
#header-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 0.2rem 0.4rem 0 0.4rem;
}

main {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 0.4rem;
}

nav aside {
  padding: 0.7rem;
  color:#333;
}

nav aside h2 {
  margin:-0.7rem;
  padding: 0.7rem;
  border-bottom: 1px solid #ddd;
  font-size:1.2rem;
  font-weight: 500;
}

nav aside h2 img {
  width:40px;
  vertical-align: middle;
}

nav aside ul {
  margin-top:1.5rem;
}

nav aside li {
  padding: 0.5rem 0;
}

nav aside li a {
  font-size:0.95rem;
  font-weight: 500;
}

nav aside li small {
  font-weight: normal;
}

nav aside li.create {
  margin-top: 0.5rem;
}

nav aside li.create a {
  font-size:1rem;
  font-weight: 500;
}

nav aside a {
  color:#333;
  text-decoration: none;
}

.ico.ico-plus {
  border-radius: 5px;
  padding:5px;
  background: #ddd;
  display: inline-block;
  font-style: normal;
}

.page-enter-active, .page-leave-active {
  transition: opacity .3s, transform .3s;
}
.page-enter, .page-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>

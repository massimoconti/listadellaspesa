import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store.js'

// plugins
import OnlineIndicator from './online.js'
// component
import App from './App.vue'
import ListIndex from './components/ListIndex.vue'
import ListNew from './components/ListNew.vue'
import ListSettings from './components/ListSettings.vue'
import List from './components/List.vue'
import ListContextMenu from './components/ListContextMenu.vue'
// service worker
import './registerServiceWorker'
// vuetify
import './vuetify'

Vue.use(VueRouter)
Vue.use(OnlineIndicator)

Vue.config.productionTip = false;


const router = new VueRouter({
  routes: [
    { name: 'list_index', path: '/', component: ListIndex },
    { name: 'list_new', path: '/list/new', component: ListNew },
    { name: 'list_settings', path: '/list/settings/:id', component: ListSettings },
    { name: 'list_detail', path: '/list/:id', components: { default: List, header_icons: ListContextMenu } },
  ]
});
router.beforeEach(function(from, to, next){
  store.dispatch('closeDrawer');
  next();
});

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.commit('initialiseStore');
  }
}).$mount('#app')

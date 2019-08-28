import Vue from 'vue'
import VueRouter from 'vue-router'

// plugins
import {} from '@/plugins/online'
import {} from '@/plugins/vuetify'
import i18n from '@/plugins/i18n';
import store from '@/plugins/store.js'

// component
import App from './App.vue'
import NotFound from './components/NotFound.vue'
import ListIndex from './components/ListIndex.vue'
import ListNew from './components/ListNew.vue'
import ListSettings from './components/ListSettings.vue'
import List from './components/List.vue'
import ListContextMenu from './components/ListContextMenu.vue'

// service worker
import './registerServiceWorker'

Vue.use(VueRouter)

Vue.config.productionTip = false;

const router = new VueRouter({
  routes: [
    { name: 'index', path: '/', redirect: to => {
      if (1 === store.state.lists.length){
        var first_id = Object.keys(store.state.lists.lists)[0];
        return { name: 'list_detail', params: { id: first_id } };
      }

      return { name: 'list_index' };
    }},
    { name: 'list_index', path: '/dashboard', component: ListIndex },
    { name: 'list_new', path: '/list/new', component: ListNew },
    { name: 'list_settings', path: '/list/settings/:id', component: ListSettings },
    { name: 'list_detail', path: '/list/:id', components: { default: List, header_icons: ListContextMenu } },
    { name: 'not-found', path: '*', component: NotFound },
  ]
});

router.beforeEach(function(from, to, next){
  store.dispatch('closeDrawer');
  next();
});

router.afterEach(( to, from ) => {
  gtag('config', 'UA-140415285-1', {'page_path': to.path});
});

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.commit('initialiseStore');
  }
}).$mount('#app')

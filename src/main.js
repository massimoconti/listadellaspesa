import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
// plugins
import OnlineIndicator from './plugins/online.js'
// component
import App from './components/App.vue'
import ListIndex from './components/ListIndex.vue'
import ListNew from './components/ListNew.vue'
import ListSettings from './components/ListSettings.vue'
import List from './components/List.vue'
import ListContextMenu from './components/ListContextMenu.vue'
// service worker
import './registerServiceWorker'


Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(OnlineIndicator)

Vue.config.productionTip = false

const STORAGE_LISTS_KEY = 'listadellaspesa-v1-lists';

const store = new Vuex.Store({
  state: {
    title: 'Lista della spesa',
    lists: [],
    nav_open: false,
    notification: '',
    list_action: ''
  },
  mutations: {
    initialiseStore(state){
			if (localStorage.getItem(STORAGE_LISTS_KEY)) {
				state.lists = JSON.parse(localStorage.getItem(STORAGE_LISTS_KEY));
			} else {
        this.commit({
          type: 'createList',
          name: 'Lista della spesa'
        });
      }
		},
    updateTitle(state, payload){
      state.title = payload.title;
    },
    updateListName(state, payload){
      state.lists[payload.id].name = payload.name;
    },
    updateListItems(state, payload){
      state.lists[payload.id].items = payload.list_items;
    },
    pushToList(state, payload){
      state.lists[payload.id].items.push({
        name: payload.item,
        taken: false
      });
    },
    deleteItem(state, payload){
      state.lists[payload.id].items.splice(payload.item_key, 1);
    },
    clearItems(state, payload){
      state.lists[payload.id].items = [];
    },
    toggleItemTaken(state, payload){
      state.lists[payload.id].items[payload.item_key].taken = !state.lists[payload.id].items[payload.item_key].taken;
    },
    createList(state, payload){
      state.lists.push({name:payload.name, items: []});
    },
    deleteList(state, payload){
      state.lists.splice(payload.id, 1);
    },
    toggleNavOpen(state, payload){
      state.nav_open = payload.open;
    },
    notify(state, payload){
      state.notification = payload.notification;
    },
    updateListAction(state, payload){
      state.list_action = payload.action;
    }
  },
  actions: {
    openNav(){
      this.commit({
        type: 'toggleNavOpen',
        open: true
      })
    },
    closeNav(){
      if (this.state.nav_open){
        this.commit({
          type: 'toggleNavOpen',
          open: false
        });
      }
    }
  }
});
// Subscribe to store updates
store.subscribe((mutation, state) => {
	localStorage.setItem(STORAGE_LISTS_KEY, JSON.stringify(state.lists));
});


const router = new VueRouter({
  routes: [
    { name: 'list_index', path: '/', component: ListIndex },
    { name: 'list_new', path: '/list/new', component: ListNew },
    { name: 'list_settings', path: '/list/settings/:id', component: ListSettings },
    { name: 'list_detail', path: '/list/:id', components: { default: List, header_icons: ListContextMenu } },
  ]
});
router.beforeEach(function(from, to, next){
  store.dispatch('closeNav');
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

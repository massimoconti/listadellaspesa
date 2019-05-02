import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const STORAGE_LISTS_KEY = 'listadellaspesa-v1-lists';

const store = new Vuex.Store({
  state: {
    title: 'Lista della spesa',
    lists: [],
    drawer: null,
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
    updateDrawer(state, payload){
      state.drawer = payload.drawer;
    },
    notify(state, payload){
      state.notification = payload.notification;
    },
    updateListAction(state, payload){
      state.list_action = payload.action;
    }
  },
  actions: {
    openDrawer(){
      this.commit({
        type: 'updateDrawer',
        drawer: true
      })
    },
    closeDrawer(){
      if (this.state.drawer){
        this.commit({
          type: 'updateDrawer',
          drawer: false
        });
      }
    },
    toggleDrawer(){
      if (this.state.drawer)
        this.dispatch('closeDrawer')
      else
        this.dispatch('openDrawer')
    }
  }
});
// Subscribe to store updates
store.subscribe((mutation, state) => {
  localStorage.setItem(STORAGE_LISTS_KEY, JSON.stringify(state.lists));
});

export default store;

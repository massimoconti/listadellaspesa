import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '@/plugins/i18n'

Vue.use(Vuex)

const STORAGE_LISTS_KEY = 'listadellaspesa-v1-lists';
const STORAGE_USAGE_KEY = 'listadellaspesa-v1-usg';

const store = new Vuex.Store({
  state: {
    title: '',
    lists: [],
    usage: {},
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
          name: i18n.t('name')
        });
      }

      // usage stats
      if (localStorage.getItem(STORAGE_USAGE_KEY))
        state.usage = JSON.parse(localStorage.getItem(STORAGE_USAGE_KEY));

      this.commit({
        type: 'recordUsage'
      });
		},
    updateTitle(state, payload){
      state.title = payload.title;
      document.title = payload.title;
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
    editItem(state, payload){
      state.lists[payload.id].items[payload.item_key].name = payload.name;
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
    },
    recordUsage(state, payload){
      // first usage ts
      state.usage.usg_ts_frst = state.usage.usg_ts_frst || Date.now();
      // last usage ts
      state.usage.usg_ts_last = Date.now();
    },
    recordCompletedList(state, payload){
      // totale completed list
      state.usage.cmpltd_tot = state.usage.cmpltd_tot || 0;
      state.usage.cmpltd_tot++;
      // last completed list ts
      state.usage.cmpltd_ts_lst = Date.now();
      // first completed list ts
      state.usage.cmpltd_ts_frst = state.usage.cmpltd_ts_frst || Date.now();
    },
    recordRateModalShow(state, payload){
      state.usage.ratemdl_ts = Date.now();
      state.usage.ratemdl_n = state.usage.ratemdl_n ? state.usage.ratemdl_n+1 : 1;
    },
    recordRateModalAccept(state, payload){
      state.usage.ratemdl_accept_ts = Date.now();
    },
    recordRateModalDismiss(state, payload){
      state.usage.ratemdl_dismiss_ts = Date.now();
      state.usage.ratemdl_dismiss_n = state.usage.ratemdl_dismiss_n ? state.usage.ratemdl_dismiss_n+1 : 1;
    },
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
  localStorage.setItem(STORAGE_USAGE_KEY, JSON.stringify(state.usage));
});

export default store;

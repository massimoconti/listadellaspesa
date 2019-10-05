const STORAGE_LISTS_KEY = 'listadellaspesa-v1-lists';
const STORAGE_USAGE_KEY = 'listadellaspesa-v1-usg';

import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '@/plugins/i18n'

async function loadFirestore(){
  const firebase = await import(/* webpackChunkName: "firebase" */ 'firebase/app')
  await import(/* webpackChunkName: "firebase" */ 'firebase/firestore')
  await import(/* webpackChunkName: "firebase" */ 'firebase/auth')

  if (process.env.NODE_ENV === 'production') {
    firebase.initializeApp({
      apiKey: "AIzaSyCv5LYgZq3Hhi_MdcWZ0LUxH-ZJSlVxbG0",
      authDomain: "listadellaspesa-v2.firebaseapp.com",
      databaseURL: "https://listadellaspesa-v2.firebaseio.com",
      projectId: "listadellaspesa-v2",
      storageBucket: "listadellaspesa-v2.appspot.com",
      messagingSenderId: "1027938358578",
      appId: "1:1027938358578:web:38e6bbfa8ca19553c0b32b"
    });
  } else {
    // SANBOX
    firebase.initializeApp({
      apiKey: "AIzaSyCDyavD9wYdnOoiW7eDYbH2cwr-cZx9Ia8",
      authDomain: "listadellaspesa-sandbox.firebaseapp.com",
      databaseURL: "https://listadellaspesa-sandbox.firebaseio.com",
      projectId: "listadellaspesa-sandbox",
      storageBucket: "",
      messagingSenderId: "440738185327",
      appId: "1:440738185327:web:e945aad53e9eda38f8cd9a",
      measurementId: "G-BPSWZ0V9Z9"
    });
  }

  firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    console.debug(error.code, error.message);
  });

  firebase.auth().onAuthStateChanged(function(user){
    // User is signed in.
    store.commit({
      type: 'stateChangeUser',
      user: user,
    });
  });

  return firebase.firestore();
}

const firestoreHasLoaded = loadFirestore()

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    title: '',
    lists: [],
    usage: {},
    drawer: null,
    notification: '',
    list_action: '',
    user: {}
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
    stateChangeUser(state, payload){
      state.user = payload.user;
      /*
      if (state.user.uid){
        firestore.collection("collection-lists").doc(state.user.uid)
          .onSnapshot(doc => {
            if (doc.data() && doc.data().lists){
              this.state.lists = doc.data().lists;
            }
          });
      }*/
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

  if (state.user && state.user.uid){
    var uid = state.user.uid;

    firestoreHasLoaded.then(firestore => {
      firestore.collection("collection-usages").doc(uid).set(state.usage);
      firestore.collection("collection-lists").doc(uid).set({lists: state.lists});
    });
  }
});

export default store;

import Vue from 'vue'

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";
import "firebase/messaging";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCv5LYgZq3Hhi_MdcWZ0LUxH-ZJSlVxbG0",
  authDomain: "listadellaspesa-v2.firebaseapp.com",
  databaseURL: "https://listadellaspesa-v2.firebaseio.com",
  projectId: "listadellaspesa-v2",
  storageBucket: "listadellaspesa-v2.appspot.com",
  messagingSenderId: "1027938358578",
  appId: "1:1027938358578:web:38e6bbfa8ca19553c0b32b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.usePublicVapidKey('BFnGJkwV5s4TUIWbVRk8c1E-uyxk49c8YFFD0LRpoDY7607eyLGwfyAxGI8B-ZMkfqanKQ8eC3uR0pEglQfjUQc');

messaging.onTokenRefresh(function(payload){
  console.log('onTokenRefresh: ',payload);
});

messaging.onMessage(function(payload){
  console.log('onMessage: ',payload);
});

export default {
  beforeCreate: function(){
    messaging.getToken().then((currentToken) => {
      if (currentToken) {
        this.pushNotificationToken = currentToken;
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
  },
  data: function(){
    return {
      pushNotificationToken: null,
      pushNotificationSupported: firebase.messaging.isSupported(), // indica se push notification sono supported o meno
      pushNotificationFreezed: false, // indica se il trigger dell'iscrizione è congelato o meno (cioè se deve essere cliccabile o meno)
    }
  },
  computed: {
    // Stato iscrizione alle push notifications
    pushNotificationEnabled: function(){
      return !!this.pushNotificationToken;
    }
  },
  methods: {
    pushNotificationToggle: function(){
      if (this.pushNotificationFreezed)
        return;

      this.pushNotificationFreezed = true;

      if (this.pushNotificationEnabled) {
        this.pushNotificationUnsubscribe();
      } else {
        this.pushNotificationSubscribe();
      }
    },
    pushNotificationUnsubscribe: function(){
      messaging.deleteToken(this.pushNotificationToken).then(() => {
        this.pushNotificationToken = null;
      }).catch((e) => {
        console.debug(e)
      }).finally(() => {
        this.pushNotificationFreezed = false;
      });
    },
    pushNotificationSubscribe: function(){
      messaging.requestPermission().then(() => {
        return messaging.getToken();
      }).then((token) => {
        console.debug('new token '+token)
        this.pushNotificationToken = token;
      }).finally(() => {
        this.pushNotificationFreezed = false;
      });
    },
  }
};

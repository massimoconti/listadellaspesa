import Vue from 'vue'

<<<<<<< Updated upstream
var API_KEY = '';
=======
var API_KEY = 'AAAA71XmlTI:APA91bHUpe834ySXI4NGZDxLhmXanyHlCRaHrhSDWe2UsRanxeMsUhzQ-6ebrxM7UYKvWoqUmdgKj0F_KKmorIVSTZv2m7xKMVGu6GxWG1FiqCFs34F037l14jO2DMnc2gelbuOCJVSW';
>>>>>>> Stashed changes
var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';

// @see https://github.com/GoogleChrome/samples/blob/0927d4d111ae167445c54b947dcfa0b09433ef09/push-messaging-and-notifications/main.js#L30

<<<<<<< Updated upstream
export default {
  data: function(){
    return {
      supported: false, // indica se push notification sono supported o meno
      enabled: false,  // stato di iscrizione alle push notification
      freezed: false, // indica se il trigger dell'iscrizione è congelato o meno (cioè se deve essere cliccabile o meno)
    }
  },
  methods: {
    pushNotificationInitialize: function(){
      // Are Notifications supported in the service worker?
      if (!('showNotification' in ServiceWorkerRegistration.prototype))
        return;

      // Check the current Notification permission.
      // If its denied, it's a permanent block until the
      // user changes the permission
      if (Notification.permission === 'denied')
        return;

      // Check if push messaging is supported
      if (!('PushManager' in window))
        return;

      // We need the service worker registration to check for a subscription
      navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager.getSubscription()
          .then(function(subscription) {
            // Enable any UI which subscribes / unsubscribes from
            // push messages.
            this.freezed = false;
            this.supported = true;

            if (!subscription) {
              // We aren’t subscribed to push, so set UI to allow the user to enable push
              return;
            }

            // Keep your server in sync with the latest subscription
            this.sendSubscriptionToServer(subscription);

            // Set your UI to show they have subscribed for push messages
            this.enabled = true;

          }.bind(this))
          .catch(function(err) {

          });
      });
    },
    pushNotificationToggle: function(){
      if (this.enabled) {
=======
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
>>>>>>> Stashed changes
        this.pushNotificationUnsubscribe();
      } else {
        this.pushNotificationSubscribe();
      }
    },
    pushNotificationUnsubscribe: function(){
<<<<<<< Updated upstream
      this.freezed = true;

      navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // To unsubscribe from push messaging, you need get the
        // subcription object, which you can call unsubscribe() on.
        serviceWorkerRegistration.pushManager.getSubscription().then(
          function(pushSubscription){
            // Check we have a subscription to unsubscribe
            if (!pushSubscription) {
              // No subscription object, so set the state
              // to allow the user to subscribe to push
              this.enabled = false;
              this.freezed = false;
              return;
            }

            // TODO: Make a request to your server to remove
            // the users data from your data store so you
            // don't attempt to send them push messages anymore

            // We have a subcription, so call unsubscribe on it
            pushSubscription.unsubscribe().then(function() {
              pushButton.freezed = false;
              this.enabled = false;
            }.bind(this)).catch(function(e) {
              // We failed to unsubscribe, this can lead to
              // an unusual state, so may be best to remove
              // the subscription id from your data store and
              // inform the user that you disabled push
              this.freezed = false;
            }.bind(this));
          }.bind(this)).catch(function(e) {

          });
      });
    },
    pushNotificationSubscribe: function(){
      this.freezed = true;

      navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
          .then(function(subscription) {
            // The subscription was successful
            this.enabled = true;
            this.freezed = false;

            // TODO: Send the subscription subscription.endpoint
            // to your server and save it to send a push message
            // at a later date
            return this.sendSubscriptionToServer(subscription);
          }.bind(this))
          .catch(function(e) {
            if (Notification.permission === 'denied') {
              // The user denied the notification permission which
              // means we failed to subscribe and the user will need
              // to manually change the notification permission to
              // subscribe to push messages
              this.freezed = true;
            } else {
              // A problem occurred with the subscription, this can
              // often be down to an issue or lack of the gcm_sender_id
              // and / or gcm_user_visible_only
              this.freezed = false;
            }
          }.bind(this));
      }.bind(this));
    },
    endpointWorkaround: function(pushSubscription) {
=======
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
    endpointWorkaround: function(pushSubscription){
>>>>>>> Stashed changes
      // This method handles the removal of subscriptionId, in Chrome 44 by concatenating the subscription Id, to the subscription endpoint
      // Make sure we only mess with GCM
      if (pushSubscription.endpoint.indexOf(GCM_ENDPOINT) !== 0) {
        return pushSubscription.endpoint;
      }

      var mergedEndpoint = pushSubscription.endpoint;
      // Chrome 42 + 43 will not have the subscriptionId attached
      // to the endpoint.
      if (pushSubscription.subscriptionId &&
        pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
        // Handle version 42 where you have separate subId and Endpoint
        mergedEndpoint = pushSubscription.endpoint + '/' +
          pushSubscription.subscriptionId;
      }
      return mergedEndpoint;
    },
<<<<<<< Updated upstream
    sendSubscriptionToServer: function(subscription) {
=======
    sendSubscriptionToServer: function(subscription){
>>>>>>> Stashed changes
      // TODO: Send the subscription.endpoint
      // to your server and save it to send a
      // push message at a later date
      //
      // For compatibly of Chrome 43, get the endpoint via
      // endpointWorkaround(subscription)
      console.log('TODO: Implement sendSubscriptionToServer()');

      var mergedEndpoint = this.endpointWorkaround(subscription);
<<<<<<< Updated upstream
=======
      console.debug(mergedEndpoint);
>>>>>>> Stashed changes
    }
  }
};

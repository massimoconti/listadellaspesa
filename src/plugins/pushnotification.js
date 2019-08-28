import Vue from 'vue'

var API_KEY = '';
var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';

// @see https://github.com/GoogleChrome/samples/blob/0927d4d111ae167445c54b947dcfa0b09433ef09/push-messaging-and-notifications/main.js#L30

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
        this.pushNotificationUnsubscribe();
      } else {
        this.pushNotificationSubscribe();
      }
    },
    pushNotificationUnsubscribe: function(){
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
    sendSubscriptionToServer: function(subscription) {
      // TODO: Send the subscription.endpoint
      // to your server and save it to send a
      // push message at a later date
      //
      // For compatibly of Chrome 43, get the endpoint via
      // endpointWorkaround(subscription)
      console.log('TODO: Implement sendSubscriptionToServer()');

      var mergedEndpoint = this.endpointWorkaround(subscription);
    }
  }
};

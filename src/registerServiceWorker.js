/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {})
} else {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker-noop.js')
      .then(function (registration) {
        // Registration was successful``
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      })
    ;
  }
}

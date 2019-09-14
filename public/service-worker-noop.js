// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

self.addEventListener('install', event => {
  console.log('sw installeds')
});

self.addEventListener('message', function(event){
  var data = JSON.parse(event.data);
  console.debug("SW Received Message: ", data);

});

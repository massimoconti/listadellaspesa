import Vue from 'vue'

const WhatsappIndicator = {
  install (Vue, options = {}) {
    const vm = new Vue({
      data: {
        whatsappInstalled: false
      }
    });

    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', 'whatsapp://send?text=test');
    xhr.onreadystatechange = function () {
      var DONE = 4; // readyState 4 means the request is done.
      var OK = 200; // status 200 is a successful return.
      if (xhr.readyState === DONE && xhr.status === OK) {
          vm.$data.whatsappInstalled = true
      } else {
          console.debug('Whatsapp not suppoerted')
      }
    };
    xhr.send()

    Vue.mixin({
      computed: {
        isWhatsappInstalled() {
          return vm.$data.whatsappInstalled;
        }
      }
    });
  }
};


Vue.use(WhatsappIndicator);

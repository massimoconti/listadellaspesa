import Vue from 'vue'

const WhatsappIndicator = {
  install (Vue, options = {}) {
    const vm = new Vue({
      data: {
        whatsappInstalled: true
      }
    });

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

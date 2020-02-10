import Vue from 'vue'

// plugins
import {} from '@/plugins/online'
import {} from '@/plugins/whatsapp'
import vuetify from '@/plugins/vuetify'
import i18n from '@/plugins/i18n';
import store from '@/plugins/store'
import router from '@/plugins/router'
// app component
import App from '@/App.vue'
// service worker
import '@/register-service-worker'
// gtag
import '@/google-analytics'

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App),
  beforeCreate() {
    this.$store.commit('initialiseStore');
  }
}).$mount('#app')

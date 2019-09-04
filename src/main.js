import Vue from 'vue'

// plugins
import {} from '@/plugins/online'
import {} from '@/plugins/vuetify'
import i18n from '@/plugins/i18n';
import store from '@/plugins/store'
import router from '@/plugins/router'

// component
import App from '@/App.vue'

// service worker
import '@/registerServiceWorker'

Vue.config.productionTip = false;

// INJECTION ANALYTICS
const s = document.createElement('script');
s.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=' + process.env.VUE_APP_GTAG_UA)
s.async = true;
document.head.appendChild(s);

window.dataLayer = window.dataLayer || [];
window.gtag = function(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', process.env.VUE_APP_GTAG_UA);

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.commit('initialiseStore');
  }
}).$mount('#app')

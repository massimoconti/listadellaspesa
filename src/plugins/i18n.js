import Vue from 'vue';
import VueI18n from 'vue-i18n';

import it from '@/lang/it.js'
import en from '@/lang/en.js'
import es from '@/lang/es.js'

Vue.use(VueI18n);

const messages = {
  it,
  en,
  es
};

const i18n = new VueI18n({
  locale: navigator.language.split('-')[0], // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});

export default i18n

import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/plugins/store'

import NotFound from '@/components/NotFound.vue'
import Index from '@/components/Index.vue'
import Dashboard from '@/components/Dashboard.vue'
import DashboardPlusSign from '@/components/DashboardPlusSign.vue'
import ListNew from '@/components/ListNew.vue'
import ListSettings from '@/components/ListSettings.vue'
import List from '@/components/List.vue'
import ListContextMenu from '@/components/ListContextMenu.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { name: 'index', path: '/', component: Index },
    { name: 'list_index', path: '/dashboard', components: { default: Dashboard, footer: DashboardPlusSign }},
    { name: 'list_new', path: '/list/new', component: ListNew },
    { name: 'list_settings', path: '/list/settings/:id', component: ListSettings },
    { name: 'list_detail', path: '/list/:id', components: { default: List, header_icons: ListContextMenu }},
    { name: 'not-found', path: '*', component: NotFound },
  ]
});

router.beforeEach(function(from, to, next){
  store.dispatch('closeDrawer');
  next();
});

router.afterEach(( to, from ) => {
  gtag('config', 'UA-140415285-1', {'page_path': to.path});
});

export default router;

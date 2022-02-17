import Vue from 'vue'
import App from './App.vue'
import router from './router'


import TreeTable from 'vue-table-with-tree-grid'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './assets/css/global.css'
import './assets/fonts/iconfont.css'



Vue.use(ElementUI);
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

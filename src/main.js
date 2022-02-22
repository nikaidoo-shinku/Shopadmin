import Vue from 'vue'
import App from './App.vue'
import router from './router'


import TreeTable from 'vue-table-with-tree-grid'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor';
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import './assets/css/global.css'
import './assets/fonts/iconfont.css'



Vue.use(ElementUI);
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

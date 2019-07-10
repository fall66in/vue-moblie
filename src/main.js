import Vue from 'vue'
import Vant from '../node_modules/vant'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'

// 简单粗暴全引进来，方便使用
import 'vant/lib/index.css'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

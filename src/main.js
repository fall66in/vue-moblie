import Vue from 'vue'
import Vant, { Lazyload } from '../node_modules/vant'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import VeeValidate, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import 'vant/lib/index.css'
import checkLogin from './utils/check-login'
import AppTabbar from './components/tabbar-layout'

// 加载时间过滤处理的效果
import relativeTime from './filters/relativeTime-time'

// 挂载顶部列表
Vue.component('tabbar-layout', AppTabbar)

// 注册vant的图片懒加载自定义指令
Vue.use(Lazyload)
// 注册一个全局过滤器：处理相对时间
Vue.filter('relativeTime', relativeTime)

Vue.use(VeeValidate, {
  events: '' // 禁用默认事件验证
})

// 将检查登录状态挂载到vue原型对象上，这样的话任何组件就都可以使用了
Vue.prototype.$checkLogin = checkLogin

Validator.localize('zh_CN', zhCN)
// 简单粗暴全引进来，方便使用

Vue.use(Vant)

Vue.config.productionTip = false

// 让加载文章列表缓存一下
Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

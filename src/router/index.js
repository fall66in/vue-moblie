import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // name: 'home',
      path: '/',
      // component: () => import('@/views/home')
      component: () => import('@/views/tabbar-layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        }
      ]
    },
    {
      name: 'login', // 登录页面
      path: '/login',
      component: () => import('@/views/login')
    },
    {
      name: 'search', // 搜索页面
      path: '/search',
      component: () => import('@/views/search')
    },
    {
      name: 'search-result', // 搜索结果页面
      path: '/search/:q',
      component: () => import('@/views/search-result')
    },
    {
      name: 'article', // 文章页面
      path: '/article/:articleId',
      component: () => import('@/views/article')
    },
    {
      name: 'my', // 我的
      path: '/my',
      component: () => import('@/views/my')
    }
  ]
})

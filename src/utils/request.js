import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'
import router from '@/router'

const refreshTokenRequest = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// axios.create用于创建一个axios实例，该实例和axios的功能一模一样
// 说白了就是克隆一个axios
// 为什么要这么做：我们可以用于多个不同的请求函数，而他们的配置可能是不一样的
// 例如有些项目可能会涉及到使用不同的接口路径

const request = axios.create({
  // baseURL: 'http://toutiao.course.itcast.cn'
  baseURL: 'http://ttapi.research.itcast.cn' // 线上接口地址
})

// 处理后端返回数据中数字超出JavaScript安全整数范围
request.defaults.transformResponse = [function (data) {
  try {
    // 如果是json格式字符串，那就转换并返回给后续使用
    return JSONbig.parse(data)
  } catch (err) {
    // 报错就意味着data不是json格式字符串，这里就直接原样返回给后续使用
    return data
  }
}]
// axios发送请求的拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 如果已登录，则为请求接口统一添加用户token
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Do something with response data

  // 如果响应结果对象中有data，则直接返回这个data数据
  // 如果响应结果对象中没有data，则不作任何处理，直接原样返回这个数据
  return response.data.data || response.data
}, async error => {
  console.dir(error)
  // Do something with response error
  // 如果状态码是401
  if (error.response && error.response.status === 401) {
    // 如果没有refresh——token，则直接跳转登录页
    const { user } = store.state

    // 如果user都没有，则这就添加登录页
    if (!user) {
      return router.push({ name: 'login' })
    }

    // 如果有user，则请求刷新token
    // 注意：这个请求不要使用request发送，使用一个没有任何副作用的请求对象去发送
    try {
      const res = await refreshTokenRequest({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })

      // 刷新用户token成功了
      // 将新的token保存到store中
      store.commit('setUser', {
        token: res.data.data.token, // 重新获取的访问 token
        refresh_token: user.refresh_token // 原来的刷新 token
      })

      // // 把原来因为 401 失败的那个请求给继续发出去
      return request(error.config)
    } catch (err) {
      // 刷新token失败了
      return router.push({ name: 'login' })
    }
  }
  return Promise.reject(error)
})

export default request

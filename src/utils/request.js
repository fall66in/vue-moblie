import axios from 'axios'

// axios.create用于创建一个axios实例，该实例和axios的功能一模一样
// 说白了就是克隆一个axios
// 为什么要这么做：我们可以用于多个不同的请求函数，而他们的配置可能是不一样的
// 例如有些项目可能会涉及到使用不同的接口路径

const request = axios.create({
  baseURL: 'http://toutiao.course.itcast.cn'
})

// axios发送请求的拦截器
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default request

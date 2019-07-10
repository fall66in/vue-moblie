const { sep } = require('path')

module.exports = ({ file }) => {
  const rootValue = file.dirname.indexOf(`node_modules${sep}vant`) !== -1
    ? 37.5 // vant 转换的基准值
    : 75 // 我们的设计稿转换的基准值

  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue,
        propList: ['*']
      }
    }
  }
}

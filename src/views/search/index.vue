<template>
    <div>
        <!-- show-action 是否在搜索框右侧显示取消按钮 -->
        <!-- search 事件在用户点击键盘上的 搜索/回车 按钮触发 -->
        <van-search
        placeholder="请输入搜索关键词"
        v-model="searchText"
        show-action
        @search="handleSearch(searchText)"/>

        <!-- 联想建议表 -->
        <van-cell-group
        v-if="suggestions.length && searchText.length"
        >
            <!-- <van-cell title="单元格" icon="search" />
            <van-cell title="单元格" icon="search" />
            <van-cell title="单元格" icon="search" />
            <van-cell title="单元格" icon="search" />
            <van-cell title="单元格" icon="search" />
            <van-cell title="单元格" icon="search" /> -->
            <van-cell
            v-for="item in suggestions"
            :key="item"
            :title="item"
            icon="search"
            @click="handleSearch(item)">
            <!-- {{}}无法输出HTML字符内容 -->
            <!-- v-html指令才会解析字符串中的HTML -->
            <!-- 过滤器只能用在{{}}和v-bind中 -->
               <div slot="title" v-html="hightLight(item, searchText)"></div>
            </van-cell>
        </van-cell-group>

        <!-- 历史记录 -->
        <van-cell-group v-else>
          <van-cell title="历史记录">
            <van-icon
            v-show="!isDeleteShow"
            slot="right-icon"
            name="delete"
            style="line-height: inherit;"
            @click="isDeleteShow = true"/>
            <div v-show="isDeleteShow">
              <span style="margin-right:10px;"
              @click="serachHistories = []">全部删除</span>
              <span @click="isDeleteShow = false">完成</span>
            </div>
          </van-cell>
          <van-cell
          v-for="(item, index) in serachHistories"
          :key="item"
          :title="item">
          <van-icon v-show="isDeleteShow"
          slot="right-icon"
          name="close"
          style="line-height: inherit;"
          @click="serachHistories.splice(index, 1)"/>
          </van-cell>
        </van-cell-group>
        <!-- 底部导航 -->
        <tabbar-layout />
        <!-- 底部导航 -->
    </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'Search',
  data () {
    return {
      searchText: '', // 搜索输入的文本
      suggestions: [], // 联想建议
      serachHistories: JSON.parse(window.localStorage.getItem('serach-histories')), // 搜索历史记录
      isDeleteShow: false
    }
  },
  watch: {
    // debounce 接受两个参数
    // 第一参数：执行你的业务逻辑的参数函数
    // 第二参数：防抖函数
    // 当你同一时间用频率过快的时候，只有停下来经过指定的时间才会来调用
    // 防抖函数：因为你每在搜索框输入一个值，浏览器就会请求一次，所有用防抖函数来规定一个时间来调用
    searchText: debounce(async function (newVal) {
      // console.log(1)
      newVal = newVal.trim() // 去除首尾空格

      if (!newVal) {
        return
      }

      // 如果数据为空，则什么都不做
      const data = await getSuggestion(newVal)
      console.log(data)
      this.suggestions = data.options
    }, 500),

    serachHistories: {
      hendler () {
        // 保存搜索历史记录
        window.localStorage.setItem(
          'serach-histories',
          JSON.stringify([...new Set(this.serachHistories)])
        )
      },
      deep: true // 建议引用类型数据都配置为深度监视
    }
  },
  deactivated () {
    this.$destroy()
  },
  methods: {
    // 关键字高亮
    hightLight (text, keyword) {
      return text.toLowerCase().split(keyword)
        .join(`<span style="color:red;">${keyword}</span>`)
    },
    // 触发搜索按钮,跳转到搜索结果的页面
    handleSearch (q) {
      if (!q.length) {
        return
      }

      // this.serachHistories.push(q)
      // // 保存搜索历史记录
      // window.localStorage.setItem(
      //   'serach-histories',
      //   JSON.stringify([...new set(this.serachHistories)])
      // )
      // this.serachHistories.unshift(q)
      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })
      // this.$router.push('/search/' + q)
      // this.$router.push(`/search/${q}`)
    }
  }
}
</script>

<style lang="less" scoped>

</style>

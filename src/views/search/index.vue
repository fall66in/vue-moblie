<template>
    <div>
        <!-- show-action 是否在搜索框右侧显示取消按钮 -->
        <van-search
        placeholder="请输入搜索关键词"
        v-model="searchText"
        show-action/>

        <!-- 联想建议表 -->
        <van-cell-group>
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
            icon="search" />
        </van-cell-group>

        <!-- 历史记录 -->
        <!-- <van-cell-group>
          <van-cell title="历史记录">
            <v-icon
            slot="right-icon"
            name="delete"
            style="line-height: inherit;">
            </v-icon>
          </van-cell>
        </van-cell-group> -->
    </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'Search',
  data () {
    return {
      searchText: '',
      suggestions: []
    }
  },
  watch: {
    // debounce 接受两个参数
    // 第一参数：执行你的业务逻辑的参数函数
    // 第二参数：防抖函数
    // 当你同一时间用频率过快的时候，只有停下来经过指定的时间才会来调用
    // 防抖函数：因为你每在搜索框输入一个值，浏览器就会请求一次，所有用防抖函数来规定一个时间来调用
    searchText: debounce(async function (newVal)  {
    //   console.log(1)
      newVal = newVal.trim() // 去除首尾空格

      if (!newVal) {
        return
      }

      // 如果数据为空，则什么都不做
      const data = await getSuggestion(newVal)
      console.log(data)
      this.suggestions = data.options
    }, 500)
  }
}
</script>

<style lang="less" scoped>

</style>


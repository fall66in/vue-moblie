<template>
    <!-- <div>搜索结果页面 {{ $route.params.q}}</div> -->
    <!-- @click-left返回上一个页面 -->
    <div class="search-result">
      <!-- 顶部导航 -->
      <van-nav-bar
        class="header"
        title="搜索结果"
        left-text="返回"
        left-arrow
        fixed
        @click-left="$router.back()"
      />
      <!-- 顶部导航 -->

      <!-- 文章列表 -->
      <van-list
        class="article-list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="item in articles"
          :key="item.art_id.toString()"
          :title="item.title"
        />
      </van-list>
      <!-- 文章列表 -->
    </div>
</template>

<script>
import { getSearch } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10,
      articles: []
    }
  },
  computed: {
    q () {
      return this.$route.params.q
    }
  },
  // watch () {
  //   // 这里有两个缓存
  //   // 一个是路由本身缓存
  //   // 当你从a路径导航到b路径的时候
  //   // 由于a路径和b路径使用的都是同一个组件，那么此时默认给你路由缓存
  //   // 一个是组件缓存
  //   // 生命周期不会重走，页面的切换会销毁重建
  //   // '$route' (to, from) {
  //   //   // 对路由变化作出响应...
  //   //   console.log('路由变化了')
  //   // }
  // },
  // 组件缓存的情况下，页面显示出来调用它
  activated () {
    this.loading = true
    this.onLoad()
  },
  // 组件缓存的情况下，页面隐藏调用它
  deactivated () {
    this.articles = []
    this.page
  },
  async created () {
    const data = await getSearch({
      q: this.$route.params.q,
      page: 1
    })
    console.log(data)
  },
  methods: {
    async onLoad() {
      await this.$sleep(800)

      const data = await this.getSearchResults()

      // 如果请求结果数组为空，则设置list组件已加载结束
      if (!data.results.length) {
        this.loading = false
        this.finished = true
        return
      }
      // 如果有数据的话，则将本次加载到的数据push到列表数组中
      this.articles.push(...data.results)
      // 数据加载完毕，更新当前页面为下一页，用于下一次加载更多
      this.page += 1
      // 结束当前加载的loading
      // list列表组件每次onload会自动将loading设置为true
      // 如果你不设置的话，它不会触发下一次的onload
      this.loading = false
    },
    getSearchResults () {
      return getSearch({
        page: this.page,
        perPage: this.perPage,
        q: this.q
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-result {
  .article-list {
    margin-top: 92px;
  }
}
.header {
  background: yellowgreen;
}
</style>

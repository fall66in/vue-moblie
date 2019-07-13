<template>
  <div>
    <div class="home">
      <!-- 导航栏 -->
      <van-nav-bar class="channel-top" title="首页" fixed/>
      <van-tabs class="channel-tabs" v-model="activeChannelIndex">
        <van-tab
        v-for="channelItem in channels"
        :key="channelItem.id"
        :title="channelItem.name">
         <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="channelItem.upPullLoading"
            :finished="channelItem.upPullFinished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="articleItem in channelItem.articles"
              :key="articleItem.art_id"
              :title="articleItem.title"
            />
         </van-list>
        </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'Home',
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: [] // 存储频道列表
    }
  },
  computed: {
    // 当前激活的频道
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    // 加载文章列表,什么时候加载文章列表呢？在onload里面
    async loadArticles () {
      // id重命名为channelId
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticles({
        channelId, // 当前激活频道id
        timestamp, // 当前频道下一页数据的时间戳
        withTop: 1 // 是否包含置顶数据
      })
      return data
    },
    async loadChannels () {
      const { user } = this.$store.state
      let channels = []

      if (user) {
      // 已登录
        const data = await getUserChannels()
        channels = data.channels
        console.log(data)
      } else {
        // 未登录

        // 如果有本地存储数据则使用本地存储中的频道列表
        const localChannels = JSON.parse(window.localStorage.getItem('channels'))
        if (localChannels) {
          channels = localChannels
        } else {
          // 如果没有本地存储频道数据则请求获取默认推荐频道列表
          const data = await getUserChannels()
          channels = data.channels
          // console.log(data.channels)
        }
      }
      // 修改channels，将这个数据结构修改为满足我们使用的需求
      channels.forEach(item => {
        item.aritcles = [] // 用来存储当前文字的列表
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新loading
        item.upPullLoading = false // 控制当前频道的上拉加载更多的loading状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })
      this.channels = channels
    },
    // 上拉加载更多
    async onLoad () {
      // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 500)
      // 降低服务器的压力，在800毫秒内加载
      await this.$sleep(800)

      let data = []
      data = await this.loadArticles()
      // console.log(data)
      // pre_timestamp 下一页页码
      // results 文章列表
      

      // 如果没有pre_temestamp并且数组是空的，则意味着没有数据
      if (!data.pre_timestamp && !data.results.length) {
        // 设置该频道数据已加载完毕，组件会自动给出提示，并且不再onload
        this.activeChannel.upPullFinished = true
        // 取消loading
        this.activeChannel.upPullLoading = false
        // 代码不再往后继续执行
        return
      }
      // 解决初始化的时候没有最新推荐数据的问题（没有最新数据，那就加上一次推荐数据）
      if (data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp

        // 加载下一页数据
        data = await this.loadArticles()
      }
      console.log(data)
      // 数据加载好以后，将pre_timestamp更新到当前频道的中用于加载下下页数据
      this.activeChannel.timestamp = data.pre_timestamp

      // 将文章数据更新到频道中（注意：是push追加，不是赋值）
      this.activeChannel.articles = data.results
      // this.activeChannel.articles.push(...data.results)

      // 数据加载完毕，取消上拉loading
      this.activeChannel.upPullLoading = false
    },
    // 下拉刷新，如果有新数据，则是重置列表数据
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
        this.count++
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.channel-top {
  background: blueviolet;
}
.channel-tabs {
  margin-bottom: 100px;
  margin-top: 100px;
}
.channel-tabs /deep/ .van-tabs_wrap {
  position: fixed;
  top: 92px;
}
.channel-tabs /deep/ .van-tabs_content {
  margin-top: 100px;
}
</style>

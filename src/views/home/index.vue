<template>
  <div>
    <div class="home">
      <!-- 导航栏 -->
      <van-nav-bar class="channel-top" title="首页" fixed/>
      <van-tabs class="channel-tabs" v-model="activeChannelIndex">
        <!-- tab标签
        nav-right 标题右侧内容
        title 自定义标签 -->
        <div slot="nav-right" class="wap-nav">
          <van-icon  name="wap-nav" @click="isChannelShow = true"/>
        </div>
        <van-tab
        v-for="channelItem in channels"
        :key="channelItem.id"
        :title="channelItem.name">
         <van-pull-refresh
         v-model="channelItem.downPullLoading"
         @refresh="onRefresh"
         :success-duration="1000"
         :success-text="channelItem.downPullSuccessText">
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
            >
            <div slot="label">
              <!-- 图片懒加载：设置lazy-load属性来开启图片懒加载，需要搭配 Lazyload 组件使用 -->
              <template v-if="articleItem.cover.type">
                 <van-grid :border="false" :column-num="3">
                    <van-grid-item v-for="(img, index) in articleItem.cover.images" :key="index">
                      <van-image :src="img" lazy-load />
                    </van-grid-item>
                  </van-grid>
              </template>
            </div>
            <p slot="label">
              <span>{{ articleItem.aut_name }}</span>&nbsp;
              <span>{{ articleItem.comm_count }}评论</span>&nbsp;
              <!-- <span>{{ relativeTime(articleItem.pubdate) }}</span> -->
              <span>{{ articleItem.pubdate | relativeTime }}</span>
            </p>
            <!-- icon图标:更多操作的点击按钮-->
            <div class="icon">
              <van-icon name="close" @click="handleShowMoreAction(articleItem)"/>
            </div>
            
            </van-cell>
         </van-list>
        </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
    <!-- 频道组件 -->
     <!--
      :value="isChannelShow"
      @input="isChannelShow = $event"
      .sync 修饰符会自动监听一个事件：
      @update:user-channels="channels = $event"
      简单来说，给 props 数组加 .sync 其实就是 v-model 的作用
      只不过一个组件只能有一个 v-model
     -->
    <HomeChannel
    v-model="isChannelShow"
    :user-channels.sync="channels"
    :active-index.sync="activeChannelIndex"/>
    <!-- 频道组件 -->

    <!-- 更多操作弹框 -->
    <van-dialog v-model="isMoreActionShow" :showConfirmButton="false">
      <!-- is-link是否展示右侧箭头并开启点击反馈 -->
      <van-cell-group v-if="!toggleRubbish">
        <van-cell title="不感兴趣" @click="handleDislike"/>
        <van-cell title="反馈垃圾内容" is-link @click="toggleRubbish = true"/>
        <van-cell title="投诉作者"/>
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="toggleRubbish = false"/>
        <van-cell title="标题夸张"/>
        <van-cell title="低俗色情"/>
        <van-cell title="错别字多" />
        <van-cell title="旧闻重复"/>
      </van-cell-group>
    </van-dialog>
    <!-- 更多操作弹框 -->
  </div>
</template>

<script>
// 加载请求频道接口
import { getUserChannels } from '@/api/channel'
// 加载请求文章接口
import { getArticles } from '@/api/article'
// 加载固定导航组件
import HomeChannel from './components/channel'
export default {
  name: 'HomeIndex',
  components: {
    HomeChannel
  },
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: [], // 存储频道列表
      isChannelShow: false, // 控制频道面板的显示状态
      isMoreActionShow: false, // 控制更多操作弹框面板
      toggleRubbish: false, // 控制反馈垃圾弹框内容的显示
      currentArticle: null // 存储当前操作更多的文章
    }
  },
  computed: {
    // 当前激活的频道
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  watch: {
    // 监视容器中的user用户
    // 记住：凡是能this.出来的成员都可以直接在这里监视
    // 由于路由缓存了，所以这里监视用户的登录状态，如果登录了，则加载用户频道列表
    async '$store.state.user' () {
      // 重新加载用户频道列表
      this.loadChannels()
      // 频道数据改变，重新加载当前激活频道的数据
      // 只需将上拉加载更多设置为true，他就好自动去调用onload请求函数
      this.activeChannel.upPullLoading = true
      await this.onLoad()
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

    // 加载频道列表
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
        item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
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
      // this.activeChannel.articles = data.results
      this.activeChannel.articles.push(...data.results)

      // 数据加载完毕，取消上拉loading
      this.activeChannel.upPullLoading = false
    },
    
    // 下拉刷新，如果有新数据，则是重置列表数据
    async onRefresh () {
      // setTimeout(() => {
      //   this.$toast('刷新成功')
      //   this.isLoading = false
      //   this.count++
      // }, 500)
      const { activeChannel } = this
      // 备份加载下一页数据的时间戳
      const timestamp = activeChannel.timestamp
      activeChannel.timestamp = Date.now()
      const data = await this.loadArticles()

      // 如果有最新数据，将数据更新到频道的文章列表中
      if (data.results.length) {
        // 将当前最新的推荐内容重置到频道文章中
        activeChannel.articles = data.results
        //  由于你重置了文章列表，那么当前数据中的pre_timestamp就是上拉加载更多的下一页数据的时间戳
        activeChannel.timestamp = data.pre_timestamp
        activeChannel.downPullSuccessText = '更新成功'

        //  当下拉刷新有数据比重置以后数据无法满足一屏，所以我们使用onload在多加载
        this.onLoad()
      } else {
        // 如果没有最新数据，提示已是最新内容
        activeChannel.downPullSuccessText = '已是最新数据'
      }
      // 下拉刷新结束，取消loading状态
      activeChannel.downPullLoading = false

      // 没有最新数据，将原来的用于请求下一页的时间戳恢复过来
      activeChannel.timestamp = timestamp
    },

    // 处理显示更多操作弹框面板
    handleShowMoreAction (item) {
      // 将点击操作更多的文章存储起来，用于后续使用
      this.currentArticle = item
      // 显示弹框
      this.isMoreActionShow = true
    },

    // 不感兴趣操作按钮
    async handleDislike () {
      // 拿到操作的文章 id
      // 请求完成操作
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
.channel-tabs  .wap-nav {
  position: sticky;
  right: 0;
  display:flex;
  align-items: center;
  background: #fff;
  opacity: .7;
}
.icon {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>

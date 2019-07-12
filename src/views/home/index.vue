<template>
    <div>
      <div class="home">
        <!-- 头部 -->
        <van-nav-bar class="channel-top" title="首页" fixed/>
        <!-- activeChannelIndex绑定当前激活的标签页，使用索引 -->
        <!-- 频道头部 -->
        <van-tabs class="channel-tabs" v-model="activeChannelIndex">
          <!-- sticky:是否使用粘性布局 -->
          <!-- offset-top 粘性布局下愈顶部的最小距离 -->
          <!-- <van-tab title="标签1" sticky :offset-top="70"> -->
          <van-tab
          v-for="channelItem in channels"
          :key="channelItem.id"
          :title="channelItem.name">
            <!-- 下拉刷新
            isLoading用来控制下拉刷新的loading状态
            下拉刷新的时候，他会自动将loading设置为true
            @refresh 当下拉刷新的时候会触发 -->
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
               <!-- 列表组件：主要提供上拉加载更多的功能
               loading用来控制加载中loading状态
               finished用来控制是否加载完毕
               @load加载更多的时候触发的一个时间，它自动会调用onload函数拿数据，以填充页面
                    它每次调用onload会自动将loading设置为true
                    我们需要在onload中拿到本次加载的数据以后，将loading设置为false -->
               <van-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                >
                  <van-cell
                    v-for="item in list"
                    :key="item"
                    :title="item"
                  />
                </van-list>
            </van-pull-refresh>
          </van-tab>
        </van-tabs>
      </div>
    </div>
</template>

<script>
import { setTimeout } from 'timers'
import { getUserChannels } from '@/api/channel'
export default {
  name: 'HomeIndex',
  data () {
    return {
      isLoading: false,
      loading: false,
      finished: false,
      list: [],
      activeChannelIndex: 0,
      channels: [] // 存储频道列表
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      const { user } = this.$store.state
      let channel = []
      // 已登录
      if (user) {
        // 请求获得用户频道列表
        const data = await getUserChannels()
        channels = data.channels
      } else {
        // 未登录

        // 如果有本地存储数据则使用本地存储中的频道列表
        const loaclChannels = JSON.parse(window.localStorage.getItem('channels'))
        if (loaclChannels) {
          channels = loaclChannels
        } else {
          // 如果没有本地存储频道数据则请求获取默认推荐频道列表
          const data = await getUserChannels()
          channels = data.channels
        }
      }
      this.channels = channels
    },
    onLoad () {
      console.log('onload')
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    },
    onRefresh () {
      console.log('onRefresh')
      setTimeout(() => {
        this.isLoading = false
      }, 3000)
    }
  }
}
</script>

<style lang="less" scoped>
.channel-top {
  background: blueviolet;
}
.channel-tabs {
  margin-bottom: 70px;
  margin-top: 80px;
}
.channel-tabs /deep/ .van-tabs_wrap {
  position: fixed;
  top: 92px;
}
.channel-tabs /deep/ .van-tabs_content {
  margin-top: 100px;
}
</style>

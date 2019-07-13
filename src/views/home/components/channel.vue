<template>
  <div>
      <!--
     v-model 是：
     v-bind:value="数据"
     v-on:input="数据=$event"
     lazy-render 关闭懒加载 -->

    <van-popup
      :value="value"
      @input="$emit('input',$event)"
      position="bottom"
      get-container="body"
      :style="{ height: '95%' }"
      >
      <!-- 我的频道 -->
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">我的频道</span>
            <span class="desc">点击进入频道</span>
          </div>
          <div>
            <van-button
            type="danger"
            plain
            size="mini"
            @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
          </div>
        </div>
        <van-grid
        class="channel-content"
        :gutter="10"
        clickable>
          <van-grid-item
          v-for="(item, index) in userChannels"
          :key="item.id"
          text="文章">
           <span
           class="text"
           :class="{ active:index === activeIndex && !isEdit}">{{ item.name }}</span>
           <van-icon class="close-icon" name="close" v-show="isEdit"/>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 推荐频道 -->
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">频道推荐</span>
            <span class="desc">点击添加频道</span>
          </div>
        </div>
        <van-grid
        class="channel-content"
        :gutter="10"
        clickable>
          <van-grid-item
          v-for="item in recommendChannels"
          :key="item.id"
          @click="handelAddChannel(item)">
           <span class="text">{{ item.name }}</span>
           <!-- <van-icon class="close-icon" name="close" /> -->
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // 该计算属性用于处理获取推荐数据（也就是不包含用户频道列表的其他所有频道列表数据）
    // 计算属性有用于watch的功能，但他的作用是用于数据改变之后重新计算返回一些数据供我们使用
    recommendChannels () {
      const duplicates = this.userChannels.map(item => item.id)
      return this.allChannels.filter(item => !duplicates.includes(item.id))
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false // 未编辑状态
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const data = await getAllChannels()
        // 修改channels，将这个数据结构修改为满足我们使用的需求
        data.channels.forEach(item => {
          item.aritcles = [] // 用来存储当前文字的列表
          item.timestamp = Date.now() // 存储下一页数据的时间戳
          item.downPullLoading = false // 控制当前频道的下拉刷新loading
          item.upPullLoading = false // 控制当前频道的上拉加载更多的loading状态
          item.upPullFinished = false // 控制当前频道数据是否加载完毕
          item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
        })
        console.log(data)
        this.allChannels = data.channels
      } catch (err) {
        console.log(err)
      }
    },
    handelAddChannel (item) {
      // userChannels是props数据
      // props数据有个原则：单向数据流
      // 数据只受父组件影响，但是反之不会
      // 但是引用类型除外
      // this.userChannels.push(item)

      // 建议做法就是将这个数据传递给父组件，让父组件自己去修改
      console.log(item)
      const channels = this.userChannels.slice(0)
      channels.push(item)
      this.$emit('update:user-channels', channels)

      const { user } = this.$store.state
      // 如果用户已登录，则请求添加用户频道
      if (user) {

      } else {
        // 如果没有登录，则添加到本地存储,本地存储数据无法修改，只有重置可以修改
        // const localChannels = JSON.parse(window.localStorage.getItem('channels'))

        window.localStorage.setItem('channels', JSON.stringify(channels))

        // 如果本地存储有频道列表，则添加到本地存储
        // if (localChannels) {
        //   localChannels = this.userChannels
        // } else {

        // }
        // window.localStorage.setItem('channels')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
  }
  .channel-content {
    .text {
       font-size: 24px;
    }
    .active {
      color:red;
    }
    .close-icon {
      font-size: 40px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display:flex;
      align-items: center;
    }
  }
}
</style>

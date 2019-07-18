   <!-- 作者信息 -->
<template>
   <div class="auto-info">
     <div class="base-info">
         <img class="avatar" :src="article.aut_photo" alt="">
         <!-- <img class="avatar" src="http://toutiao.meiduo.site/FkTXjvBkdM-pE9gQSzFjXlE7cIbY" alt=""> -->
         <div>
           <p>{{ article.aut-name }}</p>
           <!-- 过滤器 -->
           <p>{{ article.pubdate | relativeTime }}</p>
           <!-- <p>阳光新闻</p>
           <p>1小时前 阳光新闻官方账号</p> -->
         </div>
      </div>
      <div>
        <van-button
        :type="article.is_followed ? 'default' : 'danger'"
        @click="handleFollow"
        :loading="isFollowLoading"
        >{{ article.is_followed ? '已关注' : '关注'}}</van-button>
      </div>
   </div>
</template>

<script>
// 引入关注用户和取消用户接口
import { followUser, unFollowUser } from '@/api/user'

export default {
  name: 'AutoInfo',
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isFollowLoading: false
    }
  },
  created () {
    console.log(this.$route)
  },
  methods: {
    async handleFollow () {
      if (!this.$checkLogin()) {
        return
      }
      this.isFollowLoading = true
      try {
        const authId = this.article.aut_id

        if (this.article.is_followed) {
          // 取消关注
          await unFollowUser(authId)
          // 将客户端的关注状态设置为false
          this.article.is_followed = false
        } else {
          await followUser(authId)

          // 将客户端的关注状态设置为true
          this.article.is_followed = true
        }
      } catch (err) {
        this.$toast.fail('操作失败')
      }
      this.isFollowLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.auto-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size:30px;
  .base-info {
    display: flex;
    align-items:center;
  }
  .avatar {
    margin-right: 10px;
    width: 100px;
    border-radius: 100%;
  }
}
</style>

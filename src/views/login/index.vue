<template>
    <div>
        <!-- 导航栏 -->
        <van-nav-bar title="登录" />
        <!-- field输入框 -->
        <form>
          <van-cell-group>
            <van-field
            v-model="user.mobile"
            required
            clearable
            label="手机号"
            placeholder="请输入用户名"
            />
            <van-field
            v-model="user.code"
            type="password"
            label="密码"
            required=""
            placeholder="请输入用户名"
            />
          </van-cell-group>
        </form>
        <!-- 登录按钮 -->
        <div class="login-btn-box">
          <!-- prevent防止按钮进行调转 -->
          <van-button
          type="info"
          :loading="loginLoading"
          loading-text="登录中..."
          class="login-btn"
          @click.prevent="handleLogin"
          >登录</van-button>
        </div>
    </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'loginIndex',
  data () {
    return {
      user: { // 提交登录的表单数据
        mobile: '18135025161',
        code: '246810'
      },
      loginLoading: false // 控制登录按钮的loading状态
    }
  },
  methods: {
    async handleLogin () {
      this.loginLoading = true
      try {
        const res = await login(this.user)

        this.$store.commit('setUser', res.data.data)
        // 这里先简单粗暴的跳转到首页
        // 真实的业务要处理成跳转到之前过来的页面
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        console.log(err)
        console.log('登录失败')
      }
      this.loginLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-btn-box {
  padding: 20px;
  .login-btn {
    width: 100%;
  }
}
</style>

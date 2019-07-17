<template>
    <div class="login-wrap">
        <!-- 导航栏 -->
        <van-nav-bar title="登录" />
        <!-- field输入框 -->
        <form>
          <van-cell-group>
            <van-field
            v-model="user.mobile"
            v-validate="'required'"
            clearable
            label="手机号"
            placeholder="请输入用户名"
            :error-message="errors.first('mobile')"
            name="mobile"
            />
            <van-field
            v-model="user.code"
            clearable
            type="password"
            label="密码"
            v-validate="'required'"
            name="code"
            :error-message="errors.first('code')"
            placeholder="请输入密码"
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
        mobile: '13552580169',
        code: '246810'
      },
      loginLoading: false, // 控制登录按钮的loading状态
      // mobileMessage: '',
      // codeMessage: ''
      myErrors: {
        mobile: '',
        code: ''
      }
    }
  },
  created () {
    this.configFormErrorMessages()
  },
  methods: {
    async handleLogin () {
      // if (this.user.mobile.trim().length) {
      //   this.mobileMessage = ''
      // } else {
      //   this.mobileMessage = '请输入手机号'
      //   return
      // }
      // if (this.user.code.trim().length) {
      //   this.codeMessage = ''
      // } else {
      //   this.codeMessage = '请输入密码'
      //   return
      // }
      try {
        // 调用JavaScript触发验证
        const valid = await this.$validator.validate()
        // 如果校验失败，则停止后续代码执行
        if (!valid) {
          return
        }
        // 表单验证通过，发送请求，loading加载
        this.loginLoading = true
        const res = await login(this.user)

        this.$store.commit('setUser', res)

        // 这里先简单粗暴的跳转到首页
        // 真实的业务要处理成跳转到之前过来的页面
        this.$router.push({
          name: 'home'
        })
        this.$toast.success('登录成功')
      } catch (err) {
        // console.log(err)
        // console.log('登录失败')
        this.$toast.fail('登录失败')
      }
      this.loginLoading = false
    },
    configFormErrorMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: '密码不能为空'
          }
        }
      }
      this.$validator.localize('zh_CN', dict)
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

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
        <div class="login-btn-box">
          <van-button type="info" class="login-btn">登录</van-button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'loginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
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

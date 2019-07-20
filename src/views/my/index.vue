<template>
    <div>
        <!-- <div>my page</div> -->
        <un-login v-if="!$store.state.user"/>
        <user-info v-else/>
        <!-- 底部导航 -->
        <tabbar-layout />
        <!-- 底部导航 -->
    </div>
</template>

<script>
import UnLogin from './components/un-login'
import UserInfo from './components/user-info'

export default {
  name: 'MyIndex',
  components: {
    UnLogin,
    UserInfo
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="less" scoped>

</style>

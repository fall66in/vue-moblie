<template>
    <div>
        <!-- 缓存路由组件 -->
        <!-- <keep-alive>
            <router-view />
        </keep-alive> -->
        <van-tabbar route>
            <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
            <van-tabbar-item icon="search" to="/search">搜索</van-tabbar-item>
            <van-tabbar-item icon="friends-o" to="/video">视频</van-tabbar-item>
            <van-tabbar-item icon="setting-o" to="/my">{{ $store.state.user ? '我的' : '未登录'}}</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
  name: 'TabberLayout'
}
</script>

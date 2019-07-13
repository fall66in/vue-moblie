<template>
  <div id="app">
    <!-- <router-view/> -->
    <!-- 配置路由缓存 -->
    <!-- 将组件缓存起来 -->
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" scoped>

</style>

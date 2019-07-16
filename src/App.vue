<template>
  <div id="app">
    <!-- <router-view/> -->
    <!-- 配置路由缓存 -->
    <!-- 将组件缓存起来 -->
    <!-- 当你给router-view没有设置keep-alive的话，每个页面访问都会重新创建（离开销毁，进来创建）
    但是当你设置了keep-alive，就会缓存起来，只有第一次才会触发那些生命周期，包括原来的数据之类的都会缓存起来
    watch可以应对x导航到y路由，这两使用的同一个组件，watch可以很好处理
    但是当你把路由组件给keep-alive了以后，组件不会销毁，哪怕你导航到其他组件路由，也给watch到
    如果你没有开启keep-alive，则使用watch就够了
    加入是有watch -->
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

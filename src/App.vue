<template>
  <div id="app">
    <div class="box"></div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" scoped>
.box {
  width: 375px;
  height: 375px;
  background: red
}
</style>

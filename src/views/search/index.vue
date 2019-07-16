<template>
    <div>
        <!-- show-action 是否在搜索框右侧显示取消按钮 -->
        <van-search
        placeholder="请输入搜索关键词"
        v-model="searchText"
        show-action/>

        <!-- 联想建议表 -->
        <van-cell-group>
            <van-cell title="单元格" icon="search" />
            <van-cell title="单元格" icon="search" />
            <van-cell title="单元格" icon="search" />
            <van-cell title="单元格" icon="search" />
            <van-cell title="单元格" icon="search" />
            <van-cell title="单元格" icon="search" />
            <van-cell title="单元格" icon="search" />
        </van-cell-group>

        <!-- 历史记录 -->
        <van-cell-group>
          <van-cell title="历史记录">
            <v-icon
            slot="right-icon"
            name="delete"
            style="line-height: inherit;">
            </v-icon>
          </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      searchText: ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>


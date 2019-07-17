<template>
   <div class="article-wrap">
      <AutoInfo />
      <CommentList />
      <MoreAction />
      <RecommendArticle />
      <RecommendSearch />
      <ReplayList />
      <WriteComment />
   </div>
</template>

<script>
import AutoInfo from './components/auto-info'
import CommentList from './components/comment-list'
import MoreAction from './components/more-action'
import RecommendArticle from './components/recomment-article'
import RecommendSearch from './components/recommend-search'
import ReplayList from './components/replay-list'
import WriteComment from './components/write-comment'

export default {
  name: 'ArticleIndex',
  components: {
    AutoInfo,
    CommentList,
    MoreAction,
    RecommendArticle,
    RecommendSearch,
    ReplayList,
    WriteComment
  },
  data () {
    return {

    }
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped>

</style>

<template>
   <div class="article-wrap">
     <van-nav-bar
      title="黑马头条"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      />
      <h2 class="article-title">文章标题</h2>
      <AutoInfo class="auto-info"/>
      <div class="ariticle-content">
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
      </div>

      <MoreAction />
      <RecommendSearch />
      <RecommendArticle />
      <ReplayList />
      <WriteComment />
      <CommentList />
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
.article-wrap {
  padding: 20px;
  .article-title {
    font-size: 50px;
    font-weight: 400;
  }
  .ariticle-content {
    font-size: 24px;
  }
  .auto-info {
    position: sticky;
    top: 0;
    background: #fff;
  }
}

</style>

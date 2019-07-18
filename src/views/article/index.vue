<template>
   <div class="article-wrap">
     <van-nav-bar
      title="黑马头条"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      />
      <h2 class="article-title">{{ article.title }}</h2>
      <AutoInfo class="auto-info" :article="article"/>
      <div class="ariticle-content" v-html="article.content"></div>
      <MoreAction :article="article"/>
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
// 获取文章详情接口
import { getArticlesDetail } from '@/api/article'

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
      article: {
        art_id: 23861,
        attitude: null,
        aut_id: 2,
        aut_name: '13552285417',
        aut_photo: 'http://toutiao.meiduo.site/Fkj6tQi3xJwVXi1u2swCElotfdCi',
        ch_id: 13,
        content: '哈哈',
        is_collected: false,
        is_followed: false,
        pubdate: '2018-11-29T15:22:27',
        recomments: [],
        title: '全连接网络到卷积神经网络逐步推导（组图无公式）'
      }
    }
  },
  created () {
    this.loadArticleDetail()
  },
  deactivated () {
    this.$destroy()
  },
  methods: {
    async loadArticleDetail () {
      try {
        const data = await getArticlesDetail(this.$route.params.articleId)
        this.article = data
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
  }
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

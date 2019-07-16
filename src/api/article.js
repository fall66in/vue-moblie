// 文章相关接口封装模块

import request from '@/utils/request'

// 获取文章接口
export const getArticles = ({
  channelId, // 文章频道
  timestamp, // 时间戳（用于分页）
  withTop // 是否包含置顶，进入页面第一次请求时要报含置顶文章，1-包含置顶，0-不包含置顶
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}

// 对文章的不喜欢
export const dislikeArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

// 举报文章
export const reportArticle = ({
  articleId,
  type, // 举报类型：0,1,2,3,4,5,6,7,8,9
  remark // 其他问题的附加说明
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target: articleId,
      type: Number.parseInt(type),
      remark
    }
  })
}

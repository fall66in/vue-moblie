// 文章相关接口封装模块

import request from '@/utils/request'

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
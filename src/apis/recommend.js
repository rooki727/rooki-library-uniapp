import { https } from '@/https/https'

export const getRecommendationsAPI = (user_id, page, pageSize) => {
  return https({
    method: 'GET',
    url: `/recommend/getRecommendations?user_id=${user_id}&page=${page}&pageSize=${pageSize}`,
  })
}

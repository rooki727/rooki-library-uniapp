import { https } from '@/https/https'

//  获取购物车数量根据user_id
export const getCartCountAPI = (user_id) => {
  return https({
    url: '/cart/getCartCountById',
    method: 'POST',
    data: {
      user_id: user_id,
    },
  })
}

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

// 根据user_id获取购物车
export const findBookCartByUserIdAPI = (user_id) => {
  return https({
    url: '/cart/findBookCartByUserId',
    method: 'POST',
    data: {
      user_id: user_id,
    },
  })
}
//根据cart_id修改购物车选择
export const updateCartSelectedAPI = (cart_id, isSelected) => {
  return https({
    url: '/cart/updateCartSelect',
    method: 'POST',
    data: {
      cart_id: cart_id,
      isSelected: isSelected,
    },
  })
}

export const updateCartNumberAPI = (cart_id, number) => {
  return https({
    url: '/cart/updateCartNumber',
    method: 'POST',
    data: {
      cart_id: cart_id,
      number: number,
    },
  })
}

export const deleteMemberCartAPI = (cart_id) => {
  return https({
    url: '/cart/deleteMemberCart',
    method: 'POST',
    data: {
      cart_id: cart_id,
    },
  })
}

// 添加购物车
export const addBookCartAPI = (user_id, book_id, number, buildTime) => {
  return https({
    url: '/cart/addBookCart',
    method: 'POST',
    data: {
      user_id: user_id,
      book_id: book_id,
      number: number,
      buildTime: buildTime,
    },
  })
}

import { https } from '@/https/https'
// 购物车提交订单
export const addOrderListAPI = (user_id, number, order_money, buildTime, remark) => {
  return https({
    url: '/order/addOrderList',
    method: 'POST',
    data: {
      user_id: user_id,
      number: number,
      order_money: order_money,
      buildTime: buildTime,
      remark: remark,
    },
  })
}
export const addOrderDetailAPI = (order_id, book_id, detail_number) => {
  return https({
    url: '/order/addOrderDetail',
    method: 'POST',
    data: {
      order_id: order_id,
      book_id: book_id,
      detail_number: detail_number,
    },
  })
}

// 获取订单列表
export const getOrderDetailsWithBooksAPI = (order_id) => {
  return https({
    url: '/order/getOrderDetailsWithBooks',
    method: 'POST',
    data: {
      order_id: order_id,
    },
  })
}

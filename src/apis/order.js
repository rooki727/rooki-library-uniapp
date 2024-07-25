import { https } from '@/https/https'
// 购物车提交订单
export const addOrderListAPI = (
  user_id,
  number,
  order_money,
  buildTime,
  remark,
  delivery,
  order_address,
  order_freight,
  receiver,
  phone,
) => {
  return https({
    url: '/order/addOrderList',
    method: 'POST',
    data: {
      user_id: user_id,
      number: number,
      order_money: order_money,
      buildTime: buildTime,
      remark: remark,
      delivery: delivery,
      order_address: order_address,
      order_freight: order_freight,
      receiver: receiver,
      phone: phone,
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

export const updateOrderAPI = (order_id, order_status) => {
  return https({
    url: '/order/updateOrder',
    method: 'POST',
    data: {
      order_id: order_id,
      order_status: order_status,
    },
  })
}

export const deleteMemberOrderAPI = (order_id) => {
  return https({
    url: '/order/deleteOrder',
    method: 'POST',
    data: {
      order_id: order_id,
    },
  })
}
export const updateCancelReasonAPI = (order_id, order_status, cancelReason) => {
  return https({
    url: '/order/updateCancelReason',
    method: 'POST',
    data: {
      order_id: order_id,
      order_status: order_status,
      cancelReason: cancelReason,
    },
  })
}

export const updateDaiShouHuoAPI = (order_id, order_status) => {
  return https({
    url: '/order/updateDaiShouHuo',
    method: 'POST',
    data: {
      order_id: order_id,
      order_status: order_status,
    },
  })
}
export const updateDaiPingJiaAPI = (order_id, order_status) => {
  return https({
    url: '/order/updateDaiPingJia',
    method: 'POST',
    data: {
      order_id: order_id,
      order_status: order_status,
    },
  })
}
// 获取物流
export const findLogisticsListAPI = (order_id) => {
  return https({
    url: '/order/findLogisticsList',
    method: 'POST',
    data: {
      order_id: order_id,
    },
  })
}
// 获取数量根据状态和用户
export const findCountStatusAPI = (user_id) => {
  return https({
    url: '/order/findCountStatus',
    method: 'POST',
    data: {
      user_id: user_id,
    },
  })
}

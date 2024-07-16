import { https } from '@/https/https'
/**
 * 猜你喜欢-小程序
 */
export const getAddressListByIdAPI = (user_id) => {
  return https({
    url: '/address/getAddressListById',
    method: 'POST',
    data: {
      user_id: user_id,
    },
  })
}
// 删除地址
export const deleteAddressByIdAPI = (user_id, address_id) => {
  return https({
    url: '/address/deleteAddressById',
    method: 'POST',
    data: {
      user_id: user_id,
      address_id: address_id,
    },
  })
}
// 添加地址
export const addAddressAPI = (user_id, receiver, phone, bigAddress, fullAddress, isDefault) => {
  return https({
    url: '/address/addAddress',
    method: 'POST',
    data: {
      user_id: user_id,
      receiver: receiver,
      phone: phone,
      bigAddress: bigAddress,
      fullAddress: fullAddress,
      isDefault: isDefault,
    },
  })
}

//获取某个地址
export const getAddressByIdAPI = (user_id, address_id) => {
  return https({
    url: '/address/getAddressById',
    method: 'POST',
    data: {
      user_id: user_id,
      address_id: address_id,
    },
  })
}
// 修改地址
export const updateAddressAPI = (
  user_id,
  address_id,
  receiver,
  phone,
  bigAddress,
  fullAddress,
  isDefault,
) => {
  return https({
    url: '/address/updateAddress',
    method: 'POST',
    data: {
      address_id: address_id,
      user_id: user_id,
      receiver: receiver,
      phone: phone,
      bigAddress: bigAddress,
      fullAddress: fullAddress,
      isDefault: isDefault,
    },
  })
}
// 修改默认地址
export const updateDefaultAddressAPI = (user_id, address_id, isDefault) => {
  return https({
    url: '/address/updateAddressIsDefault',
    method: 'POST',
    data: {
      user_id: user_id,
      address_id: address_id,
      isDefault: isDefault,
    },
  })
}

import { https } from '@/https/https'

export const getBookCollectAPI = (user_id, book_id) => {
  return https({
    url: '/collection/getBookCollect',
    method: 'POST',
    data: {
      user_id: user_id,
      book_id: book_id,
    },
  })
}
// 添加收藏
export const addBookCollectAPI = (user_id, book_id) => {
  return https({
    url: '/collection/addCollection',
    method: 'POST',
    data: { user_id: user_id, book_id: book_id },
  })
}
// 取消收藏
export const deleteBookCollectAPI = (user_id, book_id) => {
  return https({
    url: '/collection/deleteCollection',
    method: 'POST',
    data: { user_id: user_id, book_id: book_id },
  })
}

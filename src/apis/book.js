import { https } from '@/https/https'

// 根据id获取书本信息
export const getBookByIdAPI = (book_id) => {
  return https({
    url: '/book/getBookById',
    method: 'POST',
    data: {
      book_id: book_id,
    },
  })
}

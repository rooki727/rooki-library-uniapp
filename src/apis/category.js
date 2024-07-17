import { https } from '@/https/https'

// 获取各类榜单首
export const getCategoryFirstBookAPI = () => {
  return https({
    method: 'GET',
    url: `/book/getCategoryFirstBook`,
  })
}

// 根据分类获取图书
export const getBookByCategoryAPI = (category, page, pageSize) => {
  return https({
    method: 'POST',
    url: `/book/getBookByCategory?category=${category}&page=${page}&pageSize=${pageSize}`,
  })
}

// 获取分类列表
export const getSaleCategoryListAPI = () => {
  return https({
    method: 'GET',
    url: `/book/getCategorySaleList`,
  })
}

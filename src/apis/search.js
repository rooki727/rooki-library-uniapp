import { https } from '@/https/https'

//根据书名搜索
export const getBookByNameAPI = (book_name) => {
  return https({
    url: `/book/fuzzyQueriesBookName?book_name=${book_name}`,
    method: 'POST',
  })
}

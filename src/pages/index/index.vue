<script setup>
import CustomNavbar from './components/CustomNavbar.vue'
import bookSwiper from '@/components/bookSwiper.vue'
import CategoryFour from './components/CategoryFour.vue'
import { ref } from 'vue'
import { getHomegetTotalPageAPI, getHomeGoodsGuessLikeAPI } from '@/apis/home'
import { onLoad } from '@dcloudio/uni-app'
import { getCategoryFirstBookAPI, getSaleCategoryListAPI } from '@/apis/category'
import CategoryFirstBook from './components/CategoryFirstBook.vue'
import GuessLike from '@/components/guessLike.vue'
const bannerList = ref([])
const totalPage = ref(0)
const page = ref(0)
const categoryFour = ref([])
const categoryFirstBook = ref([])
const guessLikeRef = ref([])
// 获取总页数
const getHomegetTotalPage = async () => {
  await getHomegetTotalPageAPI().then((res) => {
    totalPage.value = res.result
    // 随机生成一个数 用于获取轮播图数据
    page.value = Math.floor(Math.random() * totalPage.value + 1)
  })
}
const getBannerList = async () => {
  await getHomeGoodsGuessLikeAPI(page.value, 4).then((res) => {
    bannerList.value = res.result.bookList
  })
}

const getCategoryFirstBook = async () => {
  await getCategoryFirstBookAPI().then((res) => {
    res.result.sort((a, b) => b.sale_number - a.sale_number)
    categoryFirstBook.value = res.result
  })
}

// const getBookByCategory = async () => {
//   await getBookByCategoryAPI('科普类', 1, 4).then((res) => {
//     console.log(res.result)
//   })
// }

const getSaleCategoryList = async () => {
  await getSaleCategoryListAPI().then((res) => {
    // 1. 按照 value 值进行降序排序
    res.sort((a, b) => b.value - a.value)
    categoryFour.value = res.slice(0, 4)
  })
}

const onScrolltolower = () => {
  guessLikeRef.value.getMore()
}
onLoad(async () => {
  await getHomegetTotalPage().then(() => {
    getBannerList()
  })
  getCategoryFirstBook()
  getSaleCategoryList()
})
</script>
<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar></CustomNavbar>
  <scroll-view
    :scroll-y="true"
    class="scrollIndex"
    @scrolltolower="onScrolltolower"
    enable-back-to-top
  >
    <bookSwiper :bannerList="bannerList"></bookSwiper>
    <CategoryFour :categoryFour="categoryFour"></CategoryFour>
    <CategoryFirstBook :categoryFirstBook="categoryFirstBook"></CategoryFirstBook>
    <!-- 猜你喜欢 -->
    <view><GuessLike ref="guessLikeRef"></GuessLike></view>
  </scroll-view>
</template>

<style lang="scss">
page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f7f4f4;
}
.scrollIndex {
  flex: 1;
  height: 0;
}
</style>

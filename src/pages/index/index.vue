<script setup>
import CustomNavbar from './components/CustomNavbar.vue'
import bookSwiper from '@/components/bookSwiper.vue'
import { ref } from 'vue'
import { getHomegetTotalPageAPI, getHomeGoodsGuessLikeAPI } from '@/apis/home'
import { onLoad } from '@dcloudio/uni-app'

const bannerList = ref([])
const totalPage = ref(0)
const page = ref(0)
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

const onScrolltolower = () => {
  console.log('到底了')
}
onLoad(async () => {
  await getHomegetTotalPage().then(() => {
    getBannerList()
  })
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

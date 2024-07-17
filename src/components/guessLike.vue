<template>
  <view class="guessTitle">
    <uni-icons type="heart" size="19" color="#ed5017"></uni-icons>
    猜你喜欢
    <uni-icons type="heart" size="19" color="#ed5017"></uni-icons>
  </view>
  <!-- 物品板块 -->
  <bookItem :bookList="guessLikeList"></bookItem>
  <view class="loading-text">{{ finish ? '没有更多了' : '正在加载...' }}</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHomeGoodsGuessLikeAPI } from '@/apis/home'
import bookItem from './bookItem.vue'
const page = ref(1)
const pageSize = ref(4)
const guessLikeList = ref([])
const finish = ref(false)
const getHomeGoodsGuessLike = async () => {
  if (finish.value === true) {
    return uni.showToast({
      title: '没有更多了',
      icon: 'none',
    })
  }
  const res = await getHomeGoodsGuessLikeAPI(page.value, pageSize.value)
  guessLikeList.value.push(...res.result.bookList)
  if (page.value < res.result.totalPages) {
    page.value++
  } else {
    finish.value = true
  }
}
// 重置数据
const resetData = () => {
  guessLikeList.value = []
  page.value = 1
  pageSize.value = 4
  finish.value = false
}
onMounted(() => {
  getHomeGoodsGuessLike()
})
defineExpose({
  getMore: getHomeGoodsGuessLike,
  resetData: resetData,
})
</script>

<style lang="scss">
// 猜你喜欢板块
.guessTitle {
  font-size: 19px;
  text-align: center;
  margin-top: 5%;
  margin-bottom: 5%;
  color: #ed5017;
}

// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>

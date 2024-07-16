<template>
  <view class="guessTitle">
    <uni-icons type="heart" size="19"></uni-icons>
    猜你喜欢
    <uni-icons type="heart" size="19"></uni-icons>
  </view>
  <view class="guessLike">
    <navigator
      v-for="item in guessLikeList"
      :key="item.book_id"
      :url="`/pages/book/book?book_id=${item.book_id}`"
      open-type="navigate"
      hover-class="navigator-hover"
      class="guessLikeItem"
    >
      <image class="guessLikeImg" :src="item.main_picture" mode="aspectFill" />
      <view class="guessLikeText">{{ item.book_name }}</view>
      <view class="guessLikePrice"
        >¥ <text style="font-size: 18px">{{ item?.price.toFixed(2) }}</text></view
      >
    </navigator>
  </view>
  <view class="loading-text">{{ finish ? '没有更多了' : '正在加载...' }}</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHomeGoodsGuessLikeAPI } from '@/apis/home'
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
}
.guessLike {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 10rpx;
  .guessLikeItem {
    background-color: white;
    width: 49%;
    height: 200px;
    text-align: center;
    .guessLikeImg {
      margin-top: 10px;
      width: 170px;
      height: 130px;
    }
    .guessLikeText {
      font-size: 14px;
      text-align: left;
      margin-left: 10px;
    }
    .guessLikePrice {
      color: rgb(255, 89, 0);
      font-size: 14px;
      text-align: left;
      margin-left: 10px;
    }
  }
}

// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>

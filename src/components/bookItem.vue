<template>
  <view class="bookItemContent">
    <navigator
      v-for="item in bookList"
      :key="item.book_id"
      :url="`/pages/book/book?book_id=${item.book_id}`"
      open-type="navigate"
      hover-class="navigator-hover"
      class="bookItem"
    >
      <image class="bookItemImg" :src="item.main_picture" mode="aspectFit" />
      <view class="bookItemText">{{ item.book_name }}</view>
      <view class="bookItemPrice"
        >¥ <text style="font-size: 18px">{{ item?.price.toFixed(2) }}</text></view
      >
    </navigator>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const prop = defineProps({
  bookList: Array,
})
const bookList = computed(() => prop.bookList)
</script>

<style lang="scss">
.bookItemContent {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 10rpx;
  .bookItem {
    background-color: white;
    width: 49%;
    height: 200px;
    text-align: center;
    margin-bottom: 2%;
    .bookItemImg {
      margin-top: 10px;
      width: 90%;
      height: 65%;
    }
    .bookItemText {
      max-height: 21px;
      max-width: 90%;
      overflow: hidden;
      white-space: nowrap; /* 禁止换行 */
      text-overflow: ellipsis; /* 超出部分用省略号表示 */
      font-size: 14px;
      text-align: left;
      margin-left: 10px;
      color: #6a6868;
    }
    .bookItemPrice {
      color: rgb(255, 89, 0);
      font-size: 14px;
      text-align: left;
      margin-left: 10px;
    }
  }
}
</style>

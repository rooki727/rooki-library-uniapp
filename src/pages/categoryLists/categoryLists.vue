<template>
  <view>
    <image class="categoryListsImg" src="../../static/images/category.jpg" mode="aspectFit" />
  </view>
  <view class="categoryLists__title"
    ><uni-icons type="vip-filled" size="19" color="#dc6235"></uni-icons>分类榜单
  </view>
  <view class="categoryBookItem" v-for="item in categoryFirstBook" :key="item.book_id">
    <view class="categoryBookItemTitle">{{ item.category }}·热榜></view>
    <navigator
      :url="`/pages/book/book?book_id=${item.book_id}`"
      open-type="navigate"
      hover-class="navigator-hover"
    >
      <view class="categoryBookItemDetail"
        ><image class="categoryBookItemDetailImg" :src="item.main_picture" mode="heightFix" />
        <view class="categoryBookItemDetailText">{{ item.book_name }}</view>
        <view class="categoryBookItemDetailRank">No.1</view>
      </view>
    </navigator>
  </view>
</template>

<script setup>
import { getCategoryFirstBookAPI } from '@/apis/category'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
const categoryFirstBook = ref([])
const getCategoryFirstBook = async () => {
  await getCategoryFirstBookAPI().then((res) => {
    res.result.sort((a, b) => b.sale_number - a.sale_number)
    categoryFirstBook.value = res.result
  })
}
onLoad(() => {
  getCategoryFirstBook()
})
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
.categoryListsImg {
  width: 100%;
  height: 300px;
}
.categoryLists__title {
  text-align: center;
  font-size: 19px;
  color: #dc6235;
}
.categoryBookItem {
  margin-top: 10px;
  margin-left: 12px;
  border-radius: 10px;
  display: inline-block;
  height: 100px;
  width: 92%;
  background-color: white;
  .categoryBookItemTitle {
    color: #dc6235;
    margin: 8px 8px;
    font-size: 14px;
  }
  .categoryBookItemDetail {
    display: flex;
    width: 100%;
    position: relative;
    .categoryBookItemDetailImg {
      margin-left: 8px;
      height: 40px;
      width: 60px;
    }
    .categoryBookItemDetailText {
      overflow: hidden;
      max-width: 200px;
      margin-left: 5px;
      line-height: 30px;
      font-size: 14px;
    }
    .categoryBookItemDetailRank {
      font-size: 16px;
      position: absolute;
      top: 18%;
      right: 5%;
      color: rgb(79, 248, 0);
    }
  }
}
</style>

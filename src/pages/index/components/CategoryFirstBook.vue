<template>
  <view class="categoryFirstBookTitle"
    ><text class="categoryFirstBookTitleText">分类榜单</text>
    <navigator
      :url="`/pages/categoryLists/categoryLists?categoryFirstBook=${categoryFirstBook}`"
      open-type="navigate"
      hover-class="navigator-hover"
    >
      <view class="categoryFirstBookMore"
        >全部<uni-icons type="right" size="14" color="rgb(110, 108, 108)"></uni-icons>
      </view>
    </navigator>
  </view>
  <scroll-view scroll-x="true" class="categoryFirstBook" scroll-left="120">
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
  </scroll-view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  categoryFirstBook: Array,
})
const categoryFirstBook = computed(() => props.categoryFirstBook)
</script>

<style lang="scss">
.categoryFirstBook {
  margin-top: 5px;
  width: 100%;
  white-space: nowrap;
  height: 100px;
  .categoryBookItem {
    margin-top: 10px;
    margin-left: 12px;
    border-radius: 10px;
    display: inline-block;
    height: 80px;
    width: 220px;
    background-color: white;
    .categoryBookItemTitle {
      color: #dc6235;
      margin: 8px 8px;
      font-size: 12px;
    }
    .categoryBookItemDetail {
      display: flex;
      width: 100%;
      position: relative;
      .categoryBookItemDetailImg {
        margin-left: 8px;
        height: 40px;
        max-width: 50px;
      }
      .categoryBookItemDetailText {
        overflow: hidden;
        max-width: 120px;
        margin-left: 5px;
        line-height: 30px;
        font-size: 12px;
      }
      .categoryBookItemDetailRank {
        font-size: 14px;
        position: absolute;
        top: 20%;
        right: 0;
        color: rgb(79, 248, 0);
      }
    }
  }
}

.categoryFirstBookTitle {
  height: 20px;
  position: relative;
  .categoryFirstBookTitleText {
    font-weight: 600;
    font-size: 19px;
    position: absolute;
    color: #e3521d;
    top: 0;
    left: 5px;
  }
  .categoryFirstBookMore {
    font-size: 14px;
    position: absolute;
    top: 3px;
    right: 5px;
    color: rgb(110, 108, 108);
  }
}
</style>

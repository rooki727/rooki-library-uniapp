<template>
  <!-- 搜索条 -->
  <view class="search">
    <input
      class="searchInput"
      confirm-type="search"
      :placeholder="guessName ? guessName : '请输入关键字'"
      v-model="searchInput"
    />
    <navigator
      class="searchIcon"
      :url="`/pages/search/search?searchInput=${searchInput || guessName}`"
      open-type="navigate"
      hover-class="none"
    >
      <uni-icons type="search" size="25"></uni-icons>
    </navigator>
  </view>
  <!-- 内容部分 -->
  <view class="categoryContent">
    <!-- 左侧分类导航 -->
    <scroll-view scroll-y="true" class="scrollLeft">
      <view
        v-for="(item, index) in categoryList"
        :key="index"
        class="item"
        :class="{ active: item.category === category }"
        @tap="onTapNav(item.category)"
      >
        <text class="name"> {{ item.category }} </text>
      </view>
    </scroll-view>
    <!-- 右侧分类内容 -->
    <!-- 右侧：二级分类 -->
    <scroll-view class="secondary" scroll-y @scrolltolower="onScrolltolower" enable-back-to-top>
      <!-- 焦点图 -->
      <bookSwiper :bannerList="bannerList"></bookSwiper>
      <!-- 内容区域 -->
      <bookItem :bookList="bookList"></bookItem>
      <view class="loading-text">{{ finish ? '没有更多了' : '正在加载...' }}</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import {
  getGuessNameByCategoryAPI,
  getSaleCategoryListAPI,
  getBookByCategoryAPI,
  getTotalPageByCategoryAPI,
} from '@/apis/category'
import bookSwiper from '@/components/bookSwiper.vue'
import bookItem from '@/components/bookItem.vue'
const category = ref('')
const guessName = ref('')
const searchInput = ref('')

// 轮播图部分
const bannerList = ref([])
const totalPage = ref(0)
// 获取总页数
const getHomegetTotalPage = async () => {
  await getTotalPageByCategoryAPI(category.value).then((res) => {
    totalPage.value = res.result
  })
}
// 获取轮播图根据分类名
const getBannerList = async () => {
  await getBookByCategoryAPI(category.value, 1, 4).then((res) => {
    bannerList.value = res.result
  })
}
// 获取搜索框默认值
const getGuessNameByCategory = async () => {
  const res = await getGuessNameByCategoryAPI(category.value)
  guessName.value = res.result
}
// 获取分类列表
const categoryList = ref([])
const getSaleCategoryList = async () => {
  await getSaleCategoryListAPI().then((res) => {
    // 1. 按照 value 值进行降序排序
    res.sort((a, b) => b.value - a.value)
    categoryList.value = res
  })
}

// 根据分类获取书本列表
const bookList = ref([])
const page = ref(1)
const pageSize = ref(6)
const finish = ref(false)
const getBookByCategory = async () => {
  if (finish.value === true) {
    return uni.showToast({
      title: '没有更多了',
      icon: 'none',
    })
  }
  const res = await getBookByCategoryAPI(category.value, page.value, pageSize.value)
  bookList.value.push(...res.result)
  if (page.value < totalPage.value) {
    page.value++
  } else {
    finish.value = true
  }
}
// 重置需要请求用的数据
const resetData = () => {
  bookList.value = []
  page.value = 1
  finish.value = false
}
// 处理点击分类导航
const onTapNav = async (val) => {
  resetData()
  category.value = val
  getGuessNameByCategory()
  await getHomegetTotalPage().then(() => {
    getBannerList()
  })
  getBookByCategory()
}
//滚动加载
const onScrolltolower = () => {
  getBookByCategory()
}
onShow(async () => {
  try {
    category.value = uni.getStorageSync('categoryId')
    resetData()
    if (category.value) {
      // 清除数据 不占用持久存储空间
      uni.removeStorage({
        key: 'categoryId',
      })
    } else {
      category.value = '科普类'
    }
  } catch (error) {
    //没有相关数据
    console.log(error)
  }
  getGuessNameByCategory()
  getSaleCategoryList()
  await getHomegetTotalPage().then(() => {
    getBannerList()
  })
  getBookByCategory()
})
</script>

<style lang="scss">
page {
  background-color: #f4f2f2;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx 0 26rpx;
  height: 64rpx;
  margin: 16rpx 20rpx;
  color: #5e5d5d;
  font-size: 28rpx;
  border-radius: 32rpx;
  background-color: rgba(255, 255, 255, 0.5);
}
.searchInput {
  width: 85%;
  height: 64rpx;
}
.searchIcon {
  line-height: 64rpx;
  text-align: center;
  width: 12%;
  height: 64rpx;
}
.categoryContent {
  flex: 1;
  min-height: 400rpx;
  display: flex;
}
/* 一级分类 */
.scrollLeft {
  overflow: hidden;
  width: 180rpx;
  flex: none;
  background-color: #f6f6f6;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96rpx;
    font-size: 26rpx;
    color: #595c63;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 42rpx;
      bottom: 0;
      width: 96rpx;
      border-top: 1rpx solid #e3e4e7;
    }
  }
  .active {
    background-color: #fff;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 8rpx;
      height: 100%;
      background-color: orangered;
    }
  }
}
.scrollLeft .item:last-child::after,
.scrollLeft .active::after {
  display: none;
}

// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>

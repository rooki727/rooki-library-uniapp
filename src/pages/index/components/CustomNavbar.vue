<template>
  <view class="navbar" :style="{ paddingTop: navbarHeight + 'px' }">
    <!-- logo文字 -->
    <view class="logo">
      <!-- <image class="logo-image" src=""></image> -->
      <text class="logo-title">rooKi图书商城</text>
      <text class="logo-text">rooki-book-shop</text>
    </view>
    <!-- 搜索条 -->
    <view class="search">
      <input
        class="searchInput"
        confirm-type="search"
        :placeholder="guessName"
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
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHomeRandomNameAPI } from '@/apis/home'
//获取屏幕边界
const { safeArea } = uni.getSystemInfoSync()

//获取导航栏高度
const navbarHeight = safeArea?.top
const guessName = ref('')
const searchInput = ref('')
const getHomeRandomName = async () => {
  const res = await getHomeRandomNameAPI()
  guessName.value = res.result
}
onMounted(() => {
  getHomeRandomName()
})
</script>
<style lang="scss">
/* 自定义导航条 */
.navbar {
  background: linear-gradient(
    to bottom,
    rgba(247, 20, 20, 0.7),
    rgba(249, 40, 40, 0.6),
    rgba(242, 70, 70, 0.6),
    rgba(238, 98, 98, 0.6),
    rgba(237, 148, 148, 0.6),
    rgba(239, 165, 165, 0.6)
  );
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    padding-top: 20rpx;
    .logo-title {
      font-size: 22px;
      color: white;
      font-weight: 300;
    }

    .logo-text {
      font-style: oblique;
      flex: 1;
      line-height: 28rpx;
      color: #fff;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid #fff;
      font-size: 26rpx;
    }
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
}
</style>

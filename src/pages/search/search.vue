<template>
  <!-- 搜索条 -->
  <view class="navbar" :style="{ paddingTop: navbarHeight + 'px' }">
    <navigator open-type="navigateBack" hover-class="none">
      <view><uni-icons type="left" size="28"></uni-icons> </view>
    </navigator>
    <view class="search">
      <input
        class="searchInput"
        confirm-type="search"
        :placeholder="searchInput"
        v-model="newSearchInput"
      />
      <navigator
        class="searchIcon"
        :url="`/pages/search/search?searchInput=${newSearchInput} `"
        open-type="redirect"
        hover-class="none"
      >
        <uni-icons type="search" size="25"></uni-icons>
      </navigator>
    </view>
  </view>
  <!-- 搜索结果内容 -->
  <view class="searchcontent" v-if="searchList.length > 0">
    <bookItem :bookList="searchList"></bookItem>
  </view>
  <view v-else class="noneBook"
    ><uni-icons type="search" size="22" color="#eb6b16"></uni-icons> 没有该书籍,
    请换个关键字试试</view
  >
  <scroll-view
    :scroll-y="true"
    class="scrollSearch"
    @scrolltolower="onScrolltolower"
    enable-back-to-top
  >
    <view><guessLike ref="guessLikeRef"></guessLike></view>
  </scroll-view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getBookByNameAPI } from '@/apis/search'
import { onShow } from '@dcloudio/uni-app'
import guessLike from '@/components/guessLike.vue'
import bookItem from '@/components/bookItem.vue'
//获取屏幕边界
const { safeArea } = uni.getSystemInfoSync()

//获取导航栏高度
const navbarHeight = safeArea?.top + 5
const guessLikeRef = ref(null)
const props = defineProps({
  searchInput: String,
})
const searchList = ref([])
const searchInput = computed(() => props.searchInput)
const newSearchInput = ref('')
const getBookByName = async () => {
  if (newSearchInput.value !== '') {
    const res = await getBookByNameAPI(newSearchInput.value)
    searchList.value = res.result
  } else {
    const res = await getBookByNameAPI(searchInput.value)
    searchList.value = res.result
  }
}
const onScrolltolower = () => {
  guessLikeRef.value?.getMore()
}
onShow(() => {
  getBookByName()
})
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f2f2;
  display: flex;
  flex-direction: column;
}
.noneBook {
  height: 220px;
  width: 100%;
  line-height: 220px;
  text-align: center;
  font-size: 16px;
  color: #eb6b16;
  background-color: white;
}
.scrollSearch {
  flex: 1;
  margin-top: 40px;
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
  background-color: rgba(255, 255, 255);
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
</style>

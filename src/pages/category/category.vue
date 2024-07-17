<template>
  <view class="content"> category:{{ category }} </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
const category = ref('')
onShow(() => {
  try {
    category.value = uni.getStorageSync('categoryId')
    if (category.value) {
      // 清除数据 不占用持久存储空间
      uni.removeStorage({
        key: 'categoryId',
      })
    } else {
      category.value = '文学类'
    }
  } catch (error) {
    //没有相关数据
    console.log(error)
  }
})
</script>

<style lang="scss"></style>

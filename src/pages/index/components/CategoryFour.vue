<template>
  <view class="categoryFourTitle"
    ><uni-icons type="fire-filled" size="20" color="#e3521d"></uni-icons>分类热销<uni-icons
      type="fire-filled"
      size="20"
      color="#e3521d"
    ></uni-icons>
  </view>
  <view class="categoryFour">
    <view
      class="categoryItem"
      v-for="item in categoryFour"
      :key="item.category"
      @tap="onGoToCategory(item.category)"
    >
      {{ item.category }}
      <uni-icons
        custom-prefix="iconfont"
        type="icon-hyzs"
        size="16"
        v-show="item.category === '文学类'"
      ></uni-icons>
      <uni-icons type="scan" size="16" v-show="item.category === '科普类'" color="blue"></uni-icons>
      <uni-icons
        custom-prefix="iconfont"
        type="icon-shekeleipingbi"
        size="16"
        v-show="item.category === '社科类'"
        color="skyblue"
      ></uni-icons>
      <uni-icons
        custom-prefix="iconfont"
        type="icon-erjicaidan_lishileisishijianpinggubaogao"
        size="16"
        v-show="item.category === '历史类'"
        color="red"
      ></uni-icons>
      <uni-icons
        custom-prefix="iconfont"
        type="icon-yishuleihuojiang"
        size="16"
        v-show="item.category === '艺术类'"
        color="orange"
      ></uni-icons>
      <uni-icons
        custom-prefix="iconfont"
        type="icon-shenghuolei"
        size="16"
        v-show="item.category === '生活类'"
        color="pink"
      ></uni-icons>
      <uni-icons
        custom-prefix="iconfont"
        type="icon-kexuelei"
        size="16"
        v-show="item.category === '科学类'"
        color="green"
      ></uni-icons>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  categoryFour: Array,
})
const categoryFour = computed(() => props.categoryFour)
const onGoToCategory = (category) => {
  uni.setStorageSync('categoryId', category)
  // 发起跳转
  wx.switchTab({
    url: '/pages/category/category',
  })
}
</script>

<style lang="scss">
.categoryFourTitle {
  text-align: center;
  color: #e3521d;
  margin-top: 15px;
  font-size: 20px;
  font-weight: 500;
}
.categoryFour {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: rgb(243, 100, 100);
  font-weight: 600;
  .categoryItem {
    text-align: center;
    font-size: 15px;
    background-color: rgb(255, 255, 255);
    width: 20%;
    height: 50px;
    line-height: 50px;
    border-radius: 10px;
  }
}
</style>

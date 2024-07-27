// AddressPanel.vue
<script setup>
import { computed } from 'vue'

const emit = defineEmits(['close', 'choose'])
const props = defineProps({
  userAddresses: Array,
})
const userAddresses = computed(() => props.userAddresses)
const onChoose = (item) => {
  emit('choose', item)
}
</script>

<template>
  <view class="address-panel">
    <!-- 关闭按钮 -->
    <uni-icons
      class="close icon-close"
      type="closeempty"
      size="24"
      @tap="emit('close')"
    ></uni-icons>
    <!-- 标题 -->
    <view class="title">配送至</view>
    <!-- 内容 -->
    <view class="content">
      <view class="item" v-for="item in userAddresses" :key="item.address_id" @tap="onChoose(item)">
        <view class="user">{{ item?.receiver }} {{ item?.phone }} </view
        ><view class="moren" v-show="item.isDefault === 1">默认</view>
        <view class="address">{{ item?.bigAddress }} {{ item?.fullAddress }}</view>
      </view>
    </view>
    <view class="footer">
      <navigator
        class="button primary"
        url="/pagesMember/optionAddress/optionAddress"
        open-type="navigate"
        hover-class="navigator-hover"
      >
        <view class="button primary"> 新建地址 </view>
      </navigator>
    </view>
  </view>
</template>

<style lang="scss">
.address-panel {
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
}

.title {
  line-height: 1;
  padding: 40rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: normal;
  border-bottom: 1rpx solid #ddd;
  color: #444;
}

.close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
}

.content {
  min-height: 300rpx;
  max-height: 540rpx;
  overflow: auto;
  padding: 20rpx;
  .item {
    padding: 30rpx 50rpx 30rpx 60rpx;
    background-size: 40rpx;
    background-repeat: no-repeat;
    background-position: 0 center;
    background-image: url('../static/images/dingwei.png');
    position: relative;
    .moren {
      position: absolute;
      top: 20%;
      right: 20rpx;
      font-size: 28rpx;
      font-weight: 500;
      border-radius: 5px;
      line-height: 20px;
      text-align: center;
      margin-left: 8px;
      width: 38px;
      height: 20px;
      background-color: rgb(249, 233, 235);
      color: #fb2104;
    }
  }

  .user {
    font-size: 28rpx;
    color: #444;
    font-weight: 500;
  }
  .address {
    font-size: 26rpx;
    color: #666;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0 40rpx;
  font-size: 28rpx;
  color: #444;

  .button {
    flex: 1;
    height: 72rpx;
    text-align: center;
    line-height: 72rpx;
    margin: 0 20rpx;
    color: #fff;
    border-radius: 72rpx;
  }

  .primary {
    color: #fff;
    background-color: rgb(255, 85, 0);
  }
}
</style>

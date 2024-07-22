<template>
  <view class="settings">
    <!-- 个人信息和地址 -->
    <view class="itemList" v-show="memberStore.profile"
      ><navigator
        url="/pagesMember/profile/profile"
        open-type="navigate"
        hover-class="none"
        class="goNavigator"
      >
        <view>
          我的基本信息<uni-icons type="right" size="16" class="icon"></uni-icons></view></navigator
    ></view>
    <view class="itemList" v-show="memberStore.profile"
      ><navigator
        url="/pagesMember/address/address"
        open-type="navigate"
        hover-class="none"
        class="goNavigator"
      >
        我的收货地址<uni-icons type="right" size="16" class="icon"></uni-icons></navigator
    ></view>
    <view class="itemList" style="margin-top: 16px"
      ><navigator url="" open-type="navigate" hover-class="none" class="goNavigator">
        授权管理<uni-icons type="right" size="16" class="icon"></uni-icons></navigator
    ></view>
    <view class="itemList"
      ><navigator url="" open-type="navigate" hover-class="none" class="goNavigator">
        问题反馈<uni-icons type="right" size="16" class="icon"></uni-icons></navigator
    ></view>
    <view class="itemList"
      ><navigator url="" open-type="navigate" hover-class="none" class="goNavigator">
        联系我们<uni-icons type="right" size="16" class="icon"></uni-icons></navigator
    ></view>
    <view class="itemList" style="margin-top: 22px"
      ><navigator url="" open-type="navigate" hover-class="none" class="goNavigator">
        关于rooki图书商城<uni-icons type="right" size="16" class="icon"></uni-icons></navigator
    ></view>

    <view class="outLogin" v-if="memberStore.profile">
      <view @tap="outLogin" class="outLoginBtn">退出登录</view>
    </view>
    <view class="outLogin" v-else>
      <navigator
        class="outLoginBtn"
        url="/pages/login/login"
        open-type="navigate"
        hover-class="navigator-hover"
      >
        去登录
      </navigator>
    </view>
  </view>
</template>

<script setup>
import { useMemberStore } from '@/stores/modules/member'
import { useAddressStore } from '@/stores/modules/address'
const memberStore = useMemberStore()
const addressStore = useAddressStore()
const outLogin = () => {
  uni.showModal({
    title: '提示',
    content: '是否退出登录',
    success: function (res) {
      if (res.confirm) {
        // 清理用户信息
        memberStore.clearProfile()
        addressStore.clearAddress()
        addressStore.clearDefaultAddress()
        // 返回上一页
        uni.navigateBack()
      }
    },
  })
}
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
}
.settings {
  margin-top: 20px;
}
.itemList {
  padding-left: 20px;
  width: 100%;
  background-color: white;
  height: 32px;
  font-size: 16px;
  margin-bottom: 6px;
  line-height: 32px;
  position: relative;
  .goNavigator {
    width: 100%;
    height: 100%;
  }
  .icon {
    position: absolute;
    right: 30px;
  }
}
.outLogin {
  height: 40px;
  margin-top: 30px;
  text-align: center;
  background-color: white;
  .outLoginBtn {
    width: 100%;
    height: 40px;
    border: none;
    line-height: 40px;
  }
}
</style>

<template>
  <scroll-view :scroll-y="true" class="scroll" @scrolltolower="onScrolltolower" enable-back-to-top>
    <view class="midContent" :style="{ paddingTop: navbarHeight + 'px' }">
      <view class="isLogin" v-if="memberStore.profile">
        <navigator
          url="/pagesMember/profile/profile"
          open-type="navigate"
          hover-class="navigator-hover"
          style="width: 50%"
        >
          <view class="loginCard"
            ><image mode="aspectFill" class="awatar" :src="memberStore.profile.awatar" /><view
              class="midInfo"
            >
              <view>{{ memberStore.profile.name || memberStore.profile.account }}</view>
              <view class="goProfile">点击修改信息</view>
            </view>
          </view>
        </navigator>
        <navigator
          url="/pagesMember/settings/settings"
          open-type="navigate"
          hover-class="navigator-hover"
        >
          <view class="goSettings">设置</view>
        </navigator>
      </view>
      <view class="isNotLogin" v-else>
        <navigator
          url="/pages/login/login"
          open-type="navigate"
          hover-class="navigator-hover"
          style="width: 50%"
        >
          <view class="loginCard"
            ><image mode="aspectFill" class="awatar" src="../../static/images/remove.png" /><view
              class="midInfo"
            >
              <view class="goLogin">点击登陆/注册</view>
            </view>
          </view>
        </navigator>
        <navigator
          url="/pagesMember/settings/settings"
          open-type="navigate"
          hover-class="navigator-hover"
        >
          <view class="goSettings">设置</view>
        </navigator>
      </view>
    </view>
    <view class="orderFour">
      <view class="orderTitle">
        <view class="myorder">我的订单</view>
        <navigator url="" open-type="navigate" hover-class="navigator-hover" class="goToAllOrder">
          <view>查看所有订单<uni-icons type="right" size="14"></uni-icons> </view
        ></navigator>
      </view>
      <view class="orderContent">
        <navigator
          v-for="item in orderTitle"
          :key="item.type"
          :url="`/pagesOrder/orderList/orderList?type=${item.type}`"
          open-type="navigate"
          hover-class="navigator-hover"
        >
          <view class="orderVerify">
            <view class="orderNumber">1</view>
            <uni-icons custom-prefix="iconfont" :type="item.icon" size="30"></uni-icons
            >{{ item.name }}
          </view>
        </navigator>
      </view>
    </view>

    <!-- 猜你喜欢 -->
    <view><GuessLike ref="guessLikeRef"></GuessLike></view>
  </scroll-view>
</template>

<script setup>
import { useMemberStore } from '@/stores/modules/member'
import GuessLike from '@/components/guessLike.vue'
import { ref } from 'vue'
//获取屏幕边界
const { safeArea } = uni.getSystemInfoSync()
//获取导航栏高度
const navbarHeight = safeArea?.top + 20
const memberStore = useMemberStore()
const guessLikeRef = ref(null)
const onScrolltolower = () => {
  console.log('到底了')
  guessLikeRef.value?.getMore()
}

const orderTitle = [
  { type: 1, name: '待付款', icon: 'icon-daifukuan' },
  { type: 2, name: '待发货', icon: 'icon-daifahuo' },
  { type: 3, name: '待收货', icon: 'icon-daishouhuo' },
  { type: 4, name: '待评价', icon: 'icon-31daipingjia' },
  { type: 5, name: '退款/售后', icon: 'icon-tuikuanshouhou' },
]
</script>

<style lang="scss">
page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f7f4f4;
}
.scroll {
  flex: 1;
  height: 0;
}
.midContent {
  height: 10%;
  width: 100%;
  position: relative;
  background: linear-gradient(
    to bottom,
    rgba(247, 20, 20, 0.7),
    rgba(249, 40, 40, 0.6),
    rgba(242, 70, 70, 0.6),
    rgba(238, 98, 98, 0.6),
    rgba(237, 148, 148, 0.6),
    rgba(239, 165, 165, 0.6)
  );
  .loginCard {
    display: flex;
    margin-left: 6%;
    .awatar {
      border: 1px solid #d6d3d3;
      border-radius: 50%;
      height: 50px;
      width: 50px;
    }
    .midInfo {
      font-size: 20px;
      margin-left: 10px;
      color: white;
      .goProfile {
        border: 1px solid white;
        margin-top: 5px;
        font-size: 12px;
        border-radius: 15px;
      }
    }
  }
  // 设置按钮
  .goSettings {
    text-align: center;
    height: 30px;
    width: 50px;
    position: absolute;
    right: 5%;
    top: 72%;
    color: white;
  }
  // 去登录
  .goLogin {
    margin-top: 15px;
    font-size: 14px;
  }
}

// 订单板块
.orderFour {
  margin-left: 4%;
  height: 16%;
  width: 92%;
  background-color: white;
  border-radius: 5px;
  .orderTitle {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 3%;
    .myorder {
      margin-left: 10px;
      margin-top: 4%;
    }
    .goToAllOrder {
      margin-right: 10px;
      margin-top: 4%;
    }
  }
  .orderContent {
    display: flex;
    justify-content: space-evenly;
    .orderVerify {
      position: relative;
      margin-top: 3px;
      font-size: 12px;
      text-align: center;
      height: 60px;
      width: 55px;
      display: flex;
      flex-direction: column;
      .orderNumber {
        text-align: center;
        height: 14px;
        width: 14px;
        border-radius: 50%;
        background-color: rgb(255, 128, 0);
        color: white;
        position: absolute;
        top: 0;
        right: 5%;
      }
    }
  }
}
</style>

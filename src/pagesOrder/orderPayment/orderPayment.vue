<template>
  <scroll-view :scroll-y="true" class="orderPayment" @scrolltolower="onScrolltolower">
    <!-- 展示成功 -->
    <view class="contentPart">
      <!-- 图标 -->
      <view class="payIcon"
        ><uni-icons type="checkmarkempty" size="50" color="#f57403"></uni-icons>
      </view>
      <!-- 文字 -->
      <view class="payText">支付成功</view>
    </view>
    <!-- 具体信息 -->
    <view class="payInfo">
      <view class="payMoney"
        >￥<text style="font-size: 20px">{{ order.order_money }}</text></view
      >
      <view class="payinfoitem"
        >订单编号：<text class="payInfoText">{{ order.order_id }}</text></view
      >
      <view class="payinfoitem"
        >下单时间：<text class="payInfoText">{{ order.buildTime }}</text></view
      >
      <view class="payinfoitem">
        收货人： <text class="payInfoText">{{ order.receiver }}</text>
        <text class="payInfoText" style="margin-left: 10px">{{ order.phone }}</text></view
      >
      <view class="payinfoitem"
        >收获地址：<text class="payInfoText">{{ order.order_address }}</text></view
      >
    </view>
    <!-- 按钮 -->
    <view class="payBtn">
      <navigator hover-class="none" class="button" url="/pages/index/index" open-type="switchTab">
        返回首页
      </navigator>
      <navigator
        hover-class="none"
        class="button goOrder"
        :url="`/pagesOrder/orderDetail/orderDetail?order_id=${order_id}`"
        open-type="redirect"
      >
        查看订单
      </navigator>
    </view>
    <!-- 猜你喜欢 -->
    <guessLike ref="guessLikeRef"></guessLike>
  </scroll-view>
</template>

<script setup>
import { computed, ref } from 'vue'
import guessLike from '@/components/guessLike.vue'
import { getOrderDetailsWithBooksAPI } from '@/apis/order'
import { onLoad } from '@dcloudio/uni-app'
const orderList = ref([])
const order = ref({})
const query = defineProps({
  order_id: Number,
})
const guessLikeRef = ref(null)
const onScrolltolower = () => {
  guessLikeRef.value.getMore()
}
const order_id = computed(() => query.order_id)
const getOrderList = async () => {
  await getOrderDetailsWithBooksAPI(order_id.value).then((res) => {
    orderList.value = res.result?.orderDetailList
    order.value = res.result?.order
  })
}
onLoad(() => {
  getOrderList()
})
</script>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.orderPayment {
  flex: 1;
  height: 0;
  background-color: #f5f5f5;
  position: relative;
}
.contentPart {
  padding: 50px 0;
  background-color: #f57403;
  text-align: center;
  .payIcon {
    margin: 0 auto;
    height: 60px;
    width: 60px;
    text-align: center;
    line-height: 60px;
    background-color: white;
    border-radius: 50%;
  }
  .payText {
    margin-top: 5px;
    font-size: 22px;
    font-weight: 600;
    color: white;
    letter-spacing: 3px;
  }
}
.payInfo {
  border-radius: 5px;
  position: absolute;
  z-index: 100;
  top: 165px;
  left: 5%;
  width: 90%;
  height: 200px;
  background-color: #fff;
  overflow: hidden;
  .payMoney {
    text-align: center;
    padding: 10px 0;
    color: #7f7d7d;
    border-bottom: 1px solid #ede8e8;
  }
  .payinfoitem {
    padding: 0 12px;
    margin-top: 12px;
    font-size: 15px;
    color: #5f5e5e;
    .payInfoText {
      font-size: 14px;
    }
  }
}
.payBtn {
  margin-top: 200px;
  display: flex;
  justify-content: space-around;
  .button {
    height: 35px;
    width: 120px;
    background-color: #fff;
    text-align: center;
    line-height: 35px;
    border-radius: 15px;
    color: #f97501;
    font-size: 15px;
    border: 1px solid #f97501;
  }
  .goOrder {
    color: #fff;
    background-color: #f97501;
  }
}
</style>

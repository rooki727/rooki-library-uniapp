<template>
  <scroll-view scroll-y class="scrollViewOrder">
    <!-- 地址选择 -->
    <view class="contentCart" @tap="gotoAddress">
      <view class="chooseAddress"
        ><uni-icons type="location" size="16" color="orange"></uni-icons>配送至：
        <view class="addressView" v-if="!selectedAddress && !defaultAddress"
          >请选择配送地址<uni-icons
            type="right"
            size="16"
            color="orange"
            v-show="!selectedAddress && !defaultAddress"
          ></uni-icons>
        </view>
        <view class="addressView" v-else-if="selectedAddress">
          {{ selectedAddress.bigAddress }} {{ selectedAddress.fullAddress }}</view
        >
        <view class="addressView" v-else-if="defaultAddress && !selectedAddress">
          {{ defaultAddress.bigAddress }} {{ defaultAddress.fullAddress }}</view
        >
      </view>
    </view>
    <!--商品信息 -->
    <navigator
      v-for="item in orderList"
      :key="item.order_id"
      url="/pages/book/book"
      open-type="navigate"
      hover-class="navigator-hover"
      class="bookItemOrder"
    >
      <view class="imagePart"
        ><image class="imageOrder" :src="item.main_picture" mode="aspectFit"
      /></view>
      <view class="infoPart">
        <view class="orderName">{{ item.book_name }}</view>
        <view class="orderSpec">规格</view>
        <view class="orderPrice"
          >￥<text style="font-size: 19px">{{ item.price }}</text></view
        >
      </view>
      <view class="countOrder"
        >X<text style="font-size: 17px">{{ item.detail_number }}</text></view
      >
    </navigator>
    <!-- 配送信息和订单备注 -->
    <view class="related">
      <view class="item">
        <text class="text">配送时间</text>
        <picker :range="deliveryList" range-key="text" @change="onChangeDelivery">
          <view class="icon-fonts picker">{{ activeDelivery.text }}</view>
        </picker>
      </view>
      <view class="item">
        <text class="text">订单备注</text>
        <input
          class="input"
          :cursor-spacing="30"
          placeholder="建议留言前先与商家沟通确认"
          v-model="remarkMessage"
        />
      </view>
    </view>
    <!-- 金额信息 -->
    <view class="settlement">
      <view class="item">
        <text class="text">商品总价: </text>
        <text class="settlementPrice">￥{{ totalMoney }}</text>
      </view>
      <view class="item">
        <text class="text">运费: </text>
        <text class="settlementPrice">￥{{ selectedAddress.freight }}</text>
      </view>
    </view>
  </scroll-view>

  <!-- 吸底工具栏 -->
  <view class="toolbar" style="padding-bottom: 10px">
    <view class="total-pay symbol">
      <text class="number">￥{{ totalMoney }}</text>
    </view>
    <view class="button" :class="{ disabled: !selectedAddress?.address_id }" @tap="onOrderSubmit">
      提交订单
    </view>
  </view>
</template>

<script setup>
import { useAddressStore } from '@/stores/modules/address'
import { getBookByIdAPI } from '@/apis/book'

import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useMemberStore } from '@/stores/modules/member'
import { addOrderListAPI, addOrderDetailAPI, getOrderDetailsWithBooksAPI } from '@/apis/order'
import { deleteMemberCartAPI } from '@/apis/cart'
import dayjs from 'dayjs'
import { useCartStore } from '@/stores/modules/cart'
const cartStore = useCartStore()
const memberStore = useMemberStore()
const cartList = computed(() => cartStore.cartList)
const addressStore = useAddressStore()
const user_id = computed(() => memberStore.profile.user_id)
const selectedAddress = computed(() => addressStore.selectedAddress)
const defaultAddress = computed(() => addressStore.defaultAddress)
const query = defineProps({
  way: String,
  detail_number: Number,
  book_id: Number,
  order_id: Number,
})
const book_id = computed(() => query.book_id)
const detail_number = computed(() => query.detail_number)
const way = computed(() => query.way)
const order_id = computed(() => query.order_id)
const remarkMessage = ref('')
const deliveryList = ref([
  { type: 1, text: '时间不限 (周一至周日)' },
  { type: 2, text: '工作日送 (周一至周五)' },
  { type: 3, text: '周末配送 (周六至周日)' },
])
// 当前配送时间下标
const activeIndex = ref(0)
// 当前配送时间
const activeDelivery = computed(() => deliveryList.value[activeIndex.value])
// 修改配送时间
const onChangeDelivery = (ev) => {
  activeIndex.value = ev.detail.value
}
const gotoAddress = () => {
  const action = 'choose'
  uni.navigateTo({
    url: `/pagesMember/address/address?action=${action}`,
  })
}
// 根据id获取订单信息
const orderList = ref([])
// 获得总价
const totalMoney = computed(() =>
  orderList.value.reduce((sum, item) => sum + item.price * item.detail_number, 0),
)
// 获得总数
const totalCount = computed(() =>
  orderList.value.reduce((sum, item) => sum + item.detail_number, 0),
)
const getOrderDetailsWithBooks = async () => {
  if (way.value === 'cart') {
    orderList.value = cartList.value
  } else if (way.value === 'book') {
    const res = await getBookByIdAPI(book_id.value)
    const book = ref({})
    book.value = res.result
    book.value.detail_number = detail_number.value
    orderList.value[0] = book.value
  } else if (way.value === 'again') {
    const res = await getOrderDetailsWithBooksAPI(order_id.value)
    orderList.value = res.result.orderDetailList
  }
}
// 点击提交按钮
const onOrderSubmit = async () => {
  const order_address = selectedAddress.value.bigAddress + ' ' + selectedAddress.value.fullAddress
  if (!selectedAddress.value.address_id) {
    uni.showToast({
      title: '请选择地址',
      icon: 'none',
    })
    return
  }

  // 如果是购物车订单
  else if (way.value === 'cart') {
    const date = new Date()
    const formattedDateTime = dayjs(date).format('YYYY-MM-DD HH:mm:ss')

    await addOrderListAPI(
      user_id.value,
      totalCount.value,
      totalMoney.value,
      formattedDateTime,
      remarkMessage.value,
      activeDelivery.value.text,
      order_address,
      selectedAddress.value.freight,
      selectedAddress.value.receiver,
      selectedAddress.value.phone,
    ).then(async (res) => {
      if (res.result) {
        const order_id = res.result
        orderList.value.forEach(async (item) => {
          await deleteMemberCartAPI(item.cart_id)
          await addOrderDetailAPI(order_id, item.book_id, item.detail_number).then(async () => {
            uni.redirectTo({
              url: `/pagesOrder/orderDetail/orderDetail?order_id=${order_id}`,
            })
          })
        })
      }
    })
  }
  // 如果是书本页面直接提交
  else if (way.value === 'book') {
    const date = new Date()
    const formattedDateTime = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    await addOrderListAPI(
      user_id.value,
      detail_number.value,
      parseInt(orderList.value[0].price) * detail_number.value,
      formattedDateTime,
      remarkMessage.value,
      activeDelivery.value.text,
      order_address,
      selectedAddress.value.freight,
      selectedAddress.value.receiver,
      selectedAddress.value.phone,
    ).then(async (res) => {
      if (res.result) {
        const order_id = res.result
        await addOrderDetailAPI(order_id, book_id.value, detail_number.value).then(async () => {
          uni.redirectTo({
            url: `/pagesOrder/orderDetail/orderDetail?order_id=${order_id}`,
          })
        })
      }
    })
  } else if (way.value === 'again') {
    const date = new Date()
    const formattedDateTime = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    await addOrderListAPI(
      user_id.value,
      totalCount.value,
      totalMoney.value,
      formattedDateTime,
      remarkMessage.value,
      activeDelivery.value.text,
      order_address,
      selectedAddress.value.freight,
      selectedAddress.value.receiver,
      selectedAddress.value.phone,
    ).then(async (res) => {
      if (res.result) {
        const order_id = res.result
        orderList.value.forEach(async (item) => {
          await deleteMemberCartAPI(item.cart_id)
          await addOrderDetailAPI(order_id, item.book_id, item.detail_number).then(async () => {
            uni.redirectTo({
              url: `/pagesOrder/orderDetail/orderDetail?order_id=${order_id}`,
            })
          })
        })
      }
    })
  }
}
onLoad(() => {
  getOrderDetailsWithBooks()
})
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
}

// 滚动容器
.scrollViewOrder {
  flex: 1;
  height: 0;
}
.chooseAddress {
  padding-left: 5px;
  display: flex;
  background-color: white;
  overflow: hidden;
  height: 50px;
  font-size: 15px;
  line-height: 50px;
  color: gray;
  .addressView {
    margin-left: 5px;
  }
}
.bookItemOrder {
  margin: 0 auto;
  width: 96%;
  border-radius: 10rpx;
  margin-top: 5px;
  background-color: white;
  height: 120px;
  display: flex;
  position: relative;
  .imagePart {
    margin: 6px 12px;
    width: 90px;
    height: 100px;
    line-height: 100px;
    border: 1px solid #dcd4d4;
    .imageOrder {
      width: 90px;
      height: 100px;
    }
  }
  .infoPart {
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .orderName {
      font-size: 16px;
    }
    .orderSpec {
      font-size: 13px;
      background-color: #f6f1f1;
      color: gray;
      text-align: center;
    }
    .orderPrice {
      color: orangered;
      font-size: 14px;
      margin-bottom: 8px;
    }
  }
  .countOrder {
    position: absolute;
    right: 10px;
    bottom: 10px;
    font-size: 12px;
    color: gray;
  }
}
// 订单备注和配送期望
.related {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .input {
    flex: 1;
    text-align: right;
    margin: 20rpx 0;
    padding-right: 20rpx;
    font-size: 26rpx;
    color: #999;
  }

  .item .text {
    width: 125rpx;
  }

  .picker {
    color: #666;
  }
}
/* 结算清单 */
.settlement {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    font-size: 26rpx;
    color: #4f4f4f;
  }
}

/* 吸底工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;

  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .total-pay {
    font-size: 40rpx;
    color: orangered;

    .decimal {
      font-size: 75%;
    }
  }

  .button {
    width: 220rpx;
    text-align: center;
    line-height: 72rpx;
    font-size: 26rpx;
    color: #fff;
    border-radius: 72rpx;
    background-color: orangered;
  }

  .disabled {
    opacity: 0.5;
  }
}
</style>

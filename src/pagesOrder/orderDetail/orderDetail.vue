<template>
  <!-- 自定义导航栏: 默认透明不可见, scroll-view 滚动到 50 时展示 -->
  <view class="navbar" :style="{ paddingTop: safeAreaInsetsTop + 'px' }">
    <view class="wrap">
      <navigator v-if="pages.length > 1" open-type="navigateBack" class="back"
        ><uni-icons type="left" size="25"></uni-icons>
      </navigator>
      <navigator v-else url="/pages/index/index" open-type="switchTab" class="back"
        ><uni-icons type="left" size="25"></uni-icons>
      </navigator>
      <view class="title">订单详情</view>
    </view>
  </view>
  <!-- 订单详情 -->
  <scroll-view
    scroll-y="true"
    class="viewport"
    id="scroller"
    @scrolltolower="onScrolltolower"
    :enable-back-to-top="true"
  >
    <!-- 订单状态 -->
    <view class="overview" :style="{ paddingTop: safeAreaInsetsTop + 'px' }">
      <!-- 待付款状态:展示去支付按钮和倒计时 -->
      <template v-if="order.order_status === '待付款'">
        <view class="status"
          ><uni-icons type="minus" size="16" color="white"></uni-icons>等待付款</view
        >
        <view class="tips">
          <text class="money">应付金额: ¥ {{ order.order_money }}</text>
          <text class="time">支付剩余</text>
          <!-- 倒计时组件 -->
          <uni-countdown
            :minute="30"
            color="#fff"
            splitor-color="#fff"
            :show-day="false"
            :show-colon="false"
            @timeup="onTimeup"
          />
        </view>
        <view class="button" @tap="onOrderPay">去支付</view>
      </template>
      <!-- 其他订单状态:展示再次购买按钮 -->
      <template v-else>
        <!-- 订单状态文字 -->
        <view class="status"> {{ order.order_status }} </view>
        <view class="button-group">
          <navigator
            class="button"
            :url="`/pagesOrder/orderCreate/orderCreate?order_id=${order_id}&way=${way}`"
            hover-class="none"
          >
            再次购买
          </navigator>
          <!-- 待发货状态：模拟发货,开发期间使用,用于修改订单状态为已发货 -->
          <view v-if="order.order_status == '待发货'" @tap="onOrderSend" class="button">
            模拟发货
          </view>
          <!-- 待收货状态: 展示确认收货按钮 -->
          <view v-if="order.order_status === '待收货'" @tap="onOrderConfirm" class="button">
            确认收货
          </view>
        </view>
      </template>
    </view>
    <!-- 配送状态 -->
    <view
      class="shipment"
      v-if="
        order.order_status === '待发货' ||
        order.order_status === '待收货' ||
        order.order_status === '待评价' ||
        order.order_status === '已完成' ||
        order.order_status === '已退款'
      "
    >
      <!-- 订单物流信息 -->
      <view v-for="item in logisticList" :key="item.logistics_id" class="item">
        <uni-icons
          custom-prefix="iconfont"
          type="icon-daishouhuo"
          size="30"
          color="orangered"
        ></uni-icons>
        <view>
          <view class="message">{{ item.text }}</view>
          <view class="date">{{ item.time }}</view>
        </view>
      </view>
    </view>
    <view class="shipment">
      <!-- 用户收货地址 -->
      <view class="locate">
        <uni-icons type="location" size="30" color="orangered"></uni-icons>
        <view>
          <view class="user"> {{ order.receiver }} {{ order.phone }} </view>
          <view class="address"> {{ order.order_address }} </view></view
        >
      </view>
    </view>

    <!--商品信息 -->
    <navigator
      v-for="item in orderList"
      :key="item.order_detail_id"
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
    <!--快捷 按钮区 -->
    <view class="action" v-show="order.order_status === '待评价'">
      <view class="quickBtn saleBtn">去评价</view>
      <navigator url="" class="quickBtn commentBtn"> 申请售后 </navigator>
    </view>

    <!-- 合计 -->
    <view class="total">
      <view class="row">
        <view>商品总价: </view>
        <view>￥{{ order.order_money }}</view>
      </view>
      <view class="row">
        <view>运费: </view>
        <view>￥{{ order.order_freight }}</view>
      </view>
      <view class="row">
        <view>应付金额: </view>
        <view class="keyMoney">￥{{ order.order_money }}</view>
      </view>
    </view>
    <!-- 订单信息 -->
    <view class="detailNumber">
      <view class="title">订单信息</view>
      <view class="row">
        <view class="item">
          订单编号: {{ order.order_id }}
          <text class="copy" @tap="onCopy(order.order_id)">复制</text>
        </view>
        <view class="item">下单时间: {{ order.buildTime }}</view>
      </view>
    </view>

    <!-- 猜你喜欢 -->
    <guessLike ref="guessLikeRef"></guessLike>

    <!-- 底部操作栏 -->
    <view class="toolbar-height" :style="{ paddingBottom: safeAreaInsetsBottom + 'px' }"></view>
    <view class="toolbar" :style="{ paddingBottom: safeAreaInsetsBottom + 'px' }">
      <!-- 待付款状态:展示支付按钮 -->
      <template v-if="order.order_status === '待付款'">
        <view class="button primary" @tap="onOrderPay"> 去支付 </view>
        <view class="button" @tap="popup?.open?.()"> 取消订单 </view>
      </template>
      <!-- 其他订单状态:按需展示按钮 -->
      <template v-else>
        <navigator
          class="button secondary"
          :url="`/pagesOrder/orderCreate/orderCreate?order_id=${order_id}&way=${way}`"
          hover-class="none"
        >
          再次购买
        </navigator>
        <!-- 待收货状态: 展示确认收货 -->
        <view class="button primary" v-if="order.order_status === '待收货'" @tap="onOrderConfirm">
          确认收货
        </view>
        <!-- 待评价状态: 展示去评价 -->
        <view class="button" v-if="order.order_status === '待评价'"> 去评价 </view>
        <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
        <view
          class="button delete"
          v-if="
            order.order_status === '待评价' ||
            order.order_status === '已完成' ||
            order.order_status === '已退款' ||
            order.order_status === '已取消'
          "
          @tap="onOrderDete"
        >
          删除订单
        </view>
      </template>
    </view>
  </scroll-view>

  <!-- 取消订单弹窗 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <view class="popup-root">
      <view class="title">订单取消</view>
      <view class="description">
        <view class="tips">请选择取消订单的原因：</view>
        <view class="cell" v-for="item in reasonList" :key="item" @tap="reason = item">
          <text class="text">{{ item }}</text>
          <view class="icon" :class="{ active: item === reason }"
            ><uni-icons
              v-show="item === reason"
              type="checkmarkempty"
              size="18"
              color="white"
            ></uni-icons
          ></view>
        </view>
      </view>
      <view class="footer">
        <view class="button" @tap="popup?.close?.()">取消</view>
        <view class="button primary" @tap="onCancelOrder">确认</view>
      </view>
    </view>
  </uni-popup>
</template>
<script setup>
import { computed, ref } from 'vue'

import {
  getOrderDetailsWithBooksAPI,
  updateOrderAPI,
  deleteMemberOrderAPI,
  updateCancelReasonAPI,
  updateDaiShouHuoAPI,
  updateDaiPingJiaAPI,
  findLogisticsListAPI,
} from '@/apis/order'
import { onLoad, onReady } from '@dcloudio/uni-app'
import guessLike from '@/components/guessLike.vue'
const query = defineProps({
  order_id: Number,
})
const order_id = computed(() => query.order_id)

const pages = getCurrentPages()
// 获取当前页面实例，数组最后一项
const pageInstance = pages.at(-1)
// 页面渲染完毕，绑定动画效果
onReady(() => {
  // 动画效果,导航栏背景色
  pageInstance.animate(
    '.navbar', // 选择器
    [{ backgroundColor: 'transparent' }, { backgroundColor: '#f8f8f8' }], // 关键帧信息
    1000, // 动画持续时长
    {
      scrollSource: '#scroller', // scroll-view 的选择器
      startScrollOffset: 0, // 开始滚动偏移量
      endScrollOffset: 50, // 停止滚动偏移量
      timeRange: 1000, // 时间长度
    },
  )
  // 动画效果,导航栏标题
  pageInstance.animate('.navbar .title', [{ color: 'transparent' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  })
  // 动画效果,导航栏返回按钮
  pageInstance.animate('.navbar .back', [{ color: '#fff' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  })
})
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const safeAreaInsetsTop = safeAreaInsets.top
const safeAreaInsetsBottom = safeAreaInsets.bottom
const orderList = ref([])
const order = ref({})
const guessLikeRef = ref(null)
const logisticList = ref([])
const findLogisticsList = async () => {
  await findLogisticsListAPI(order_id.value).then((res) => {
    logisticList.value = res.result
  })
}
// 定义再次购买时的方法way
const way = 'again'
// 弹出层组件
const popup = ref(null)
// 取消原因列表
const reasonList = ref([
  '商品无货',
  '不想要了',
  '商品信息填错了',
  '地址信息填写错误',
  '商品降价',
  '其它',
])
// 订单取消原因
const reason = ref('')
// 复制内容调用uni的api
const onCopy = (id) => {
  // 设置系统剪贴板的内容
  uni.setClipboardData({ data: id })
}
const getOrderList = async () => {
  await getOrderDetailsWithBooksAPI(order_id.value).then((res) => {
    orderList.value = res.result.orderDetailList
    order.value = res.result.order
  })
}
// 猜你喜欢滚轮
const onScrolltolower = () => {
  guessLikeRef.value.getMore()
}
// 倒计时结束事件
const onTimeup = async () => {
  // 修改订单状态为已取消
  order.value.order_status = '已取消'
  await updateCancelReasonAPI(order_id.value, '已取消', '倒计时结束')
  uni.redirectTo({ url: '/pagesOrder/orderList/orderList' })
}
// 订单支付
// 是否为开发环境
const isDev = import.meta.env.DEV
const onOrderPay = async () => {
  // 通过环境变量区分开发环境
  if (isDev) {
    // 开发环境：模拟支付，修改订单状态为待发货
    await updateOrderAPI(order_id.value, '待发货')
    order.value.order_status = '待发货'
    findLogisticsList()
  } else {
    // 生产环境：获取支付参数 + 发起微信支付
    // const res = await getPayWxPayMiniPayAPI({ orderId: query.id })
    // await wx.requestPayment(res.result)
    // 实际应该做不同的操作 但是后端只做了假行为 所以一致
    // 开发环境：模拟支付，修改订单状态为待发货
    await updateOrderAPI(order_id.value, '待发货')
    order.value.order_status = '待发货'
    findLogisticsList()
  }
  // 关闭当前页，再跳转支付结果页
  uni.redirectTo({ url: `/pagesOrder/orderPayment/orderPayment?order_id=${order_id.value}` })
}
// 模拟发货
const onOrderSend = async () => {
  if (isDev) {
    await updateDaiShouHuoAPI(order_id.value, '待收货')
    uni.showToast({ icon: 'success', title: '模拟发货完成' })
    findLogisticsList()
    // 主动更新订单状态
    order.value.order_status = '待收货'
  }
  // 实际应该做不同的操作 但是后端只做了假行为 所以一致
  else {
    await updateDaiShouHuoAPI(order_id.value, '待收货')
    uni.showToast({ icon: 'success', title: '模拟发货完成' })
    findLogisticsList()
    // 主动更新订单状态
    order.value.order_status = '待收货'
  }
}
// 确认收货
const onOrderConfirm = () => {
  if (order.value.order_status === '待收货') {
    // 二次确认弹窗
    uni.showModal({
      content: '为保障您的权益，请收到货并确认无误后，再确认收货',
      success: async (success) => {
        if (success.confirm) {
          await updateDaiPingJiaAPI(order_id.value, '待评价')
          order.value.order_status = '待评价'
          findLogisticsList()
        }
      },
    })
  }
}
// 删除订单
const onOrderDete = () => {
  uni.showModal({
    content: '确认删除订单',
    success: async (success) => {
      if (success.confirm) {
        await deleteMemberOrderAPI(order_id.value)
        uni.redirectTo({ url: `/pagesOrder/orderList/orderList?type=${0}` })
      }
    },
  })
}
// 取消
const onCancelOrder = async () => {
  await updateCancelReasonAPI(order_id.value, '已取消', reason.value)
  uni.redirectTo({ url: `/pagesOrder/orderList/orderList?type=${0}` })
}
onLoad(() => {
  getOrderList()
  findLogisticsList()
})
</script>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.viewport {
  flex: 1;
  height: 100%;
  background-color: #f7f7f8;
}
.navbar {
  width: 100%;
  color: #000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  // background-color: rgba(221, 79, 36, 0.5);
  background-color: transparent;
  .wrap {
    position: relative;

    .title {
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      /* color: #000; */
      color: transparent;
    }

    .back {
      position: absolute;
      left: 0;
      height: 44px;
      width: 44px;
      font-size: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      /* color: #000; */
      color: #fff;
    }
  }
}

.overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  padding-bottom: 30rpx;
  color: #fff;
  background-color: rgb(247, 75, 13, 0.6);
  background-size: cover;

  .status {
    font-size: 36rpx;
  }

  .status::before {
    margin-right: 6rpx;
    font-weight: 500;
  }

  .tips {
    margin: 30rpx 0;
    display: flex;
    font-size: 14px;
    align-items: center;

    .money {
      margin-right: 30rpx;
    }
  }

  .button-group {
    margin-top: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button {
    width: 260rpx;
    height: 64rpx;
    margin: 0 10rpx;
    text-align: center;
    line-height: 64rpx;
    font-size: 28rpx;
    color: orange;
    border-radius: 68rpx;
    background-color: #fff;
  }
}

.shipment {
  line-height: 1.4;
  padding: 0 20rpx;
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;

  .locate,
  .item {
    min-height: 100rpx;
    padding: 20px;
    display: flex;
  }

  .locate {
    .user {
      margin-left: 8px;
      margin-top: 5px;
      font-size: 26rpx;
      color: #444;
    }

    .address {
      margin-left: 8px;
      font-size: 24rpx;
      color: #666;
    }
  }

  .item {
    border-bottom: 1rpx solid #eee;
    position: relative;

    .message {
      font-size: 26rpx;
      color: #444;
    }

    .date {
      font-size: 24rpx;
      color: #666;
    }
  }
}

//书本信息
.bookItemOrder {
  margin: 0 auto;
  width: 100%;
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
//快捷评价按钮
.quickBtn {
  margin-right: 10px;
  height: 28px;
  width: 80px;
  line-height: 28px;
  font-size: 15px;
  text-align: center;
  color: gray;
  border: 1px solid rgb(217, 213, 213);
  border-radius: 15px;
}
.action {
  width: 100%;
  background-color: white;
  padding: 10px 0;
  display: flex;
  padding-left: 40%;

  .commentBtn {
    color: orangered;
    border: 1px solid orangered;
  }
}

// 总计金额部分
.total {
  padding: 15px 0;
  background-color: white;

  .row {
    font-size: 15px;
    color: rgb(90, 87, 87);
    display: flex;
    margin: 6px 12px;
    justify-content: space-between;
    .keyMoney {
      color: orangered;
      font-size: 18px;
    }
  }
}
//订单编号
.detailNumber {
  line-height: 1;
  padding: 30rpx 20rpx 0;
  font-size: 26rpx;
  color: #666;
  border-radius: 10rpx;
  background-color: #fff;
  .title {
    font-size: 30rpx;
    color: #444;
  }

  .row {
    padding: 20rpx 0;

    .item {
      padding: 10rpx 0;
      display: flex;
      align-items: center;
    }

    .copy {
      border-radius: 20rpx;
      font-size: 20rpx;
      border: 1px solid #ccc;
      padding: 5rpx 10rpx;
      margin-left: 10rpx;
    }
  }
}

// 底部操作
.toolbar-height {
  height: 100rpx;
  box-sizing: content-box;
}

.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;

  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
  box-sizing: content-box;

  .button {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 200rpx;
    height: 72rpx;
    margin-left: 15rpx;
    font-size: 26rpx;
    border-radius: 72rpx;
    border: 1rpx solid #ccc;
    color: #444;
  }
  // 用order指定排序顺序
  .delete {
    order: 4;
  }

  .button {
    order: 3;
  }

  .secondary {
    order: 2;
    color: orangered;
    border-color: orangered;
  }

  .primary {
    order: 1;
    color: #fff;
    background-color: orangered;
  }
}
// 弹层部分
.popup-root {
  padding: 30rpx 30rpx 0;
  border-radius: 10rpx 10rpx 0 0;
  overflow: hidden;

  .title {
    font-size: 30rpx;
    text-align: center;
    margin-bottom: 30rpx;
  }

  .description {
    font-size: 28rpx;
    padding: 0 20rpx;

    .tips {
      color: #444;
      margin-bottom: 12rpx;
    }

    .cell {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15rpx 0;
      color: #666;
      .icon {
        width: 18px;
        height: 18px;
        border: 1px solid #ccc;
        border-radius: 50%;
        margin-right: 10px;
        background-color: white;
      }
      .active {
        border: 1px solid orangered;
        background-color: orangered;
      }
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 0 35rpx;
    font-size: 28rpx;
    color: #444;

    .button {
      flex: 1;
      height: 64rpx;
      text-align: center;
      line-height: 64rpx;
      margin: 0 20rpx;
      color: #444;
      border-radius: 72rpx;
      border: 1rpx solid #ccc;
    }

    .primary {
      color: #fff;
      background-color: orangered;
      border: none;
    }
  }
}
</style>

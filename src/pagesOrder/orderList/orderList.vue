<template>
  <scroll-view
    scroll-y="true"
    class="orderList"
    @scrolltolower="onScrolltolower"
    enable-back-to-top
  >
    <!-- tab -->
    <view class="orderListTab">
      <view
        v-for="item in orderTitle"
        :key="item.type"
        class="orderListTabItem"
        :class="{ active: item.type === currentType }"
        @tap="onTapTab(item.type)"
      >
        {{ item.name }}
      </view>
    </view>
    <!-- 订单列表 -->
    <template v-if="orderList.length > 0">
      <navigator
        :url="`/pagesOrder/orderDetail/orderDetail?order_id=${item.order.order_id}`"
        open-type="navigate"
        hover-class="none"
        class="orderListContent"
        v-for="(item, index) in orderList"
        :key="index"
      >
        <!-- 上部分时间 -->
        <view class="contentTop">
          <view>{{ item.order.buildTime }}</view>
          <view>{{ item.order.order_status }}</view>
        </view>
        <!-- 内容部分 -->
        <view class="orderListItem" v-for="book in item.orderDetailList" :key="book.book_id">
          <view class="orderListItemImg"
            ><image class="ItemImg" :src="book.main_picture" mode="aspectFit"> </image
          ></view>
          <view class="orderListItemInfo">
            <view class="orderListItemName">{{ book.book_name }}</view>
            <view class="orderListItemSpec">规格</view>
          </view>
          <view class="orderListItemCount"> x{{ book.detail_number }} </view>
        </view>
        <!-- 总计数量和金额 -->
        <view class="orderListTotalPart">
          <view class="orderListTotal"
            >总计数量：{{ item.order.number }} 实付金额：￥<text style="font-size: 17px">{{
              item.order.order_money
            }}</text></view
          ></view
        >
        <!-- 按钮操作区 -->
        <view class="orderListActionPart">
          <!-- 待付款状态：显示去支付按钮 -->
          <template v-if="item.order.order_status === '待付款'">
            <view class="button primary">去支付</view>
          </template>
          <template v-else>
            <navigator
              catchtap
              class="button secondary"
              :url="`/pagesOrder/orderCreate/orderCreate?order_id=${item.order.order_id}&way=${way}`"
              hover-class="none"
            >
              再次购买
            </navigator>
            <!-- 待收货状态: 展示确认收货 -->
            <view
              v-if="item.order.order_status === '待收货'"
              class="button primary"
              @tap.stop="onOrderConfirm(item)"
              >确认收货</view
            >
            <!-- 待评价展示 -->
            <view v-else-if="item.order.order_status === '待评价'" class="button comment"
              >评价</view
            >
          </template>
          <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
          <view
            @tap.stop="onOrderDete(item)"
            v-if="
              item.order.order_status === '待评价' ||
              item.order.order_status === '已完成' ||
              item.order.order_status === '已退款' ||
              item.order.order_status === '已取消'
            "
            class="button delete"
            >删除订单</view
          >
        </view>
      </navigator>

      <!-- 底部提示文字 -->
      <view class="loading-text" :style="{ paddingBottom: safeAreaInsetsBottom + 'px' }">
        {{ finish ? '没有更多数据~' : '正在加载...' }}
      </view>
    </template>
    <template v-else>
      <view class="noData" :style="{ display: loading ? 'none' : 'block' }">
        <view class="noDataIcon">
          <uni-icons type="shop" size="240" color="orangered"></uni-icons>
        </view>
        <view class="noDataText">您竟无此类订单，快去首页选购吧</view>
        <navigator
          class="goHomeBtn"
          url="/pages/index/index"
          open-type="switchTab"
          hover-class="none"
          >首页
        </navigator>
      </view>
    </template>
  </scroll-view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {
  getOrderBookListByStatusAPI,
  findCountStatusAPI,
  updateDaiPingJiaAPI,
  deleteMemberOrderAPI,
} from '@/apis/order'
import { useMemberStore } from '@/stores/modules/member'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const safeAreaInsetsBottom = safeAreaInsets.bottom
const memberStore = useMemberStore()
const loading = ref(true)
const way = 'again'
const user_id = computed(() => memberStore.profile.user_id)
const query = defineProps({
  type: Number,
})
const type = computed(() => query.type)

const currentType = ref(0)
const orderTitle = [
  { type: 0, name: '全部' },
  { type: 1, name: '待付款' },
  { type: 2, name: '待发货' },
  { type: 3, name: '待收货' },
  { type: 4, name: '待评价' },
  { type: 5, name: '已退款' },
]
const orderList = ref([])
const page = ref(1)
const pageSize = ref(4)
const finish = ref(false)
const statusCountList = ref([])

// 计算属性得到状态
const order_status = computed(
  () => orderTitle.find((item) => item.type === currentType.value)?.name,
)

const takeOrderType = async () => {
  if (type.value != null) {
    currentType.value = type.value
    getOrderList()
  }
}
// 获取各状态的数量
const findCountStatus = async () => {
  const res = await findCountStatusAPI(user_id.value)
  statusCountList.value = res.result
}
const getOrderList = async () => {
  if (finish.value) {
    uni.showToast({
      title: '没有更多了',
      icon: 'none',
    })
    return
  }
  // 设置loading
  loading.value = true
  const res = await getOrderBookListByStatusAPI(
    order_status.value,
    user_id.value,
    page.value,
    pageSize.value,
  )
  orderList.value.push(...res.result)
  loading.value = false
  const totalCount = computed(
    () => statusCountList.value.find((item) => item.status === order_status.value)?.count,
  )
  const orderTotalPage = computed(() => Math.ceil(totalCount.value / pageSize.value))
  if (page.value < orderTotalPage.value) {
    page.value++
  } else {
    finish.value = true
  }
}
// 下滑加载更多
const onScrolltolower = () => {
  getOrderList()
}
const onTapTab = (type) => {
  currentType.value = type
  // 初始化数据后再加载
  resetData()
  getOrderList()
}
// 重置数据
const resetData = () => {
  orderList.value = []
  page.value = 1
  finish.value = false
}

// 按钮操作
// 是否为开发环境
// 确认收货
const onOrderConfirm = (item) => {
  if (item.order.order_status === '待收货') {
    // 二次确认弹窗
    uni.showModal({
      content: '为保障您的权益，请收到货并确认无误后，再确认收货',
      success: async (success) => {
        if (success.confirm) {
          await updateDaiPingJiaAPI(item.order.order_id, '待评价')

          resetData()
          getOrderList()
        }
      },
    })
  }
}
// 删除订单
const onOrderDete = (item) => {
  uni.showModal({
    content: '确认删除订单',
    success: async (success) => {
      if (success.confirm) {
        await deleteMemberOrderAPI(item.order.order_id)
        // 重新加载
        resetData()
        getOrderList()
      }
    },
  })
}
onLoad(async () => {
  await findCountStatus().then(() => {
    takeOrderType()
  })
})
</script>

<style lang="scss">
[v-cloak] {
  display: none !important;
}
page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f7f4f4;
}

.orderList {
  flex: 1;
  height: 0;
  .orderListTab {
    background-color: #fff;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-around;
    .orderListTabItem {
      text-align: center;
      width: 16.6%;
      font-size: 14px;
      color: #929090;
    }
    .active {
      border-left: 1px solid rgb(246, 245, 245, 0.9);
      border-right: 1px solid rgb(246, 245, 245, 0.9);
      border-bottom: 4px solid rgb(220, 85, 36);
    }
  }
}
.orderListContent {
  background-color: #fff;
  margin-top: 10px;
  padding: 10px 15px;
  .contentTop {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #908f8f;
    margin-bottom: 10px;
  }
  .orderListItem {
    height: 120px;
    display: flex;
    position: relative;
    .orderListItemImg {
      width: 100px;
      height: 120px;
      margin-right: 10px;
      border: 1px solid #dcd4d4;
      .ItemImg {
        width: 100px;
        height: 120px;
      }
    }
    .orderListItemInfo {
      margin-top: 10px;
      .orderListItemName {
        font-size: 17px;
        font-weight: 600;
        color: #4f4d4d;
      }
      .orderListItemSpec {
        margin-top: 40px;
        padding: 5px 10px;
        color: #4c4b4b;
        background-color: rgb(234, 230, 230);
        font-size: 13px;
      }
    }
    .orderListItemCount {
      position: absolute;
      color: #848181;
      top: 10%;
      right: 2%;
    }
  }
  .orderListTotalPart {
    margin-top: 20px;
    width: 100%;
    height: 20px;
    line-height: 20px;
    position: relative;
    .orderListTotal {
      position: absolute;
      right: 0;
      font-size: 14px;
      color: #858282;
    }
  }
  .orderListActionPart {
    height: 50px;
    display: flex;
    margin-top: 10px;
    border-top: 1px solid rgb(245, 239, 239);
    flex-direction: row-reverse; /* 从右往左排列 */
    .button {
      margin-left: 10px;
      margin-top: 15px;
      line-height: 28px;
      height: 28px;
      width: 80px;
      border: 1px solid orangered;
      text-align: center;
      border-radius: 15px;
      font-size: 15px;
      color: rgb(241, 81, 23);
    }
    .primary {
      order: 1;
      background-color: orangered;
      color: white;
    }
    .secondary {
      order: 2;
    }
    .comment {
      order: 3;
    }
    .delete {
      order: 4;
    }
  }
}
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
//空订单情况
.noData {
  margin-top: 50px;
  text-align: center;
  .noDataText {
    font-size: 18px;
    color: #828080;
  }
  .goHomeBtn {
    width: 120px;
    margin: 30px auto;
    margin-top: 20px;
    border: 1px solid orangered;
    padding: 5px 20px;
    border-radius: 20px;
    color: orangered;
    font-size: 17px;
  }
}
</style>

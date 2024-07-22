<template>
  <!-- uni-ui 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <AddressPanel @close="popup?.close()" :userAddresses="addressList" @choose="onChoose" />
  </uni-popup>
  <scroll-view
    class="scrollViewCart"
    :scroll-y="true"
    @scrolltolower="onScrolltolower"
    enable-back-to-top
  >
    <!-- 地址选择 -->
    <view class="contentCart" @tap="openPopup">
      <view class="chooseAddress"
        ><uni-icons type="location" size="13"></uni-icons>配送至：
        <view class="addressView" v-if="!selectAddress && !defaultAddress"
          >请选择配送地址<uni-icons type="right" size="12"></uni-icons>
        </view>
        <view class="addressView" v-if="defaultAddress && !selectAddress">
          {{ defaultAddress.bigAddress }} {{ defaultAddress.fullAddress }}</view
        >
        <view class="addressView" v-else>
          {{ selectAddress.bigAddress }} {{ selectAddress.fullAddress }}</view
        >
      </view>
    </view>
    <!-- 已登录: 显示购物车 -->
    <template v-if="memberStore.profile">
      <!-- 购物车列表 -->
      <view class="cartList" v-if="cartList.length > 0">
        <!-- 滑动操作分区 -->
        <uni-swipe-action>
          <!-- 滑动操作项 -->
          <uni-swipe-action-item v-for="item in cartList" :key="item.skuId" class="cart-swipe">
            <view class="cartItem">
              <!-- 选中状态 -->
              <view
                @tap="changeChecked(item)"
                class="cart-checked"
                :class="{ checked: item.isSelected === 1 }"
                ><uni-icons
                  type="checkmarkempty"
                  size="13"
                  color="white"
                  v-show="item.isSelected === 1"
                ></uni-icons
              ></view>
              <view class="imagePart"
                ><image class="cartImage" :src="item.main_picture" mode="aspectFit"
              /></view>
              <view class="infoPart">
                <view class="cartBookName">{{ item.book_name }}</view>
                <view class="cartAuthor">{{ item.author }}</view>
                <view class="cartPress">{{ item.press }}</view>
                <view class="cartPrice">¥{{ item.price }}</view>
              </view>
              <view class="countPart"
                ><view
                  class="numberCountBtn"
                  @tap="decreaseCount(item)"
                  :style="{ color: disableDecrease ? 'gray' : 'black' }"
                  >-</view
                >
                <view class="numberCountNum">{{ item.number }}</view>
                <view
                  class="numberCountBtn"
                  @tap="addCount(item)"
                  :style="{ color: addDisable ? 'gray' : 'black' }"
                  >+</view
                ></view
              >
            </view>
            <!-- 右侧删除按钮 -->
            <template #right>
              <view class="cart-swipe-right">
                <button class="button delete-button" @tap="onDeleteCart(item.cart_id)">删除</button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>

      <!-- 购物车空状态 -->
      <view class="cart-blank" v-else>
        <image src="/static/images/blank_cart.png" class="image" />
        <text class="text">购物车还是空的，快来挑选好货吧</text>
        <navigator open-type="switchTab" url="/pages/index/index" hover-class="none">
          <button class="button">去首页看看</button>
        </navigator>
      </view>

      <!-- 吸底工具栏 -->
      <view class="toolbar">
        <!-- 全选 -->
        <view @tap="onChangeSelectedAll" class="all-checked">
          <view class="all-checked-icon" :class="{ checked: isSelectedAll }">
            <uni-icons
              type="checkmarkempty"
              size="13"
              color="white"
              v-show="isSelectedAll"
            ></uni-icons
          ></view>
          <view class="all-checked-text">全选</view></view
        >
        <view>
          <text class="total-text">合计:</text>
          <text class="total-money">￥{{ selectedCartListMoney }}</text></view
        >
        <view class="payment-button disabled" @tap="gotoPayment">
          去结算({{ selectedCartListCount }})
        </view>
      </view>
    </template>
    <!-- 未登录: 提示登录 -->
    <view class="login-blank" v-else>
      <text class="text">登录后可查看购物车中的商品</text>
      <navigator url="/pages/login/login" hover-class="none">
        <button class="button">去登录</button>
      </navigator>
    </view>
    <!-- 猜你喜欢 -->
    <guessLike ref="guessLikeRef"></guessLike>
  </scroll-view>
</template>

<script setup>
import {
  findBookCartByUserIdAPI,
  updateCartSelectedAPI,
  updateCartNumberAPI,
  deleteMemberCartAPI,
} from '@/apis/cart'
import { useMemberStore } from '@/stores/modules/member'
import { onShow } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { getAddressListByIdAPI } from '@/apis/address'
import { useAddressStore } from '@/stores/modules/address'
import AddressPanel from '@/components/AddressPanel.vue'
import guessLike from '@/components/guessLike.vue'
// 获取屏幕边界到安全区域距离
const addressStore = useAddressStore()
const memberStore = useMemberStore()
const cartList = ref([])
const user_id = computed(() => memberStore.profile.user_id)
const selectAddress = ref('')
const popup = ref(null)
// 处理地址选择
const onChoose = (e) => {
  // 修改选中地址 并且将其一起提交到新建订单
  selectAddress.value = e
  // 将stores数据改变 使得新建页面有地址数据
  addressStore.selectedAddress = e
  popup.value?.close()
}
const openPopup = () => {
  if (!user_id.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'error',
      duration: 500,
    })
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/login',
      })
    }, 500)
    return
  } else {
    popup.value?.open()
  }
}
// 购买数量
const disableDecrease = ref(true)
const addDisable = ref(false)
const addCount = async (item) => {
  if (item.number >= item.stock) {
    addDisable.value = true
    return
  } else {
    // 发送请求加数量
    item.number++
    await updateCartNumberAPI(item.cart_id, item.number)
    if (disableDecrease.value) {
      disableDecrease.value = false
    }
  }
}
// 减少数量
const decreaseCount = async (item) => {
  if (item.number > 1) {
    item.number--
    await updateCartNumberAPI(item.cart_id, item.number)
    if (item.number === 1) {
      disableDecrease.value = true
      return
    }
  } else {
    return
  }
}
// 处理勾选
const changeChecked = async (item) => {
  item.isSelected = item.isSelected === 1 ? 0 : 1
  await updateCartSelectedAPI(item.cart_id, item.isSelected)
}

// 计算全选状态
const isSelectedAll = ref(false)
// 全选处理
const onChangeSelectedAll = async () => {
  // 全选状态取反
  isSelectedAll.value = !isSelectedAll.value
  // 前端数据更新
  cartList.value.forEach(async (item) => {
    item.isSelected = isSelectedAll.value ? 1 : 0
    await updateCartSelectedAPI(item.cart_id, item.isSelected)
  })
}

//获取user的购物车
const getCartList = async () => {
  if (!user_id.value) return
  const res = await findBookCartByUserIdAPI(parseInt(user_id.value))
  if (res.code != '-1') {
    cartList.value = res.result
    console.log(cartList.value)
    const isSelectedAllComputed = computed(() => {
      return cartList.value.length && cartList.value.every((v) => v.selected)
    })
    isSelectedAll.value = isSelectedAllComputed.value
  }
}
//获取user的地址列表
const addressList = ref([])
const defaultAddress = ref('')
const getAddressListById = async () => {
  if (!user_id.value) return
  const res = await getAddressListByIdAPI(parseInt(user_id.value))
  addressList.value = res.result
  defaultAddress.value = addressList.value.find((item) => item.isDefault === 1)
  addressStore.setDefaultAddress(defaultAddress.value)
}
// 加载更多
const guessLikeRef = ref(null)
const onScrolltolower = () => {
  guessLikeRef.value.getMore()
}

// 计算选中单品列表
const selectedCartList = computed(() => {
  return cartList.value.filter((v) => v.isSelected === 1)
})

// 计算选中总件数
const selectedCartListCount = computed(() => {
  return selectedCartList.value.reduce((sum, item) => sum + item.number, 0)
})

// 计算选中总金额
const selectedCartListMoney = computed(() => {
  return selectedCartList.value.reduce((sum, item) => sum + item.number * item.price, 0).toFixed(2)
})
// 点击删除按钮
const onDeleteCart = (cart_id) => {
  // 弹窗二次确认
  uni.showModal({
    content: '是否删除',
    success: async (res) => {
      if (res.confirm) {
        // 后端删除单品
        await deleteMemberCartAPI(cart_id)
        // 重新获取列表
        getCartList()
      }
    },
  })
}
onShow(() => {
  getCartList()
  getAddressListById()
})
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}

// 滚动容器
.scrollViewCart {
  flex: 1;
  height: 0;
}
.chooseAddress {
  padding-left: 5px;
  display: flex;
  background-color: white;
  overflow: hidden;
  height: 25px;
  font-size: 12px;
  line-height: 22px;
  color: gray;
  .addressView {
    margin-left: 5px;
  }
}

.checked {
  background-color: orangered;
}
.cartItem {
  background-color: white;
  width: 100%;
  height: 120px;
  display: flex;
  position: relative;
  .cartList {
    margin-top: 5px;
  }
  .cart-checked {
    margin-top: 45px;
    height: 18px;
    width: 18px;
    text-align: center;
    line-height: 18px;
    border-radius: 50%;
    border: 1px solid #dcd4d4;
  }
  .imagePart {
    margin: 5px;
    width: 90px;
    height: 100px;
    line-height: 100px;
    border: 1px solid #dcd4d4;
    .cartImage {
      width: 90px;
      height: 100px;
    }
  }
  .infoPart {
    margin-left: 10px;
    .cartBookName {
      margin: 3px 0;
      font-weight: 600;
      font-size: 18px;
    }
    .cartAuthor,
    .cartPress {
      font-size: 13px;
      color: gray;
    }
    .cartPrice {
      font-weight: 600;
      color: orangered;
      font-size: 16px;
      margin-top: 20px;
    }
  }
  .countPart {
    position: absolute;
    right: 10px;
    bottom: 15px;
    display: flex;
    .numberCountNum {
      margin: 0 10px;
    }
    .numberCountBtn {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      font-size: 19px;
      background-color: #f4eeee;
    }
  }
}
// 删除按钮
.cart-swipe-right {
  display: flex;
  height: 100%;

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    padding: 6px;
    line-height: 1.5;
    color: #fff;
    font-size: 26rpx;
    border-radius: 0;
  }

  .delete-button {
    background-color: #cf4444;
  }
}

// 空状态
.cart-blank,
.login-blank {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh;
  .image {
    width: 400rpx;
    height: 281rpx;
  }
  .text {
    color: #444;
    font-size: 26rpx;
    margin: 20rpx 0;
  }
  .button {
    width: 240rpx !important;
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 20rpx;
    font-size: 26rpx;
    border-radius: 60rpx;
    color: #fff;
    background-color: orangered;
  }
}

// 吸底工具栏
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 60px;
  background-color: white;
  border-bottom: 1rpx solid #a9a7a7;
  padding-bottom: 2px;
  display: flex;
  line-height: 60px;
  justify-content: space-between;
  .all-checked {
    margin-left: 5px;
    height: 20px;
    line-height: 20px;
    width: 60px;
    display: flex;
    margin-top: 20px;
    .all-checked-icon {
      text-align: center;
      height: 18px;
      width: 18px;
      line-height: 18px;
      border-radius: 50%;
      border: 1px solid #dcd4d4;
    }
    .all-checked-text {
      font-size: 15px;
      color: rgb(145, 143, 143);
    }
    .checked {
      background-color: orangered;
    }
  }
  .total-text {
    font-size: 14px;
  }
  .total-money {
    font-size: 18px;
    font-weight: 600;
    color: orangered;
  }
  .payment-button {
    overflow: hidden;
    margin-top: 10px;
    height: 40px;
    width: 120px;
    line-height: 40px;
    font-size: 15px;
    background-color: orangered;
    color: white;
    border-radius: 20px;
    text-align: center;
    margin-right: 5px;
  }
}
</style>

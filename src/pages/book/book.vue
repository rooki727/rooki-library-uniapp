<template>
  <scroll-view
    :scroll-y="true"
    @scrolltolower="onScrolltolower"
    enable-back-to-top
    class="bookDetail"
    :style="{ paddingTop: navbarHeight + 'px' }"
  >
    <navigator open-type="navigateBack" hover-class="none">
      <view><uni-icons type="left" size="28"></uni-icons> </view>
    </navigator>
    <!-- 轮播图 -->
    <view class="carousel">
      <swiper
        indicator-dots
        autoplay="false"
        circular
        class="swiper"
        indicator-active-color="orange"
        @change="onchangeSwiper"
      >
        <swiper-item v-for="(item, index) in pictureList" :key="index">
          <image :src="item.url" mode="aspectFit" class="image" @tap="onTapImage(item.url)" />
        </swiper-item>
      </swiper>
      <view class="indicator">
        <text class="current">{{ currentIndex + 1 }}</text>
        <text class="split">/</text>
        <text class="total">{{ pictureList.length }}</text>
      </view>
    </view>

    <!-- 书本信息 -->
    <view class="bookInfo">
      <view class="topPart">
        <view class="bookPrice"
          >现价￥<text style="font-size: 24px">{{ book.price }}</text></view
        >
        <view class="saleNumber">已售 {{ book.sale_number }}</view>
      </view>
      <view class="bookName">{{ book.book_name }}|{{ book.author }}|{{ book.category }}</view>
      <view @tap="openPopupSku('both')">
        <view class="chooseItem" v-if="!chooseBookName"
          >请选择书本<uni-icons type="right" size="16"></uni-icons
        ></view>
        <view class="chooseItem" v-else>已选择： {{ chooseBookName }}</view>
      </view>

      <view @tap="openPopup('address')">
        <view class="chooseItem" v-if="!selectAddress && !defaultAddress"
          >请选择收获地址<uni-icons type="right" size="16"></uni-icons
        ></view>
        <view class="chooseItem" v-else-if="selectAddress"
          >送至 {{ selectAddress.bigAddress }} {{ selectAddress.fullAddress }}</view
        >
        <view class="chooseItem" v-else-if="defaultAddress && !selectAddress"
          >送至 {{ defaultAddress.bigAddress }} {{ defaultAddress.fullAddress }}</view
        >
      </view>
      <view class="chooseItem" @tap="openPopup('service')"
        >服务·包邮·秒退款·七天无理由<uni-icons type="right" size="16"></uni-icons
      ></view>
      <view class="introduce">
        <view class="introduceTitle">· 书本简介 ·</view>
        <view class="introduceContent">{{ book.introduce }}</view>
      </view>
      <view class="mainImgPart"
        ><image class="mainImg" :src="book.main_picture" mode="aspectFit"
      /></view>
    </view>

    <!-- 好书推荐 -->
    <view><guessLike ref="guessLikeRef"></guessLike></view>
  </scroll-view>
  <!-- 底部操作 -->
  <view class="goods-carts">
    <uni-goods-nav
      :options="options"
      :fill="true"
      :button-group="buttonGroup"
      @click="onClick"
      @buttonClick="buttonClick"
    />
  </view>
  <!-- uni-ui 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <AddressPanel
      v-if="popupName === 'address'"
      @close="popup?.close()"
      :userAddresses="addressList"
      @choose="onChoose"
    />
    <ServicePanel v-if="popupName === 'service'" @close="popup?.close()" />
  </uni-popup>
  <!-- sku弹出层 -->
  <uni-popup ref="popupSku" type="bottom" background-color="#fff">
    <bookSku
      @refresh="refresh"
      @close="popupSku?.close()"
      :btnName="btnName"
      :book="book"
      @choose="onChooseSku"
    ></bookSku>
  </uni-popup>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getBookByIdAPI } from '@/apis/book'
import guessLike from '@/components/guessLike.vue'
import { useAddressStore } from '@/stores/modules/address'
import { getAddressListByIdAPI } from '@/apis/address'
import { useMemberStore } from '@/stores/modules/member'
import AddressPanel from '@/components/AddressPanel.vue'
import ServicePanel from './components/ServicePanel.vue'
import { getCartCountAPI } from '@/apis/cart'
import bookSku from './components/bookSku.vue'
import { getBookCollectAPI, addBookCollectAPI, deleteBookCollectAPI } from '@/apis/collection'
import { onShow } from '@dcloudio/uni-app'
const memberStore = useMemberStore()
const user_id = computed(() => memberStore.profile.user_id)
const addressStore = useAddressStore()
//获取屏幕边界
const { safeArea } = uni.getSystemInfoSync()

//获取导航栏高度
const navbarHeight = safeArea?.top + 5
const cartCount = ref(0)
const isCollection = ref(false)
// sku定义参数
const popupSku = ref(null)
const btnName = ref('')
const query = defineProps({
  book_id: Number,
})
const chooseBookName = ref('')
const onChooseSku = (e) => {
  chooseBookName.value = e
}
//书本
const book = ref({})
const pictureList = ref([])
const book_id = computed(() => query.book_id)
const openPopupSku = (name) => {
  btnName.value = name
  popupSku.value?.open()
}
// 定义底部操作栏
const options = ref([
  {
    icon: 'chat',
    text: '客服',
  },
  {
    icon: 'star',
    text: '收藏',
  },
  {
    icon: 'cart',
    text: '购物车',
    info: 0,
  },
])
const buttonGroup = [
  {
    text: '加入购物车',
    backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
    color: '#fff',
  },
  {
    text: '立即购买',
    backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
    color: '#fff',
  },
]
// 定义操作栏函数
const onClick = async (e) => {
  switch (e.content.text) {
    case '购物车':
      uni.switchTab({
        url: '/pages/cart/cart',
      })
      break
    case '收藏':
      if (isCollection.value) {
        await deleteBookCollectAPI(user_id.value, book_id.value).then((res) => {
          if (res.result) {
            isCollection.value = false
            uni.showToast({
              title: '取消收藏',
              icon: 'none',
            })
            options.value[1].icon = 'star'
          }
        })
      } else {
        await addBookCollectAPI(user_id.value, book_id.value).then((res) => {
          if (res.result) {
            isCollection.value = true
            options.value[1].icon = 'star-filled'
            uni.showToast({
              title: '收藏成功',
              icon: 'success',
            })
          }
        })
      }
      break
    case '客服':
      uni.showToast({
        title: `点击${e.content.text}`,
        icon: 'none',
      })
      break
    default:
      break
  }
}
const buttonClick = (e) => {
  switch (e.content.text) {
    case '加入购物车':
      openPopupSku('加入购物车')
      break
    case '立即购买':
      openPopupSku('立即购买')
      break
    default:
      break
  }
}
// 点击完添加购物车后 刷新
const refresh = (val) => {
  if (val === 'refreshCartCount') {
    getCartCount()
  }
}
const getBookById = () => {
  getBookByIdAPI(book_id.value).then((res) => {
    book.value = res.result
    pictureList.value = res.result.pictureList
  })
}
const guessLikeRef = ref(null)
const onScrolltolower = () => {
  guessLikeRef.value.getMore()
}
// 轮播大图设置
const currentIndex = ref(0)
const onchangeSwiper = (e) => {
  currentIndex.value = e.detail?.current
}
// 点击图片时
const onTapImage = (url) => {
  // 大图预览
  uni.previewImage({
    current: url,
    // book.pictureList
    urls: [pictureList.value[0].url, pictureList.value[1].url, pictureList.value[2].url],
  })
}

// 获取地址
const addressList = ref([])
const defaultAddress = ref('')
const getAddressListById = async () => {
  if (!user_id.value) return
  const res = await getAddressListByIdAPI(parseInt(user_id.value))
  addressList.value = res.result
  defaultAddress.value = addressList.value.find((item) => item.isDefault === 1)
  addressStore.setDefaultAddress(defaultAddress.value)
}
// 弹出层处理
const popup = ref(null)
const selectAddress = ref('')

// 弹出层条件渲染
const popupName = ref('address' | 'service')
const openPopup = (name) => {
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
    // 修改弹出层名称
    popupName.value = name
    // 打开弹出层
    popup.value?.open()
  }
}
const onChoose = (e) => {
  // 修改选中地址 并且将其一起提交到新建订单
  selectAddress.value = e
  // 将stores数据改变 使得新建页面有地址数据
  addressStore.selectedAddress = e
  popup.value?.close()
}
//获取用户购物车数量
const getCartCount = async () => {
  if (!user_id.value) return
  const res = await getCartCountAPI(parseInt(user_id.value))
  options.value[2].info = res.result
  cartCount.value = res.result
}
// 获取用户书本收藏情况
const getBookCollect = async () => {
  if (!user_id.value) return
  const res = await getBookCollectAPI(parseInt(user_id.value), parseInt(book_id.value))
  if (res.code != '-1' && res.result) {
    options.value[1].icon = 'star-filled'
    isCollection.value = true
  }
}

onShow(async () => {
  getBookById()
  await getAddressListById()
  await getCartCount()
  await getBookCollect()
})
</script>

<style lang="scss">
page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f7f4f4;
}
.bookDetail {
  flex: 1;
  height: 0;
}
// 价格区
.topPart {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  height: 60px;
  background-color: white;
  .bookPrice {
    color: rgb(255, 85, 0);
    font-size: 18px;
    font-weight: 600;
    line-height: 60px;
    margin-left: 10px;
  }
  .saleNumber {
    font-size: 14px;
    color: gray;
    line-height: 60px;
    margin-right: 10px;
  }
}

// 图名
.bookName {
  font-size: 18px;
  padding-left: 10px;
  font-weight: 600;
  padding-top: 5px;
  background-color: white;
  min-height: 50px;
}
.chooseItem {
  margin-top: 1px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
  font-size: 14px;
  color: #676666;
}
// 内容简介
.introduce {
  margin-top: 5px;
  height: 350px;
  width: 100%;
  overflow: hidden;
  background-color: #f4f0e4;
  .introduceTitle {
    font-size: 21px;
    font-weight: 600;
    color: rgb(103, 76, 59);
    background-color: white;
    width: 150px;
    text-align: center;
    margin: 15px auto;
    border-radius: 15px;
    height: 30px;
    line-height: 30px;
  }
  .introduceContent {
    font-size: 14px;
    padding: 10px 10px;
  }
}
.mainImgPart {
  height: 500rpx;
  width: 100%;
  .mainImg {
    height: 500rpx;
    width: 100%;
  }
}
// 轮播图
.carousel {
  height: 500rpx;
  background-color: #fff;
  position: relative;
  .swiper {
    height: 500rpx !important;
  }
  .navigator,
  .image {
    width: 100%;
    height: 500rpx;
  }
}
// 指示点
.indicator {
  height: 40rpx;
  padding: 0 24rpx;
  line-height: 40rpx;
  border-radius: 30rpx;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  bottom: 30rpx;
  right: 30rpx;
  .current {
    font-size: 26rpx;
  }
  .split {
    font-size: 24rpx;
    margin: 0 1rpx 0 2rpx;
  }
  .total {
    font-size: 24rpx;
  }
}

// 底部操作
.goods-carts {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  position: fixed;
  left: 0;
  right: 0;
  /* #ifdef H5 */
  left: var(--window-left);
  right: var(--window-right);
  /* #endif */
  bottom: 0;
}
.uni-tab__cart-sub-left {
  .uni-icons {
    color: rgb(255, 94, 0) !important;
  }
}
</style>

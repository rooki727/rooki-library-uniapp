<template>
  <view class="bookSku">
    <!-- 关闭按钮 -->
    <view class="close"><uni-icons type="close" size="24" @tap="emit('close')"></uni-icons></view>
    <view class="topPart"
      ><image class="skuImage" :src="book.main_picture" mode="aspectFit" />
      <view class="skubookinfo">
        <view class="skuName">{{ book.book_name }}</view>
        <view class="skuAuthor">{{ book.author }} 编</view>
        <view class="skuPress">出版社</view>
        <view class="skuStock">库存：{{ book.stock }}</view>
        <view class="skuPrice">￥{{ book.price }}</view>
        <view class="skuSelected">已选：红楼梦</view>
      </view>
      <view class="skuSpec">
        <view class="skuSpecTitle">规格</view>
        <view
          class="skuSpecContent"
          :class="{ active: isSelected }"
          @tap="onSelect(book.book_name)"
          >{{ book.book_name }}</view
        >
      </view>
      <view class="numberCount">
        <view class="numberCountTitle">购买数量</view>
        <view class="numberCountInput">
          <view
            class="numberCountBtn"
            @tap="decreaseCount"
            :style="{ color: disableDecrease ? 'gray' : 'black' }"
            >-</view
          >
          <view class="numberCountNum">{{ count }}</view>
          <view
            class="numberCountBtn"
            @tap="addCount"
            :style="{ color: addDisable ? 'gray' : 'black' }"
            >+</view
          >
        </view>
      </view>
    </view>
    <!-- 按钮 -->
    <view class="bothBtn" v-if="btnName === 'both'">
      <view class="btnCart" @tap="addCart">加入购物车</view>
      <view class="btnBuy" @tap="buyNow">立即购买</view>
    </view>
    <view
      v-else
      class="btn"
      :style="{ 'background-color': btnName === '加入购物车' ? 'orange' : 'orangered' }"
      @tap="onBtn(btnName)"
      >{{ btnName }}</view
    >
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useMemberStore } from '@/stores/modules/member'
import { addBookCartAPI } from '@/apis/cart'
import { addOrderListAPI, addOrderDetailAPI } from '@/apis/order'
import dayjs from 'dayjs'
const memberStore = useMemberStore()
const user_id = computed(() => memberStore.profile.user_id)
const emit = defineEmits(['close', 'choose', 'refresh'])
const props = defineProps({
  btnName: String,
  book: Object,
})
const btnName = computed(() => props.btnName)
const book = computed(() => props.book)
// 处理规格选用
const isSelected = ref(false)
const onSelect = (name) => {
  isSelected.value = !isSelected.value
  if (isSelected.value) {
    emit('choose', name)
  } else {
    emit('choose', null)
  }
}
// 购买数量
const count = ref(1)
const disableDecrease = ref(true)
const addDisable = ref(false)
const addCount = () => {
  if (count.value >= book.value.stock) {
    addDisable.value = true
  } else {
    count.value++
    if (disableDecrease.value) {
      disableDecrease.value = false
    }
  }
}
const decreaseCount = () => {
  if (count.value > 1) {
    count.value--
    if (count.value === 1) {
      disableDecrease.value = true
    }
  } else {
    return
  }
}

// 处理按钮
const buyNow = async () => {
  if (!isSelected.value) {
    uni.showToast({
      title: '请选择规格',
      icon: 'error',
    })
    return
  } else {
    if (!user_id.value) {
      uni.showToast({
        title: '请先登录',
        icon: 'error',
      })
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/login/login',
        })
      }, 1000)
      return
    } else {
      const date = new Date()
      const formattedDateTime = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      await addOrderListAPI(
        user_id.value,
        count.value,
        parseInt(book.value.price) * count.value,
        formattedDateTime,
      ).then(async (res) => {
        if (res.result) {
          const order_id = res.result
          await addOrderDetailAPI(order_id, book.value.book_id, count.value).then(async () => {
            uni.navigateTo({
              url: `/pagesOrder/orderCreate/orderCreate?order_id=${order_id}`,
            })
          })
        }
      })
    }
  }
}
const addCart = async () => {
  if (!isSelected.value) {
    uni.showToast({
      title: '请选择规格',
      icon: 'error',
    })
    return
  } else {
    if (!user_id.value) {
      uni.showToast({
        title: '请先登录',
        icon: 'error',
      })
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/login/login',
        })
      }, 1000)
      return
    } else {
      // 进行添加购物车业务
      const date = new Date()
      const formattedDateTime = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      await addBookCartAPI(user_id.value, book.value.book_id, count.value, formattedDateTime).then(
        (res) => {
          if (res.result) {
            uni.showToast({
              title: '添加购物车成功',
              icon: 'success',
            })
            emit('refresh', 'refreshCartCount')
            emit('close')
          }
        },
      )
    }
  }
}
const onBtn = (name) => {
  if (name === '加入购物车') {
    addCart()
  } else if (name === '立即购买') {
    buyNow()
  }
}
</script>

<style lang="scss">
.bookSku {
  width: 100;
  height: 500px;
  background-color: white;
  position: relative;
  .close {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 10px;
    top: 10px;
    text-align: center;
  }
  .bothBtn {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    color: white;
    justify-content: space-around;
    height: 40px;
    line-height: 40px;
    .btnCart {
      text-align: center;
      width: 40%;
      background-color: orange;
      border-radius: 20px;
    }
    .btnBuy {
      text-align: center;
      border-radius: 20px;
      width: 40%;
      background-color: orangered;
    }
  }
  .btn {
    position: absolute;
    bottom: 20px;
    left: 10%;
    width: 80%;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    text-align: center;
    color: white;
  }
  .topPart {
    height: 150px;
    .skuImage {
      margin: 10px;
      height: 150px;
      width: 100px;
      border: 1px solid #e1dbdb;
    }
    // 书本信息
    .skubookinfo {
      position: absolute;
      top: 9px;
      left: 122px;
      .skuName {
        font-size: 17px;
        font-weight: 600;
      }
      .skuAuthor {
        font-size: 12px;
        color: gray;
        padding: 3px 0;
      }
      .skuPress {
        font-size: 12px;
        color: gray;
        padding-bottom: 3px;
      }
      .skuStock {
        font-size: 13px;
        color: gray;
      }
      .skuPrice {
        margin-top: 21px;
        font-size: 18px;
        color: orangered;
      }
      .skuSelected {
        font-size: 12px;
        margin-top: 12px;
        color: #2a2929;
      }
    }
    .skuSpec {
      position: absolute;
      top: 175px;
      left: 10px;
      .skuSpecTitle {
        font-size: 16px;
        font-family: sans-serif;
      }
      .skuSpecContent {
        margin-top: 10px;
        font-size: 15px;
        padding: 3px 20px;
        background-color: #f4eeee;
        color: rgb(60, 59, 59);
      }
      .active {
        color: orange;
        border: 1px solid orange;
      }
    }
    .numberCount {
      position: absolute;
      top: 280px;
      left: 10px;
      display: flex;
      .numberCountTitle {
        font-size: 16px;
        font-family: sans-serif;
      }
      .numberCountInput {
        margin-left: 240px;
        display: flex;
        color: black;
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
  }
}
</style>

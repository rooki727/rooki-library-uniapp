<template>
  <scroll-view
    id="scrollCustomerView"
    ref="scrollCustomerView"
    :scroll-y="true"
    class="customerView"
    scroll-with-animation="true"
    :scroll-top="scrollTop"
  >
    <view class="content">
      <view
        v-for="msg in messages"
        :key="msg"
        :class="['perMessage', msg.user_id ? 'user-message' : 'server-message']"
      >
        <view class="time">{{ msg.sendTime.toLocaleString() }}</view>
        <view class="profileImg">
          <image
            class="profileImg"
            :src="msg.user_id ? profile.awatar : '../../static/images/OIP-C.jpg'"
            mode="aspectFit"
          >
          </image
        ></view>

        <view class="msgBox">
          <view class="proName">{{
            msg.user_id ? profile.name || profile.account : '客服小罗'
          }}</view>
          <view class="msgContent">{{ msg.message }}</view>
        </view>
      </view>
    </view>
  </scroll-view>
  <view class="fixed-bottom">
    <input v-model="message" @confirm="sendMessage" placeholder="在此输入你想咨询的内容" />
    <button @tap="sendMessage" class="send">
      <uni-icons type="paperplane-filled" size="19" color="white"></uni-icons>
    </button>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useMemberStore } from '@/stores'

const scrollTop = ref(0)
const memberStore = useMemberStore()
const profile = computed(() => memberStore.profile)
const user_id = profile.value.user_id
const message = ref('')
const messages = ref([{ sendTime: new Date(), message: '你好，请问你要咨询什么?' }])
const url = 'ws://localhost:8080/library_ssm/chat'
let reconnectTimer = null

const reconnectInterval = 3000
// 判读是否手动关闭
const isHandClose = ref(false)

// 封装每次都触底事件
const scrollToBottom = async () => {
  // 创建选择器
  const query = uni.createSelectorQuery()
  // Promise可以确保在滚动之前 clientHeight 和 scrollOffset 都被正确获取并赋值。
  // 获取 clientHeight
  const getClientHeight = new Promise((resolve) => {
    query
      .select('#scrollCustomerView')
      .boundingClientRect((rect) => {
        if (rect) {
          resolve(rect.height)
        }
      })
      .exec()
  })

  // 因为数据还没来得及更新，导致计算时使用的值不一致  所以使用回调异步 获取正确值
  // 获取 scrollOffset
  const getScrollOffset = new Promise((resolve) => {
    query
      .select('#scrollCustomerView')
      .scrollOffset((scrollOffset) => {
        resolve(scrollOffset)
      })
      .exec()
  })
  // 获取clientHeight 和 scrollOffset通过Promise的resolve方法，确保它们都已经被正确获取并赋值。
  const clientHeight = await getClientHeight
  const scrollOffset = await getScrollOffset

  // 计算并滚动到底部
  if (scrollOffset && scrollOffset.scrollHeight > clientHeight) {
    scrollTop.value = scrollOffset.scrollHeight
  }
}

// 连接
const connectWebSocket = () => {
  uni.connectSocket({
    url,
    header: {
      user_id: user_id, // 在请求头中传递自定义的 session ID
    },
  })

  uni.onSocketOpen(() => {
    console.log('WebSocket连接已打开！')
    clearReconnectTimer()
  })
  // 接收消息
  uni.onSocketMessage(async (res) => {
    console.log('收到服务器内容：', res.data)
    // 使用正则表达式提取所有 ChatMessage 中的括号内容
    const matches = res.data.match(/\((.*?)\)/g)
    const resultArray = matches.map((match) => {
      // 去掉括号并拆分参数
      const params = match
        .slice(1, -1)
        .split(', ')
        .map((param) => {
          const [key, value] = param.split('=')
          return { [key]: value === 'null' ? null : value } // 处理 null 值
        })

      // 将参数转换为对象
      return Object.assign({}, ...params)
    })
    resultArray.forEach((msg) => {
      msg.sendTime = new Date(msg.sendTime)
      messages.value.push(msg)
    })

    await scrollToBottom()
  })

  uni.onSocketError(() => {
    console.log('WebSocket连接打开失败，请检查！')
  })

  uni.onSocketClose(() => {
    console.log('WebSocket已关闭！')
    if (!isHandClose.value) {
      reconnect()
    }
    isHandClose.value = false
  })
}
//  发送消息
const sendMessage = async () => {
  if (message.value) {
    messages.value.push({ sendTime: new Date(), message: message.value, user_id: user_id })
    await scrollToBottom()
    await uni.sendSocketMessage({ data: message.value })
    message.value = ''
  }
}
// 清空重连定时器
const clearReconnectTimer = () => {
  if (reconnectTimer) {
    clearInterval(reconnectTimer)
    reconnectTimer = null
  }
}
// 重连
const reconnect = () => {
  if (!reconnectTimer) {
    reconnectTimer = setInterval(() => {
      console.log('正在重连...')
      connectWebSocket()
    }, reconnectInterval)
  }
}

onMounted(async () => {
  connectWebSocket()
})

onUnmounted(() => {
  isHandClose.value = true
  uni.closeSocket()
  clearReconnectTimer()
})
</script>

<style lang="scss">
page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f7f4f4;
}

.customerView {
  flex: 1;
  overflow-y: auto; /* 确保内容可以滚动 */
  margin-bottom: 50px;
  .content {
    padding: 20rpx;
    .user-message {
      flex-direction: row-reverse;
      text-align: right;
    }
    .server-message {
      text-align: left;
    }
    .perMessage {
      margin-bottom: 20rpx;
      color: rgb(33, 32, 32);
      display: flex;
      margin-bottom: 20px;
      position: relative;
      .time {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 12px;
        color: rgb(109, 108, 108);
      }
      .profileImg {
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
        margin-right: 10rpx;
      }

      .msgBox {
        width: 100%;
        .proName {
          margin-right: 10rpx;
          margin-bottom: 5px;
          font-size: 13px;
          color: #616060;
        }

        .msgContent {
          display: inline-block; /* Adjust width based on content */
          max-width: 80%;
          background-color: white;
          border-radius: 6px;
          font-size: 15px;
          color: #373636;
          padding: 5px 10px;
          text-align: left;
          overflow-wrap: break-word; /* 兼容其他浏览器 */
          white-space: normal; /* 确保文本在需要时换行 */
        }
      }
    }
  }
}
// 底部

.fixed-bottom {
  z-index: 100;
  position: fixed;
  /* #ifdef H5 */
  left: var(--window-left);
  right: var(--window-right);
  /* #endif */

  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 20rpx;
  background-color: #f0eaea;
  input {
    flex: 1;
    margin-right: 20rpx;
    padding: 10rpx;
    background-color: white;
    border-radius: 15px;
    text-indent: 10px;
  }

  .send {
    width: 100rpx;
    height: 60rpx;
    background-color: #2e86e5;
    color: white;
    border-radius: 15px;
    text-align: center;
    line-height: 60rpx;
  }
}
</style>

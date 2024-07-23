import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore(
  'cart',
  () => {
    const cartList = ref([])
    const setCartlist = (list) => {
      cartList.value = list
    }
    const clearCartlist = () => {
      cartList.value = []
    }
    return {
      cartList,
      setCartlist,
      clearCartlist,
    }
  },
  // TODO: 持久化
  {
    // 配置持久化
    persist: {
      // 调整为兼容多端的API
      storage: {
        setItem(key, value) {
          uni.setStorageSync(key, value) // [!code warning]
        },
        getItem(key) {
          return uni.getStorageSync(key) // [!code warning]
        },
      },
    },
  },
)

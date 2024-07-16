import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressStore = defineStore(
  'address',
  () => {
    const selectedAddress = ref()
    const defaultAddress = ref()
    const changeSelectedAddress = (val) => {
      selectedAddress.value = val
    }
    const setDefaultAddress = (val) => {
      defaultAddress.value = val
    }
    const clearDefaultAddress = () => {
      defaultAddress.value = ''
    }
    const clearAddress = () => {
      selectedAddress.value = ''
    }
    return {
      selectedAddress,
      changeSelectedAddress,
      clearAddress,
      defaultAddress,
      setDefaultAddress,
      clearDefaultAddress,
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

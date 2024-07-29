import { useMemberStore } from '@/stores/modules/member'
import { computed } from 'vue'
const baseURL = 'http://175.178.187.126:8888/library_ssm'
const memberStore = useMemberStore()
const token = computed(() => memberStore.profile?.token)
const httpInterceptor = {
  invoke(options) {
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    options.timeout = 5000
    options.header = {
      ...options.header,
    }
    if (token.value) {
      options.header.Authorization = `Bearer ${token.value}`
    }
  },
}
// 添加拦截器
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

export const https = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      // 请求成功
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // memberStore.clearProfile()
          // uni.navigateTo({ url: '/pages/login/login' })
          console.log('token处理错误')
          reject(res)
        } else {
          uni.showToast({ title: res.data.msg || '请求错误', icon: 'none' })
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络超时，换个网络试试', icon: 'none' })
        reject(err)
      },
    })
  })
}

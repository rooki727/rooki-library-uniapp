import { useMemberStore } from '@/stores/modules/member'
import { computed } from 'vue'
import { refreshTokenUserAPI } from '@/apis/token'
const baseURL = 'http://119.29.168.176:8080/library_ssm'
// const baseURL = 'http://localhost:8080/library_ssm'
const memberStore = useMemberStore()
const token = computed(() => memberStore.profile?.token)
const refreshToken = computed(() => memberStore.profile?.refreshToken)
const user_id = computed(() => memberStore.profile?.user_id)
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

// 判断token是否过期
function isTokenAboutToExpire(token) {
  const payload = JSON.parse(atob(token.split('.')[1]))
  const exp = payload.exp * 1000 // 转换为毫秒
  console.log(exp)

  const currentTime = Date.now()
  return exp - currentTime < 60000 // 例如，提前 60 秒判断
}

// 请求封装
export const https = (options) => {
  return new Promise((resolve, reject) => {
    const originalRequest = { ...options } // 保存原始请求信息

    uni.request({
      ...originalRequest,
      // 请求成功
      success: async (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.code === '-403') {
            // 处理 token 过期失效问题
            if (isTokenAboutToExpire(token.value)) {
              console.log('Token 即将过期，尝试刷新 token')
              try {
                // 获取新的token
                const refreshRes = await refreshTokenUserAPI(user_id.value, refreshToken.value)
                memberStore.setProfile(refreshRes)

                // 重新发送原始请求
                const retryResponse = await new Promise((retryResolve, retryReject) => {
                  uni.request({
                    ...originalRequest,
                    header: {
                      ...originalRequest.header,
                      Authorization: `Bearer ${memberStore.profile.token}`, // 使用新 token
                    },
                    success: (retryRes) => retryResolve(retryRes),
                    fail: (retryErr) => retryReject(retryErr),
                  })
                })

                resolve(retryResponse.data) // 返回重试后的响应
              } catch (error) {
                console.error('Token 刷新失败', error)
                uni.showToast({ title: '登录过期，请重新登录', icon: 'error' })
                memberStore.clearProfile()
                uni.navigateTo({ url: '/pages/login/login' })
                reject(error)
              }
            } else {
              uni.showToast({ title: '登录过期，请重新登录', icon: 'error' })
              setTimeout(() => {
                uni.navigateTo({ url: '/pages/login/login' })
              }, 500)
              reject(res)
            }
          } else {
            resolve(res.data)
          }
        } else if (res.statusCode === 401 && res.data == 'Invalid Token') {
          memberStore.clearProfile()
          uni.showToast({ title: '登录过期，请重新登录', icon: 'error' })
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/login/login' })
          }, 500)
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

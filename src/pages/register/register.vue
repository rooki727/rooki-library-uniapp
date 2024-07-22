<template>
  <view class="content" :style="{ paddingTop: navbarHeight + 'px' }">
    <view class="title"><text>注册账号</text></view>
  </view>
  <view class="forms">
    <uni-forms :modelValue="formData" :rules="rules" ref="form">
      <uni-forms-item
        name="account"
        :rules="[
          { required: true, errorMessage: '请输入账号' }, // 对name字段进行长度验证
          {
            minLength: 6,
            maxLength: 11,
            errorMessage: '账号长度在 {minLength} 到 {maxLength} 个字符',
          },
          {
            pattern: /^\d+$/,
            errorMessage: '只能输入数字',
          },
        ]"
      >
        <uni-easyinput
          type="number"
          v-model="formData.account"
          placeholder="请输入账号"
          :placeholderStyle="'font-size:14px'"
          :inputBorder="false"
          @blur="onBlur"
        ></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item
        name="password"
        :rules="[
          { required: true, errorMessage: '请输入密码' },
          {
            minLength: 9,
            maxLength: 16,
            errorMessage: '密码长度在 {minLength} 到 {maxLength} 个字符',
          },
          {
            pattern: /^(?=.*\d)(?=.*[a-zA-Z]).+$/,
            errorMessage: '必须包含数字和字母',
          },
        ]"
      >
        <uni-easyinput
          type="password"
          v-model="formData.password"
          placeholder="请输入密码"
          :placeholderStyle="'font-size:14px'"
          :inputBorder="false"
        ></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item
        name="confirmPassword"
        :rules="[{ required: true, errorMessage: '请确认密码' }]"
      >
        <uni-easyinput
          type="password"
          v-model="formData.confirmPassword"
          placeholder="请确认密码"
          :placeholderStyle="'font-size:14px'"
          :inputBorder="false"
        ></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item
        name="checkedCaptcha"
        :rules="[{ required: true, errorMessage: '请确认验证码' }]"
      >
        <view style="width: 50%" class="checkedCaptcha">
          <view class="captchaText" @tap="onGetNewCaptcha"
            ><text
              v-for="(char, index) in captcha"
              :key="index"
              class="captchaChar"
              :style="{
                transform: `rotate(${char.rotation}deg) translateX(${char.position}px)`,
              }"
              >{{ char.value }}</text
            ></view
          >

          <uni-easyinput
            type="text"
            v-model="formData.checkedCaptcha"
            placeholder="请确认验证码"
            :placeholderStyle="'font-size:14px'"
            :inputBorder="false"
            style="width: 60% !important"
          ></uni-easyinput>
        </view>
      </uni-forms-item>
    </uni-forms>
    <button
      @click="submitForm"
      class="submitBtn"
      :style="{
        backgroundColor: canSubmit ? 'rgb(110, 197, 232)' : 'skyblue',
        color: canSubmit ? '#00000096' : 'white',
      }"
    >
      注册
    </button>
    <view style="margin-top: 4%">
      <label @tap="onCheck">
        <checkbox value="choose" :checked="formData.checked" style="transform: scale(0.7)" />
        <text style="font-size: 12px"
          >已阅读并同意<text style="color: skyblue">服务协议</text> 和<text style="color: skyblue"
            >商城隐私保护指引</text
          >
        </text>
      </label>
    </view>
  </view>
  <!-- 底部操作区 -->
  <view class="controlBottom">
    <view class="control">
      <view class="circle">
        <uni-icons type="person" size="23"> </uni-icons>
      </view>
      <view class="controlText">其他方式注册</view>
    </view>
    <navigator url="/pages/login/login" open-type="navigate" hover-class="none">
      <view class="control">
        <view class="circle"><uni-icons type="plusempty" size="23"> </uni-icons> </view>
        <view class="controlText">登录</view>
      </view>
    </navigator>
  </view>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { registerUserAPI, checkCommonAccountAPI, getgenerateCaptchaAPI } from '@/apis/user'
//获取屏幕边界
const { safeArea } = uni.getSystemInfoSync()
//获取导航栏高度
const navbarHeight = safeArea?.top
const form = ref(null)

const canSubmit = ref(false)
const formData = ref({
  account: '',
  password: '',
  confirmPassword: '',
  checkedCaptcha: '',
  checked: false,
  accountCanUse: false,
})
const onCheck = () => {
  formData.value.checked = !formData.value.checked
  canSubmit.value = !canSubmit.value
}
// 校验账号是否可以
const onBlur = async () => {
  form.value
    .validateField('account')
    .then(async (res) => {
      console.log('校验结果：', res)
      const result = await checkCommonAccountAPI(parseInt(formData.value.account))
      if (result.result == 'account不存在') {
        formData.value.accountCanUse = true
        uni.showToast({ title: '账号可用', icon: 'success', duration: 2000 })
      } else {
        formData.value.accountCanUse = false
        uni.showToast({ title: '账号已存在', icon: 'error', duration: 2000 })
      }
    })
    .catch((err) => {
      console.log('校验错误结果：：', err)
    })
}
const captcha = ref([])
const captchaString = computed(() => captcha.value.map((item) => item.value).join(''))
const getCaptcha = async () => {
  const res = await getgenerateCaptchaAPI()
  captcha.value = res
}
const onGetNewCaptcha = () => {
  getCaptcha()
}
const submitForm = () => {
  form.value
    .validate()
    .then(async (res) => {
      console.log('表单数据信息：', res)
      if (formData.value.accountCanUse) {
        if (formData.value.password === formData.value.confirmPassword) {
          if (formData.value.checkedCaptcha == captchaString.value) {
            if (formData.value.checked) {
              const date = new Date()
              await registerUserAPI(formData.value.account, formData.value.password, date, date)
                .then((res) => {
                  if (res.result) {
                    clearForm()
                    uni.showToast({ title: '注册成功', icon: 'success', duration: 2000 })
                    setTimeout(() => {
                      // 页面跳转登录页
                      uni.navigateTo({ url: '/pages/login/login' })
                    }, 500)
                  } else {
                    uni.showToast({
                      title: '网络错误或信息错误！',
                      icon: 'none',
                      duration: 2000,
                    })
                  }
                })
                .catch((err) => {
                  console.log(err)
                  uni.showToast({
                    title: '注册失败，请检查账号密码是否正确',
                    icon: 'none',
                    duration: 2000,
                  })
                })
            } else {
              uni.showToast({ title: '请阅读并同意协议', icon: 'none', duration: 2000 })
            }
          } else {
            uni.showToast({ title: '请校验验证码', icon: 'none', duration: 2000 })
          }
        } else {
          uni.showToast({ title: '两次密码不一致', icon: 'error', duration: 2000 })
        }
      } else {
        uni.showToast({ title: '该账号已被注册', icon: 'error', duration: 2000 })
      }
    })
    .catch((err) => {
      console.log('表单错误信息：', err)
    })
}

const clearForm = () => {
  formData.value = {
    account: '',
    password: '',
    confirmPassword: '',
    checked: false,
  }
}

onMounted(() => {
  getCaptcha()
})
</script>

<style lang="scss">
page {
  background: linear-gradient(
    to bottom,
    rgba(208, 243, 211, 0.6),
    rgba(214, 239, 216, 0.5),
    rgba(226, 246, 228, 0.4),
    rgba(234, 245, 235, 0.3),
    rgba(242, 247, 243, 0.2),
    rgba(247, 248, 247, 0.1)
  );
}
.content {
  text-align: center;
  .title {
    color: #00000096;
    margin-top: 4%;
    font-size: 42rpx;
  }
}
.forms {
  margin-top: 20%;
  text-align: center;
}
.uni-easyinput {
  .uni-easyinput__content {
    background: white;
    height: 40px !important;
    width: 70% !important;
    margin: 0 auto;
    border-radius: 10px;
  }
}
.submitBtn {
  width: 70%;
  height: 40px;
  font-size: 14px;
}
.controlBottom {
  margin: 35% auto;
  display: flex;
  justify-content: center;
  .control {
    display: flex;
    flex-direction: column;
    align-items: center; /* 垂直方向居中对齐 */
    margin: 0 6px; /* 水平方向间距 */
    text-align: center;
    .circle {
      text-align: center;
      border: 1px solid #d6d3d3;
      width: 35px;
      height: 35px;
      line-height: 35px;
      border-radius: 50%;
    }
    .controlText {
      font-size: 11px;
    }
  }
}
.checkedCaptcha {
  margin-left: 20%;
  display: flex;
  align-items: center;
  position: relative;
  .captchaText {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40%;
    height: 40px;
    border: 1px solid #d6d3d3;
    font-size: 15px;
    border-radius: 10px;
    .captchaChar {
      display: inline-block;
      margin: 0 3px;
      transform: rotate(-20deg);
    }
  }
}
</style>

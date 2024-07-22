<template>
  <view class="optionAddress">
    <view class="addressForm">
      <uni-forms :modelValue="addressData" ref="form">
        <!-- 表单内容 -->
        <uni-forms-item
          name="receiver"
          label="收货人"
          :rules="[{ required: true, errorMessage: '请填写收货人姓名' }]"
        >
          <uni-easyinput
            type="text"
            v-model="addressData.receiver"
            placeholder="请填写收货人姓名"
            :placeholderStyle="'font-size:14px'"
            :inputBorder="false"
          ></uni-easyinput>
        </uni-forms-item>
        <uni-forms-item
          name="phone"
          label="手机号码"
          :rules="[
            { required: true, errorMessage: '请输入手机号码' },
            { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' },
          ]"
        >
          <uni-easyinput
            type="phone"
            v-model="addressData.phone"
            placeholder="请输入手机号码"
            :placeholderStyle="'font-size:14px'"
            :inputBorder="false"
          ></uni-easyinput>
        </uni-forms-item>
        <uni-forms-item
          name="bigAddress"
          label="所在地区"
          :rules="[{ required: true, errorMessage: '请选择省/市/区(县)' }]"
        >
          <picker
            class="picker"
            @change="onRegionChange"
            mode="region"
            :value="addressData.bigAddress.split(' ')"
          >
            <view v-if="addressData.bigAddress">{{ addressData.bigAddress }}</view>
            <view v-else class="placeholder">请选择省/市/区(县)</view>
          </picker>
        </uni-forms-item>
        <uni-forms-item
          name="fullAddress"
          label="详细地址"
          :rules="[{ required: true, errorMessage: '请填写详细地址' }]"
        >
          <uni-easyinput
            type="text"
            v-model="addressData.fullAddress"
            placeholder="街道、楼牌号等信息"
            :placeholderStyle="'font-size:14px'"
            :inputBorder="false"
          ></uni-easyinput>
        </uni-forms-item>
        <view>
          <label class="label">设为默认地址</label>
          <switch
            class="switch"
            color="#27ba9b"
            @change="onSwitchChange"
            :checked="addressData.isDefault === 1"
          />
        </view>
      </uni-forms>
    </view>
  </view>
  <!-- 提交按钮 -->
  <button @tap="onSubmit" class="saveButton">保存并使用</button>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  addAddressAPI,
  getAddressByIdAPI,
  updateAddressAPI,
  updateDefaultAddressAPI,
} from '@/apis/address'
import { useMemberStore } from '@/stores/modules/member'
import { onLoad } from '@dcloudio/uni-app'
import { useAddressStore } from '@/stores/modules/address'
const addressStore = useAddressStore()
const memberStore = useMemberStore()
const user_id = computed(() => memberStore.profile.user_id)
const form = ref(null)
const query = defineProps({
  address_id: Number,
})
// 动态设置标题
uni.setNavigationBarTitle({ title: query.address_id ? '修改地址' : '新建地址' })

const addressData = ref({
  receiver: '',
  phone: '',
  bigAddress: '',
  fullAddress: '',
  isDefault: 0,
})
const address_id = computed(() => {
  return query.address_id
})
//得到默认的两个id
const defaultAddressId = computed(() => addressStore.defaultAddress.address_id)

const getAddressById = async () => {
  await getAddressByIdAPI(user_id.value, address_id.value).then((res) => {
    // 把数据合并到表单中
    Object.assign(addressData.value, res.result)
  })
}
const onRegionChange = (e) => {
  addressData.value.bigAddress = `${e.detail.value[0]} ${e.detail.value[1]} ${e.detail.value[2]}`
}
const onSwitchChange = (e) => {
  addressData.value.isDefault = e.detail.value ? 1 : 0
}
const onSubmit = async () => {
  if (!user_id.value) {
    uni.showToast({ title: '请先登录', icon: 'error', duration: 500 })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/login/login' })
    }, 500)
  } else {
    // 表单校验
    form.value
      .validate()
      .then(async () => {
        // 判断是修改还是添加
        if (query.address_id) {
          if (addressData.value.isDefault === 1 && defaultAddressId.value) {
            await updateDefaultAddressAPI(user_id.value, defaultAddressId.value, 0).then(
              async (res) => {
                if (res.code != -1) {
                  await updateAddressAPI(
                    user_id.value,
                    address_id.value,
                    addressData.value.receiver,
                    addressData.value.phone,
                    addressData.value.bigAddress,
                    addressData.value.fullAddress,
                    addressData.value.isDefault,
                  ).then((res) => {
                    if (res.code != -1) {
                      uni.showToast({ title: '修改成功', icon: 'success', duration: 2000 })
                      // 返回上一页
                      setTimeout(() => {
                        uni.navigateBack()
                      }, 500)
                    }
                  })
                }
              },
            )
          } else {
            await updateAddressAPI(
              user_id.value,
              address_id.value,
              addressData.value.receiver,
              addressData.value.phone,
              addressData.value.bigAddress,
              addressData.value.fullAddress,
              addressData.value.isDefault,
            ).then((res) => {
              if (res.code != -1) {
                uni.showToast({ title: '修改成功', icon: 'success', duration: 2000 })
                // 返回上一页
                setTimeout(() => {
                  uni.navigateBack()
                }, 500)
              }
            })
          }
        }
        // 添加情况
        else {
          if (addressData.value.isDefault === 1 && defaultAddressId.value) {
            await updateDefaultAddressAPI(user_id.value, defaultAddressId.value, 0).then(
              async () => {
                await addAddressAPI(
                  user_id.value,
                  addressData.value.receiver,
                  addressData.value.phone,
                  addressData.value.bigAddress,
                  addressData.value.fullAddress,
                  addressData.value.isDefault,
                ).then((res) => {
                  if (res.code != -1) {
                    uni.showToast({ title: '添加成功', icon: 'success', duration: 2000 })
                    // 返回上一页
                    setTimeout(() => {
                      uni.navigateBack()
                    }, 500)
                  }
                })
              },
            )
          } else {
            await addAddressAPI(
              user_id.value,
              addressData.value.receiver,
              addressData.value.phone,
              addressData.value.bigAddress,
              addressData.value.fullAddress,
              addressData.value.isDefault,
            ).then((res) => {
              if (res.code != -1) {
                uni.showToast({ title: '添加成功', icon: 'success', duration: 2000 })
                // 返回上一页
                setTimeout(() => {
                  uni.navigateBack()
                }, 500)
              }
            })
          }
        }
      })
      .catch(() => {
        uni.showToast({ title: '请填写完整信息', icon: 'error' })
      })
  }
}
onLoad(() => {
  if (query.address_id) {
    getAddressById()
  }
})
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
.addressForm {
  margin-top: 20px;
  position: relative;
}
.placeholder {
  line-height: 36px;
}
.picker {
  line-height: 36px;
}
.label {
  font-size: 14px;
  color: #393838;
}
.switch {
  position: absolute;
  right: -10rpx;
  height: 20px;
  transform: scale(0.8);
}
.saveButton {
  height: 80rpx;
  margin: 20% 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: rgb(255, 85, 0);
}
</style>

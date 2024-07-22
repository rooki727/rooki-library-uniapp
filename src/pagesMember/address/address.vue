<template>
  <view class="addressPage">
    <view v-if="addressList.length">
      <uni-swipe-action>
        <uni-swipe-action-item v-for="item in addressList" :key="item.address_id">
          <view class="addressList">
            <view class="addressLeft" @tap="onChooseAddress(item)">
              <view class="bigAddress">{{ item.bigAddress }}</view>
              <view class="fullAddress">{{ item.fullAddress }}</view>
              <view class="bottomPart">
                <view class="addressName">{{ item.receiver }}</view>
                <view class="addressPhone">{{ item.phone }}</view>
                <view class="moren" v-show="item.isDefault === 1">默认</view></view
              >
              <navigator
                :url="`/pagesMember/optionAddress/optionAddress?address_id=${item.address_id}`"
                open-type="navigate"
                hover-class="none"
                @tap.stop="() => {}"
              >
                <view class="editIcon"> <uni-icons type="compose" size="20"></uni-icons> </view
              ></navigator>
            </view>
          </view>
          <!-- 右侧插槽 -->
          <template #right>
            <button @tap="onDeleteAddress(item.address_id)" class="delete-button">删除</button>
          </template>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
    <!-- 暂无收货地址 -->
    <view v-else class="blank">暂无收货地址</view>
    <!-- 底部操作 -->
    <!-- 添加按钮 -->
    <view class="addBtn">
      <navigator hover-class="none" url="/pagesMember/optionAddress/optionAddress">
        新建地址
      </navigator>
    </view>
  </view>
</template>

<script setup>
import { getAddressListByIdAPI, deleteAddressByIdAPI } from '@/apis/address'
import { computed, ref } from 'vue'
import { useMemberStore } from '@/stores/modules/member'
import { useAddressStore } from '@/stores/modules/address'
import { onShow } from '@dcloudio/uni-app'
const addressStore = useAddressStore()
const memberStore = useMemberStore()
const user_id = computed(() => memberStore.profile.user_id)
const addressList = ref([])
const getAddressListById = async () => {
  if (!user_id.value) return
  const res = await getAddressListByIdAPI(parseInt(user_id.value))
  addressList.value = res.result
  const defaultAddress = addressList.value.find((item) => item.isDefault === 1)
  addressStore.setDefaultAddress(defaultAddress)
}
const onDeleteAddress = (id) => {
  // 二次确认
  uni.showModal({
    content: '删除地址?',
    success: async (res) => {
      if (res.confirm) {
        // 根据id删除收货地址
        await deleteAddressByIdAPI(user_id.value, id)
          .then(() => {
            uni.showToast({ title: '删除成功', icon: 'success', duration: 2000 })
            // 重新获取收货地址列表
            getAddressListById(user_id.value)
          })
          .catch(() => {
            uni.showToast({ title: '删除失败', icon: 'error', duration: 2000 })
          })
      }
    },
  })
}
const onChooseAddress = (item) => {
  addressStore.changeSelectedAddress(item)
  // 返回上一页
  uni.navigateBack()
}
onShow(() => {
  getAddressListById()
})
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
.addressPage {
  margin-top: 20px;
}
.addressList {
  position: relative;
  background-color: white;
  padding-left: 12px;
  border-bottom: 1px solid rgb(214, 210, 210);
  height: 105px;
  .addressLeft {
    width: 85%;
    height: 90%;
  }
  .bigAddress {
    padding-top: 10px;
    font-size: 12px;
    color: rgb(133, 132, 132);
  }
  .fullAddress {
    padding-top: 3px;
    font-size: 16px;
    font-weight: 600;
  }
  .bottomPart {
    padding-top: 5px;
    display: flex;
    font-size: 14px;
    .addressPhone {
      margin-left: 10px;
    }
    .moren {
      font-weight: 500;
      border-radius: 5px;
      line-height: 20px;
      text-align: center;
      margin-left: 8px;
      width: 38px;
      height: 20px;
      background-color: rgb(249, 233, 235);
      color: #fb2104;
    }
  }
  .editIcon {
    position: absolute;
    right: 5%;
    top: 40%;
  }
}

/* 删除按钮 */
.delete-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 100%;
  font-size: 28rpx;
  color: #fff;
  border-radius: 0;
  padding: 0;
  background-color: #cf4444;
}
.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}
.addBtn {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: rgb(255, 85, 0);
}
</style>

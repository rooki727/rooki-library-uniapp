<template>
  <view class="profile">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none"
        ><uni-icons type="left" size="24"></uni-icons>
      </navigator>
      <view class="title">个人信息</view>
    </view>
    <!-- 头像 -->
    <view class="awatar">
      <view class="awatarContent" @tap="onTapAwatar">
        <image :src="profileData.awatar" mode="aspectFill" class="awatarImg" />
        <view class="awatarText">点击修改头像</view>
      </view>
    </view>
    <!-- 表单 -->
    <view class="profileForm">
      <uni-forms :modelValue="profileData" ref="form">
        <uni-forms-item
          label="昵称"
          name="name"
          :rules="[{ required: true, errorMessage: '请输入昵称' }]"
        >
          <uni-easyinput
            type="text"
            v-model="profileData.name"
            placeholder="请输入昵称"
            :placeholderStyle="'font-size:14px'"
            :inputBorder="false"
          ></uni-easyinput>
        </uni-forms-item>

        <uni-forms-item
          label="性别"
          name="gender"
          :rules="[{ required: true, errorMessage: '请选中性别' }]"
        >
          <radio-group @change="onGenderChange" style="margin-left: 50px">
            <label class="radio">
              <radio value="男" color="#27ba9b" :checked="profileData?.gender === '男'" />
              男
            </label>
            <label class="radio">
              <radio value="女" color="#27ba9b" :checked="profileData?.gender === '女'" />
              女
            </label>
          </radio-group>
        </uni-forms-item>
        <uni-forms-item
          label="手机号码"
          name="phone"
          :rules="[{ required: true, errorMessage: '请输入手机号码' }]"
        >
          <uni-easyinput
            type="phone"
            v-model="profileData.phone"
            placeholder="请输入手机号码"
            :placeholderStyle="'font-size:14px'"
            :inputBorder="false"
          ></uni-easyinput>
        </uni-forms-item>
        <uni-forms-item
          label="邮箱"
          name="email"
          :rules="[{ required: true, errorMessage: '请输入邮箱' }]"
        >
          <uni-easyinput
            type="email"
            v-model="profileData.email"
            placeholder="请输入邮箱"
            :placeholderStyle="'font-size:14px'"
            :inputBorder="false"
          ></uni-easyinput>
        </uni-forms-item>
        <uni-forms-item
          label="生日"
          name="email"
          :rules="[{ required: true, errorMessage: '请选择生日' }]"
        >
          <view class="timePicker"
            ><picker
              mode="date"
              start="1900-01-01"
              :end="new Date()"
              :value="profileData?.birthday"
              @change="onChangeBirthday"
            >
              <view v-if="profileData?.birthday">{{ profileData?.formattedBirthday }}</view>
              <view class="placeholder" v-else>请选择日期</view>
            </picker>
          </view>
        </uni-forms-item>
        <uni-forms-item
          label="城市"
          name="email"
          :rules="[{ required: true, errorMessage: '请选择城市' }]"
        >
          <view class="timePicker">
            <picker class="picker" mode="region" @change="onChangeLocation" :value="loactionList">
              <view v-if="profileData?.address">{{ profileData.address }}</view>
              <view class="placeholder" v-else>请选择城市</view>
            </picker>
          </view>
        </uni-forms-item>
      </uni-forms>
      <button @click="submitForm" class="submitBtn">保存信息</button>
    </view>
  </view>
</template>

<script setup>
import { useMemberStore } from '@/stores/modules/member'
import { computed, ref } from 'vue'
import { getUserByIdAPI, updateUserBaseInfoAPI } from '@/apis/user'
import { onLoad } from '@dcloudio/uni-app'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const memberStore = useMemberStore()
const form = ref(null)
const profileData = ref({
  name: '',
  phone: '',
  email: '',
  gender: '',
  address: '',
  birthday: '',
  awatar: '',
})
const loactionList = ref([])
const user_id = computed(() => memberStore.profile.user_id)
const getprofileData = async () => {
  const res = await getUserByIdAPI(parseInt(user_id.value))
  if (res.code != '-1') {
    memberStore.setProfile(res)
    Object.assign(profileData.value, res)
  }
}
// 获取性别
const onGenderChange = (ev) => {
  profileData.value.gender = ev.detail.value
}
// 获取生日
const onChangeBirthday = (ev) => {
  profileData.value.birthday = ev.detail.value
  profileData.value.formattedBirthday = ev.detail.value
}
// 获取城市
const onChangeLocation = (ev) => {
  loactionList.value = ev.detail.value
  profileData.value.address = `${loactionList.value[0]} ${loactionList.value[1]} ${loactionList.value[2]}`
}
const onTapAwatar = async () => {
  // / 调用拍照/选择图片
  uni.chooseMedia({
    // 文件个数
    count: 1,
    // 文件类型
    mediaType: ['image'],
    success: async (res) => {
      // 本地路径

      const { tempFilePath } = res.tempFiles[0]
      console.log(res)
      console.log(tempFilePath)
      // 文件上传 传给后端返回可公网访问的链接
      uni.uploadFile({
        url: '/file/uploadBookMainPicture', // [!code ++]
        name: 'image', // 后端数据字段名  // [!code ++]
        filePath: tempFilePath, // 新头像  // [!code ++]
        success: (res) => {
          // 判断状态码是否上传成功
          if (res.statusCode === 200) {
            // 提取头像
            const awatar = JSON.parse(res.data).result
            // 当前页面更新头像
            profileData.value.awatar = awatar // [!code ++]

            uni.showToast({ icon: 'success', title: '更新成功' })
          } else {
            uni.showToast({ icon: 'error', title: '出现错误' })
          }
        },
      })
    },
  })
}
const submitForm = async () => {
  form.value.validate().then(async (res) => {
    console.log('表单数据信息：', res)
    await updateUserBaseInfoAPI(
      profileData.value.user_id,
      profileData.value.name,
      profileData.value.phone,
      profileData.value.email,
      profileData.value.gender,
      profileData.value.address,
      profileData.value.birthday,
      profileData.value.awatar,
    )
      .then(() => {
        uni.showToast({ title: '修改成功', icon: 'success', duration: 2000 })
        getprofileData()
      })
      .catch(() => {
        uni.showToast({ title: '修改失败', icon: 'error', duration: 2000 })
      })
  })
}
onLoad(() => {
  getprofileData()
})
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
}
.profile {
  height: 100%;
}
.navbar {
  position: relative;
  background: linear-gradient(to bottom, rgba(247, 20, 20, 0.7), rgba(249, 40, 40, 0.6));
  .title {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 0;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
// 头像
.awatar {
  height: 15%;
  width: 100%;
  background: linear-gradient(
    to bottom,
    rgba(243, 38, 38, 0.6),
    rgba(235, 71, 71, 0.6),
    rgba(240, 77, 77, 0.6),
    rgba(248, 88, 88, 0.6)
  );
  .awatarContent {
    margin: 0 auto;
    text-align: center;
    height: 100%;
    width: 30%;

    .awatarImg {
      height: 80px;
      width: 80px;
      border-radius: 50%;
    }
    .awatarText {
      margin-top: 5px;
      border: 1px solid #f7f5f5;
      border-radius: 10px;
      font-size: 14px;
      color: #f9f6f6;
    }
  }
}
// 表单
.profileForm {
  margin-top: 6%;
  margin-left: 4%;
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
  margin-top: 18%;
  width: 60%;
  height: 40px;
  font-size: 14px;
  background-color: rgb(106, 198, 235);
  color: white;
}
.timePicker {
  margin-top: 8px;
  margin-left: 50px;
  border: 1px solid #f7f5f5;
  border-radius: 10px;
  font-size: 14px;
}
</style>

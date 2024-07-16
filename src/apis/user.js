import { https } from '@/https/https'

export const getCommonUserById = (id) => {
  return https({
    url: '/user/getCommonUserById',
    method: 'get',
    data: {
      id: id,
    },
  })
}

export const loginUserAPI = (account, password) => {
  return https({
    url: '/user/loginUser',
    method: 'POST',
    data: {
      account: account,
      password: password,
    },
  })
}

export const registerUserAPI = (account, password, buildTime, birthday) => {
  return https({
    url: '/user/addUser',
    method: 'POST',
    data: {
      account: account,
      password: password,
      buildTime: buildTime,
      birthday: birthday,
    },
  })
}

export const checkCommonAccountAPI = (account) => {
  return https({
    url: '/user/selectByAccountUser',
    method: 'POST',
    data: {
      account: account,
    },
  })
}

// 获取验证码
export const getgenerateCaptchaAPI = () => {
  return https({
    url: '/user/generateCaptcha',
    method: 'GET',
  })
}

// 获取用户通过id
export const getUserByIdAPI = (user_id) => {
  return https({
    url: '/user/getLoginCommonById',
    method: 'POST',
    data: {
      user_id: user_id,
    },
  })
}
// 修改用户基本信息
export const updateUserBaseInfoAPI = (user_id, name, phone, email, gender, address, birthday) => {
  return https({
    url: '/user/updateUser',
    method: 'POST',
    data: {
      user_id: user_id,
      name: name,
      phone: phone,
      email: email,
      gender: gender,
      address: address,
      birthday: birthday,
    },
  })
}

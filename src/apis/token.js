import { https } from '@/https/https'

export const refreshTokenUserAPI = (user_id, refreshToken) => {
  return https({
    url: '/user/refreshTokenUser',
    method: 'POST',
    data: {
      user_id: user_id,
      refreshToken: refreshToken,
    },
  })
}

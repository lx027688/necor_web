import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

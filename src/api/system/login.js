import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function getCaptcha (data) {
  return request({
    url: '/captcha',
    responseType: 'blob',
    method: 'post',
    data
  })
}

export function agreement () {
  return request({
    url: '/login/agreement',
    responseType: 'blob',
    method: 'post'
  })
}

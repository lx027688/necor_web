import { request } from '@/api/service'

export function AccountLogin (data) {
  return request({
    url: '/login/login',
    method: 'post',
    params: data
  })
}
export function oauth2Login (data) {
  return request({
    url: '/oauth2/github',
    method: 'post',
    params: data
  })
}

export function AccountLogout () {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getCaptcha (data) {
  return request({
    url: '/captcha',
    responseType: 'blob',
    method: 'post',
    params: data
  })
}

export function agreement () {
  return request({
    url: '/login/agreement',
    responseType: 'blob',
    method: 'post'
  })
}

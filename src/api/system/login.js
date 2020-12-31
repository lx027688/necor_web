import request from '@/plugin/axios'

export function getCaptcha () {
  return request({
    url: '/captcha',
    responseType: 'blob',
    method: 'post'
  })
}

export function agreement () {
  return request({
    url: '/login/agreement',
    responseType: 'blob',
    method: 'post'
  })
}

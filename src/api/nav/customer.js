import request from '@/plugin/axios'

export function list (data) {
  return request({
    url: '/nav/customer/list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    url: '/nav/customer/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/nav/customer/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/nav/customer/remove/' + id,
    method: 'post'
  })
}

export function validateRepeatUsername (data) {
  return request({
    url: '/nav/customer/validate_repeat_username',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function validateRepeatPhone (data) {
  return request({
    url: '/nav/customer/validate_repeat_phone',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

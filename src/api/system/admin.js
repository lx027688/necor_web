import { request } from '@/api/service'

export function list (data) {
  return request({
    url: '/admin/list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    url: '/admin/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/admin/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/admin/remove/' + id,
    method: 'post'
  })
}

export function updateEnable (data) {
  return request({
    url: '/admin/update_enable',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function saveRoles (data) {
  return request({
    url: '/admin/save_roles',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function resetPassword (data) {
  return request({
    url: '/admin/reset_password',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function validateRepeatUsername (data) {
  return request({
    url: '/admin/validate_repeat_username',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function validateRepeatIdCard (data) {
  return request({
    url: '/admin/validate_repeat_idcard',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function validateRepeatEmail (data) {
  return request({
    url: '/admin/validate_repeat_email',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function validateRepeatMobile (data) {
  return request({
    url: '/admin/validate_repeat_mobile',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function exportAdmin (data) {
  return request({
    url: '/admin/export',
    method: 'post',
    responseType: 'blob',
    data
  })
}

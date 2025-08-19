import { request } from '@/api/service'

export function page (data) {
  return request({
    url: '/user/page',
    method: 'post',
    data
  })
}

export function getUserByDept (data) {
  return request({
    url: '/user/get_user_by_dept',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/user/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/user/remove/' + id,
    method: 'post'
  })
}

export function updateStatus (data) {
  return request({
    url: '/user/update_status',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function assignRole (data) {
  return request({
    url: '/user/assign_role',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function saveDept (data) {
  return request({
    url: '/user/save_dept',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function resetPassword (data) {
  return request({
    url: '/user/reset_password',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function validateRepeat (data) {
  return request({
    url: '/user/validate_repeat',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function exportUser (data) {
  return request({
    url: '/user/export',
    method: 'post',
    responseType: 'blob',
    data
  })
}

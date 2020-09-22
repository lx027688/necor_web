import request from '@/plugin/axios'

export function list (data) {
  return request({
    url: '/nav/base_info/list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: '/nav/base_info/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/nav/base_info/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/nav/base_info/remove/' + id,
    method: 'post'
  })
}

export function updateEnable (data) {
  return request({
    url: '/nav/base_info/update_enable',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

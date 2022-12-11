import { request } from '@/api/service'

export function list (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/area/list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/area/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/area/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/area/remove/' + id,
    method: 'post'
  })
}

export function getArea (data) {
  return request({
    url: '/area/get_area',
    method: 'post',
    params: data
  })
}

import { request } from '@/api/service'

export function list (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/sys/area/list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/sys/area/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/sys/area/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/sys/area/remove/' + id,
    method: 'post'
  })
}

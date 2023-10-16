import { request } from '@/api/service'

export function list (data) {
  return request({
    url: '/dept/list',
    method: 'post',
    data
  })
}

// 不需要权限
export function root (data) {
  return request({
    url: '/dept/root',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    url: '/dept/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/dept/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/dept/remove/' + id,
    method: 'post'
  })
}

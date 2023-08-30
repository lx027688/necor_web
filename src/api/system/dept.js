import { request } from '@/api/service'

export function list (data) {
  return request({
    url: '/dept/list',
    method: 'post',
    data
  })
}

export function listByAdmin () {
  return request({
    url: '/dept/list_by_admin',
    method: 'post'
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

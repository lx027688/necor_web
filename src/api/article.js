import request from '@/plugin/axios'

export function list (data) {
  return request({
    url: '/article/list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    url: '/article/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/article/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/article/remove/' + id,
    method: 'post'
  })
}

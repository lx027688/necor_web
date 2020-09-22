import request from '@/plugin/axios'

export function all (data) {
  return request({
    url: '/nav/position/all',
    method: 'post'
  })
}

export function list (data) {
  return request({
    url: '/nav/position/list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    url: '/nav/position/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/nav/position/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/nav/position/remove/' + id,
    method: 'post'
  })
}

import request from '@/plugin/axios'

export function list (data) {
  return request({
    url: '/itfe/list',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function save (data) {
  return request({
    url: '/itfe/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/itfe/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/itfe/remove/' + id,
    method: 'post'
  })
}

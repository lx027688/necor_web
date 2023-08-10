import { request } from '@/api/service'

export function list (data) {
  return request({
    url: '/dict/list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/dict/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/dict/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/dict/remove/' + id,
    method: 'post'
  })
}

export function dictRoot () {
  return request({
    url: '/dict/dict_root/',
    method: 'post'
  })
}

export function dictChildsPage (data) {
  return request({
    url: '/dict/childs_page',
    method: 'post',
    params: data
  })
}

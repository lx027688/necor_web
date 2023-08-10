import { request } from '@/api/service'

export function findMenuTree () {
  return request({
    url: '/menu/get_menu_tree',
    method: 'post'
  })
}

export function getRoutes () {
  return request({
    url: '/menu/get_route',
    method: 'post'
  })
}

export function saveMenu (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/menu/save',
    method: 'post',
    data
  })
}

export function removeMenu (id) {
  return request({
    url: '/menu/remove/' + id,
    method: 'post'
  })
}

export function menuDetail (id) {
  return request({
    url: '/menu/detail/' + id,
    method: 'get'
  })
}

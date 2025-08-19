import { request } from '@/api/service'

export function all () {
  return request({
    url: '/role/all',
    method: 'post'
  })
}

export function save (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/role/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/role/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/role/remove/' + id,
    method: 'post'
  })
}

export function updateAvailable (data) {
  return request({
    url: '/role/update_available',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function assignMenus (data) {
  return request({
    url: '/role/assign_menus',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function getMenusByRole (data) {
  return request({
    url: '/role/get_menus_by_role',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

import { request } from '@/api/service'

export function all () {
  return request({
    url: '/role/all',
    method: 'post'
  })
}

export function list (data) {
  return request({
    url: '/role/list',
    method: 'post',
    data
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

export function updateEnable (data) {
  return request({
    url: '/role/update_enable',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function saveRoleMenu (data) {
  return request({
    url: '/role/save_role_menu',
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

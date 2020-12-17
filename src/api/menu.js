import request from '@/plugin/axios'

export function getLoginData () {
  return request({
    url: '/login/get_login_data',
    method: 'post'
  })
}

export function findMenuTreeList () {
  return request({
    url: '/menu/get_menu_tree_list',
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

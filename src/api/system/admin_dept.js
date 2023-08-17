import { request } from '@/api/service'

export function list (data) {
  return request({
    url: '/admin_dept/list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    url: '/admin_dept/save',
    method: 'post',
    data
  })
}

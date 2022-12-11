import { request } from '@/api/service'

export function list (data) {
  return request({
    url: '/admins_orgs/list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    url: '/admins_orgs/save',
    method: 'post',
    data
  })
}
import request from '@/plugin/axios'

export function list (data) {
  return request({
    url: '/admins_organizationals/list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    url: '/admins_organizationals/save',
    method: 'post',
    data
  })
}

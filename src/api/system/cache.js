import { request } from '@/api/service'

export function index () {
  return request({
    url: '/cache/index',
    method: 'post'
  })
}

export function buildAll () {
  return request({
    url: '/cache/build_all',
    method: 'post'
  })
}

export function getBaseSetting () {
  return request({
    url: '/cache/get_base_setting',
    method: 'post'
  })
}

import { request } from '@/api/service'

export function index () {
  return request({
    url: '/sys/cache/index',
    method: 'post'
  })
}

export function buildAll () {
  return request({
    url: '/sys/cache/build_all',
    method: 'post'
  })
}

export function getBaseSetting () {
  return request({
    url: '/sys/cache/get_base_setting',
    method: 'post'
  })
}

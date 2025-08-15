import { request } from '@/api/service'

export function getConfig (data) {
  return request({
    url: '/config/get_config',
    method: 'post',
    data
  })
}

export function updateValue (data) {
  return request({
    url: '/config/update_value',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

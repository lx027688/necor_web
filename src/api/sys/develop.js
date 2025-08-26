import { request } from '@/api/service'

export function generateCode (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/sys/generate/',
    method: 'post',
    responseType: 'blob',
    data
  })
}

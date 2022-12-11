import { request } from '@/api/service'

export function generateCode (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/generate/',
    method: 'post',
    responseType: 'blob',
    data
  })
}

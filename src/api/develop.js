import request from '@/plugin/axios'

export function generateCode (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/develop/generate_code',
    method: 'post',
    data
  })
}

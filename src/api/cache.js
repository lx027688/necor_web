import request from '@/plugin/axios'

export function systemInfo () {
  return request({
    url: '/cache/system_info',
    method: 'post'
  })
}

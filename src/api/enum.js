import { request } from '@/api/service'

export function getEnumDict (enumType) {
  return request({
    url: `/common/enum_dicts/${enumType}`,
    method: 'get'
  })
}

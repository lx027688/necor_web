import { request } from '@/api/service'

export function list (data) {
  return request({
    url: '/file_info/list',
    method: 'post',
    data
  })
}

// export function save (data) {
//   return request({
//     url: '/file_info/save',
//     method: 'post',
//     data
//   })
// }
//
// export function detail (id) {
//   return request({
//     url: '/file_info/detail/' + id,
//     method: 'get'
//   })
// }
//
// export function remove (id) {
//   return request({
//     url: '/file_info/remove/' + id,
//     method: 'post'
//   })
// }

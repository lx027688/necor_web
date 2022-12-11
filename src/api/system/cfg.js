import { request } from '@/api/service'

export function getGeneral () {
  return request({
    url: '/config/get/general',
    method: 'post'
  })
}

export function saveGeneral (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/config/save/general',
    method: 'post',
    data
  })
}

export function getStorage () {
  return request({
    url: '/config/get/storage',
    method: 'post'
  })
}

export function saveStorage (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/config/save/storage',
    method: 'post',
    data
  })
}

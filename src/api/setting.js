import request from '@/plugin/axios'

export function baseSettingDetail (data) {
  return request({
    url: '/setting/base_setting_detail',
    method: 'post',
    data
  })
}

export function baseSettingSave (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/setting/base_setting_save',
    method: 'post',
    data
  })
}

export function storageSettingDetail (data) {
  return request({
    url: '/setting/storage_setting_detail',
    method: 'post',
    data
  })
}

export function storageSettingSave (data) {
  return request({
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    url: '/setting/storage_setting_save',
    method: 'post',
    data
  })
}

import request from '@/plugin/axios'

export function list (data) {
	return request({
		url: '/interface_info/list',
		method: 'post',
		data
	})
}

export function save (data) {
	return request({
		url: '/interface_info/save',
		method: 'post',
		data
	})
}

export function detail (id) {
	return request({
		url: '/interface_info/detail/' + id,
		method: 'get'
	})
}

export function remove (id) {
	return request({
		url: '/interface_info/remove/' + id,
		method: 'post'
	})
}

export function updateIsLog (data) {
  return request({
    url: '/interface_info/update_islog',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

export function batchUpdateIsLog (data) {
  return request({
    url: '/interface_info/batch_update_islog',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

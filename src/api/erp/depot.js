import request from '@/plugin/axios'

export function list (data) {
	return request({
		url: '/erp/depot/list',
		method: 'post',
		data
	})
}

export function save (data) {
	return request({
		url: '/erp/depot/save',
		method: 'post',
		data
	})
}

export function detail (id) {
	return request({
		url: '/erp/depot/detail/' + id,
		method: 'get'
	})
}

export function remove (id) {
	return request({
		url: '/erp/depot/remove/' + id,
		method: 'post'
	})
}
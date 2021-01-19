import request from '@/plugin/axios'

export function list (data) {
	return request({
		url: '/erp/supplier/list',
		method: 'post',
		data
	})
}

export function save (data) {
	return request({
		url: '/erp/supplier/save',
		method: 'post',
		data
	})
}

export function detail (id) {
	return request({
		url: '/erp/supplier/detail/' + id,
		method: 'get'
	})
}

export function remove (id) {
	return request({
		url: '/erp/supplier/remove/' + id,
		method: 'post'
	})
}
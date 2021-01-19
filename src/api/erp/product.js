import request from '@/plugin/axios'

export function list (data) {
	return request({
		url: '/erp/product/list',
		method: 'post',
		data
	})
}

export function save (data) {
	return request({
		url: '/erp/product/save',
		method: 'post',
		data
	})
}

export function detail (id) {
	return request({
		url: '/erp/product/detail/' + id,
		method: 'get'
	})
}

export function remove (id) {
	return request({
		url: '/erp/product/remove/' + id,
		method: 'post'
	})
}
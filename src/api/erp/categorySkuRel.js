import request from '@/plugin/axios'

export function list (data) {
	return request({
		url: '/erp/category_sku_rel/list',
		method: 'post',
		data
	})
}

export function save (data) {
	return request({
		url: '/erp/category_sku_rel/save',
		method: 'post',
		data
	})
}

export function detail (category) {
	return request({
		url: '/erp/category_sku_rel/detail/' + category,
		method: 'get'
	})
}

export function remove (id) {
	return request({
		url: '/erp/category_sku_rel/remove/' + id,
		method: 'post'
	})
}

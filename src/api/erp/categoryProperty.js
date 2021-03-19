import request from '@/plugin/axios'

export function list (data) {
	return request({
		url: '/erp/category_property/list',
		method: 'post',
		data
	})
}

export function all (data) {
  return request({
    url: '/erp/category_property/all',
    method: 'post',
    params: data
  })
}

export function save (data) {
	return request({
		url: '/erp/category_property/save',
		method: 'post',
		data
	})
}

export function detail (category) {
	return request({
		url: '/erp/category_property/detail/' + category,
		method: 'get'
	})
}

export function remove (id) {
	return request({
		url: '/erp/category_property/remove/' + id,
		method: 'post'
	})
}

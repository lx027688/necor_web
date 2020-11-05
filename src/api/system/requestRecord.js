import request from '@/plugin/axios'

export function list (data) {
	return request({
		url: '/request_record/list',
		method: 'post',
		data
	})
}

/*export function save (data) {
	return request({
		url: '/request_record/save',
		method: 'post',
		data
	})
}*/

export function detail (id) {
	return request({
		url: '/request_record/detail/' + id,
		method: 'get'
	})
}

/*
export function remove (id) {
	return request({
		url: '/request_record/remove/' + id,
		method: 'post'
	})
}*/

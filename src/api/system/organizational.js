import request from '@/plugin/axios'

export function list (data) {
  return request({
    url: '/organizational/list',
    method: 'post',
    data
  })
}

export function findOrganizationalTree () {
	return request({
		url: '/organizational/tree',
		method: 'post'
	})
}

export function save (data) {
	return request({
		url: '/organizational/save',
		method: 'post',
		data
	})
}

export function detail (id) {
	return request({
		url: '/organizational/detail/' + id,
		method: 'get'
	})
}

export function remove (id) {
	return request({
		url: '/organizational/remove/' + id,
		method: 'post'
	})
}

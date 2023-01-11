import { request } from '@/api/service'

export function list (data) {
  return request({
    url: '/org/list',
    method: 'post',
    data
  })
}

export function findOrgTree () {
  return request({
    url: '/org/tree',
    method: 'post'
  })
}

export function treeList (data) {
  return request({
    url: '/org/tree_list',
    method: 'post',
    data
  })
}

export function save (data) {
  return request({
    url: '/org/save',
    method: 'post',
    data
  })
}

export function detail (id) {
  return request({
    url: '/org/detail/' + id,
    method: 'get'
  })
}

export function remove (id) {
  return request({
    url: '/org/remove/' + id,
    method: 'post'
  })
}

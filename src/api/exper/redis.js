import request from '@/plugin/axios'

/**
 * redis 插入数据
 * @returns {*}
 */
export function add (data) {
  return request({
    url: '/exper/redis/add',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

/**
 * redis 删除数据
 * @returns {*}
 */
export function remove (data) {
  return request({
    url: '/exper/redis/remove',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

/**
 * redis 获取数据
 * @returns {*}
 */
export function get (data) {
  return request({
    url: '/exper/redis/get',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

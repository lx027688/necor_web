import request from '@/plugin/axios'

/**
 * 获取定时任务
 * @returns {*}
 */
export function getJobs () {
  return request({
    url: '/exper/quartz/get_jobs',
    method: 'get'
  })
}

/**
 * 获取所有定时任务组
 * @param data
 * @returns {*}
 */
export function getGroups (data) {
  return request({
    url: '/exper/quartz/get_groups',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

/**
 * 获取定时任务组
 * @param data
 * @returns {*}
 */
export function getGroup (data) {
  return request({
    url: '/exper/quartz/get_group',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

/**
 * 添加任务
 * @param data
 * @returns {*}
 */
export function addJob (data) {
  return request({
    url: '/exper/quartz/addjob',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

/**
 * 编辑任务
 * @param data
 * @returns {*}
 */
export function reschedulejob (data) {
  return request({
    url: '/exper/quartz/reschedulejob',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

/**
 * 删除任务
 * @param data
 * @returns {*}
 */
export function remove (data) {
  return request({
    url: '/exper/quartz/deletejob/',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

/**
 * 暂停任务
 * @param data
 * @returns {*}
 */
export function pause (data) {
  return request({
    url: '/exper/quartz/pausejob/',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

/**
 * 开启任务
 * @param data
 * @returns {*}
 */
export function resume (data) {
  return request({
    url: '/exper/quartz/resumejob/',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data
  })
}

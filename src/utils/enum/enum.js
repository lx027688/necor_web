import Vue from 'vue'
import { getEnumDict } from '@/api/enum'

const enumState = Vue.observable({
  dicts: {},
  loading: {}
})

/**
 * 规范化后端返回的枚举数据
 * @param {Object} data 后端响应中的 data 字段
 * @returns {Object} 可用的枚举字典对象
 */
function normalizeEnumData (data) {
  if (!data || typeof data !== 'object') {
    return {}
  }
  return data
}

/**
 * 按枚举名称从后端获取字典，并在前端做缓存与并发复用
 * @param {String} enumType 枚举名称
 * @returns {Promise<Object>} 枚举字典
 */
export function loadEnumDict (enumType) {
  if (!enumType) {
    return Promise.resolve({})
  }
  if (enumState.dicts[enumType]) {
    return Promise.resolve(enumState.dicts[enumType])
  }
  if (enumState.loading[enumType]) {
    return enumState.loading[enumType]
  }
  const requestPromise = getEnumDict(enumType).then(res => {
    const dict = normalizeEnumData(res.data)
    Vue.set(enumState.dicts, enumType, dict)
    return dict
  }).catch(() => {
    Vue.set(enumState.dicts, enumType, {})
    return {}
  }).finally(() => {
    Vue.delete(enumState.loading, enumType)
  })
  Vue.set(enumState.loading, enumType, requestPromise)
  return requestPromise
}

/**
 * 获取本地缓存中的枚举字典，若不存在则触发按需加载
 * @param {String} enumType 枚举名称
 * @returns {Object} 当前已缓存的枚举字典
 */
function ensureEnumDict (enumType) {
  if (!enumType) {
    return {}
  }
  if (!enumState.dicts[enumType] && !enumState.loading[enumType]) {
    loadEnumDict(enumType)
  }
  return enumState.dicts[enumType] || {}
}

/**
 * 根据枚举名称和值获取展示文案
 * @param {String} enumType 枚举名称
 * @param {String} enumValue 枚举值
 * @param {String} lang 语言，默认中文
 * @returns {String} 枚举文案，未命中时返回原值
 */
export function translateEnum (enumType, enumValue, lang = 'zh') {
  const translation = ensureEnumDict(enumType)[enumValue]
  if (!translation) {
    return enumValue
  }
  return translation[lang] || translation.zh || enumValue
}

/**
 * 将枚举字典转换为下拉组件可用的选项数组
 * @param {String} enumType 枚举名称
 * @param {String} lang 语言，默认中文
 * @returns {Array<{label: String, value: String}>} 下拉选项数组
 */
export function selectOptions (enumType, lang = 'zh') {
  const dict = ensureEnumDict(enumType)
  return Object.keys(dict).map(key => ({
    label: translateEnum(enumType, key, lang),
    value: key
  }))
}

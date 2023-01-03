import { dictTree } from '@api/system/dict'
import { dbSet, dbGet } from '@/libs/util.db'

export function loadDict (codes = []) {
  return new Promise((resolve, reject) => {
    codes.forEach(code => {
      if (isBlank(code)) {
        return
      }
      const dict = dbGet({ path: code, user: false })
      if (this.isBlank(dict)) {
        dictTree(code).then(res => {
          // 本地保存数据字典
          dbSet({
            path: code,
            value: res.data,
            user: false
          })
          resolve(1)
        }).catch(err => {
          console.log('err', err)
        })
      } else {
        resolve(1)
      }
    })
  })
}

export function getDict (code) {
  if (isBlank(code)) {
    return
  }
  if (code.length === 3) {
    return dbGet({ path: code, user: false })
  }

  let dict = dbGet({ path: code, user: false })
  if (this.isNotBlank(dict)) {
    return dict
  }

  const parentCode = code.slice(0, code.length - 3)
  dict = dbGet({ path: parentCode, user: false })
  if (this.isBlank(dict)) {
    return code
  }
  const d = dict.children.filter(e => e.code === code)
  return this.isNotBlank(d) ? d[0] : code
}

export function isBlank (value) {
  return value === null || value === '' || typeof value === 'undefined' || value.length === 0
}

export function isNotBlank (value) {
  return !isBlank(value)
}

export function abbr (str, length, ellipsis) {
  if (isNotBlank(str) && !isNaN(length) && str.length > length) {
    if (isBlank(ellipsis)) {
      ellipsis = '...'
    }
    return str.substring(0, length) + ellipsis
  } else {
    return str
  }
}

export function contains (arr = [], item) {
  return arr.indexOf(item) !== -1
}

/**
 * 返回数组并集
 * @param arr1
 * @param arr2
 * @returns {*[]}
 */
export function union (arr1, arr2) {
  const arr = Array.from(new Set([...arr1, ...arr2]))
  return arr
}

import { dictRoot } from '@api/system/dict'
import { dbSet, dbGet } from '@/libs/util.db'
import axios from 'axios'
import { Base64 } from 'js-base64'

export function loadDict () {
  return new Promise((resolve, reject) => {
    dictRoot().then(res => {
      if (isNotBlank(res) && isNotBlank(res.data)) {
        const path = process.env.VUE_APP_TITLE + '-dict'
        dbSet({ path: path, value: res.data, user: false })
      }
      resolve(1)
    }).catch(err => {
      console.log('err', err)
    })
  })
}

export function getDict (code) {
  if (isBlank(code)) {
    return
  }

  const path = process.env.VUE_APP_TITLE + '-dict'

  let dict = dbGet({ path: path, user: false })

  if (this.isBlank(dict)) {
    return
  }

  if (code.length === 3) {
    const d = dict.filter(e => e.code === code)
    if (isBlank(d)) {
      return
    } else {
      return d[0]
    }
  }

  const rootCode = code.slice(0, 3)
  const d = dict.filter(e => e.code === rootCode)
  if (isBlank(d)) {
    return
  }
  dict = d[0]

  for (let i = 6; i <= code.length; i += 3) {
    const childCode = code.slice(0, i)

    const d = dict.children.filter(e => e.code === childCode)

    if (isBlank(d)) {
      return
    } else {
      dict = d[0]
    }
  }

  return dict
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

export function getFileByBase64 (path) {
  return new Promise((resolve, reject) => {
    axios.get(path, { responseType: 'arraybuffer' }).then(response => {
      resolve(Base64.encode(new Uint8Array(response.data)))
    }).catch(error => {
      console.log(error)
      resolve(null)
    })
  })
}

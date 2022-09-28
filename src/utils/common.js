import {dictTree} from "@api/system/dict"

export function convertDict (code) {
  if(isBlank(code)){
    return ;
  }
  let dict = this.$localStore.get(code)
  if (this.isBlank(dict)) {
    let parentCode = code.slice(0, code.length-3)
    dict = this.$localStore.get(parentCode)
    if(this.isBlank(dict)){
      dictTree(parentCode).then(res => {
        // 本地保存数据字典
        this.$localStore.set(parentCode, res.data)

        let d = res.data.children.filter(e=> e.code === code)
        return this.isNotBlank(d)?d[0].name:''
      }).catch(err => {
        console.log('err', err)
      })
    }else {
      let d = dict.children.filter(e=> e.code === code)
      return this.isNotBlank(d)?d[0].name:''
    }
  }else {
    return dict.name
  }
}

export function isBlank (value) {
  return value === null || value === '' || typeof value === 'undefined' || value.length === 0
}

export function isNotBlank (value) {
  return !this.isBlank(value)
}

export function abbr (str,length,ellipsis) {
  if(this.isNotBlank(str) && !isNaN(length) && str.length > length){
    if(this.isBlank(ellipsis)){
      ellipsis = '...'
    }
    return str.substring(0,length) + ellipsis;
  }else{
    return str
  }
}

export function contains (arr= [],item) {
  return arr.indexOf(item) !== -1
}

/**
 * 返回数组并集
 * @param arr1
 * @param arr2
 * @returns {*[]}
 */
export function union (arr1,arr2){
  let arr = Array.from(new Set([...arr1, ...arr2]));
  return arr
}

import {dictChilds1} from "@api/system/dict"

export function convertDict (code) {
  let dict = this.$localStore.get(code);
  if (this.isBlank(dict)) {
    let parentCode = code.slice(0, code.length-3)
    dictChilds1(parentCode).then(r => {
      for(let i=0;i<r.data.length;i++){
        let d = r.data[i]
        this.$localStore.set(d.code, d.name)
      }
    })

    dict = this.$localStore.get(code);
    return this.isBlank(dict)?code:dict
  }else {
    return dict
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

import {dictChilds1} from "@api/system/dict"

export function cacheDict (codes) {
  if(this.isNotBlank(codes)){
    console.log(codes.split(','))
    codes.split(',').forEach(code=>{
      let dict = this.$localStore.get(code);
      if (this.isBlank(dict)) {
        dictChilds1(code).then(r => {
          for(let i=0;i<r.data.length;i++){
            let d = r.data[i]
            this.$localStore.set(d.code, d.name)
          }
        })
      }
    })
  }
}
export function convertDict (code) {
  let dict = this.$localStore.get(code);
  if (dict!=null) {
    return dict
  }
  return code
}
// export function convertDict (code, value,ds) {
//   let dicts = []
//   if(!isBlank(ds)) {
//     dicts = ds
//   }else {
//     dicts = this.$localStore.get('dicts')
//   }
//   if (dicts.length > 0) {
//     for (let i = 0; i < dicts.length; i++) {
//       if (dicts[i].code === value) {
//         return dicts[i].name
//       }
//       if (dicts[i].code === code) {
//         let children = dicts[i].children
//         if(!isBlank(children)){
//           for (let j = 0; j < children.length; j++) {
//             if (value === children[j].code) {
//               return children[j].name
//             }
//           }
//           let name = '';
//           for (let k = 0; k < children.length; k++) {
//             let result = convertDict(children[k].code,value,children)
//             if(!isBlank(result)) {
//               name = result
//             }
//           }
//           return name
//         }else {
//           return ''
//         }
//       }
//     }
//   }
//   return ''
// }

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

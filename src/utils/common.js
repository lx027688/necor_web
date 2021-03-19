export function convertDict (code, value,ds) {
  let dicts = []
  if(!isBank(ds)) {
    dicts = ds
  }else {
    dicts = this.$localStore.get('dicts')
  }
  if (dicts.length > 0) {
    for (let i = 0; i < dicts.length; i++) {
      if (dicts[i].code === value) {
        return dicts[i].name
      }
      if (dicts[i].code === code) {
        let children = dicts[i].children
        if(!isBank(children)){
          for (let j = 0; j < children.length; j++) {
            if (value === children[j].code) {
              return children[j].name
            }
          }
          let name = '';
          for (let k = 0; k < children.length; k++) {
            let result = convertDict(children[k].code,value,children)
            if(!isBank(result)) {
              name = result
            }
          }
          return name
        }else {
          return ''
        }
      }
    }
  }
  return ''
}

export function isBank (value) {
  return value === null || value === '' || typeof value === 'undefined' || value.length === 0
}

export function isNotBank (value) {
  return !this.isBank(value)
}

export function abbr (str,length,ellipsis) {
  if(this.isNotBank(str) && !isNaN(length) && str.length > length){
    if(this.isBank(ellipsis)){
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

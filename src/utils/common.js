export function convertDict (code, value) {
  // if (!code || !value) {
  //   return ''
  // }
  let dicts = this.$localStore.get('dicts')
  if (dicts.length > 0) {
    for (let i = 0; i < dicts.length; i++) {
      if (dicts[i].code === code) {
        let childrens = dicts[i].childrens
        for (let j = 0; j < childrens.length; j++) {
          if (value === childrens[j].code) {
            return childrens[j].name
          }
        }
        if (code === value) {
          return dicts[i].name
        }
        return ''
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

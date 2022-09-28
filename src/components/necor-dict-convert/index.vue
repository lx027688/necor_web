<template>
  <div>
    {{ name }}
  </div>
</template>

<script>
import {dictTree} from "@api/system/dict";
import {isBlank} from "@/utils/common";

export default {
  name: 'necor-dict-convert',
  componentName: 'NecorDictConvert',
  data () {
    return {
      name: ''
    }
  },
  props: {
    code: {
      type: String
    }
  },
  watch: {
    name (val, oldVal) {
      if (val !== oldVal) {
        this.name = val
      }
    }
  },
  mounted () {
    if(isBlank(this.code)){
      return ;
    }
    let dict = this.$localStore.get(this.code)
    if (this.isBlank(dict)) {
      let parentCode = this.code.slice(0, this.code.length-3)
      dict = this.$localStore.get(parentCode)
      if(this.isBlank(dict)){
        dictTree(parentCode).then(res => {
          // 本地保存数据字典
          this.$localStore.set(parentCode, res.data)

          let d = res.data.children.filter(e=> e.code === this.code)
          this.name = this.isNotBlank(d)?d[0].name:'';
        }).catch(err => {
          console.log('err', err)
        })
      }else {
        let d = dict.children.filter(e=> e.code === this.code)
        this.name = this.isNotBlank(d)?d[0].name:''
      }
    }else {
      this.name = dict.name
    }
  },
  methods: {
    changeHand () {
      this.$emit('change')
    }
  }
}
</script>

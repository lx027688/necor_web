<template>
  <div>
    <el-radio-group v-model="selectValue" :disabled="disabled" @change="changeHand">
      <el-radio v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import {dictTree} from "@api/system/dict";

export default {
  name: 'necor-dict-radio',
  componentName: 'NecorDictRadio',
  data () {
    return {
      options: [],
      selectValue: ''
    }
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    // 导入的url地址
    code: {
      type: String
    },
    // 接受外部v-model传入的值，必须使用value
    value: {
      type: String
    }
  },
  watch: {
    // 判断下拉框的值是否有改变
    selectValue (val, oldVal) {
      if (val !== oldVal) {
        this.$emit('input', this.selectValue)
      }
    },
    value (val) {
      if (typeof val === 'number') {
        this.selectValue = val.toString()
      } else {
        this.selectValue = val
      }
    }
  },
  mounted () {
    let dict = this.$localStore.get(this.code)
    if (this.isNotBlank(dict)) {
      this.options = []
      let children = dict.children
      for (let j = 0; j < children.length; j++) {
        this.options[j] = {}
        this.options[j].label = children[j]['name']
        this.options[j].value = children[j]['code']
        this.options[j].key = j
      }
    }else{
      dictTree(this.code).then(res => {
        // 本地保存数据字典
        this.$localStore.set(this.code, res.data)
      }).catch(err => {
        console.log('err', err)
      })
    }
  },
  methods: {
    changeHand () {
      this.$emit('change')
    }
  }
}
</script>

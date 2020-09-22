<template>
  <div>
    <el-select v-model="selectValue" autocomplete clearable :disabled="disabled" :placeholder="placeholder" filterable @change="changeHand">
      <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'necor-dict-select',
  componentName: 'NecorDictSelect',
  data () {
    return {
      placeholder: '请选择',
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
    let dicts = this.$localStore.get('dicts')
    if (dicts.length > 0) {
      for (let i = 0; i < dicts.length; i++) {
        if (dicts[i]['code'] === this.code) {
          this.placeholder = dicts[i]['name']
          let childrens = dicts[i].childrens
          for (let j = 0; j < childrens.length; j++) {
            this.options[j] = {}
            this.options[j].label = childrens[j]['name']
            this.options[j].value = childrens[j]['code']
            this.options[j].key = j
          }
          break
        }
      }
    }
  },
  methods: {
    changeHand () {
      this.$emit('change')
    }
  }
}
</script>

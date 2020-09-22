<template>
  <div>
    <el-radio-group v-model="selectValue" :disabled="disabled" @change="changeHand">
      <el-radio v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
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

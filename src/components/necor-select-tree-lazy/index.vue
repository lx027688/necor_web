<template>
  <el-select v-model="selectValue" :clearable="clearable" @clear="clearHandle">
    <el-option v-model="selectValue" :label="valueTitle">
      <el-tree  id="tree-option" ref="selectTree" :accordion="accordion" :props="props" :node-key="props.value"
                :default-expanded-keys="defaultExpandedKey" lazy :load="loadNode" @node-click="handleNodeClick">
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'necor-select-tree-lazy',
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          label: 'name',
          children: 'children',
          isLeaf: 'leaf',
          value: 'id' // ID字段名
        }
      }
    },
    /* 初始值 */
    value: {
      type: String,
      default: () => { return '' }
    },
    label: {
      type: String,
      default: () => { return '' }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => { return true }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => { return false }
    },
    lazy: {
      type: Boolean,
      default: () => { return false }
    }
  },
  data () {
    return {
      selectValue: '', // 初始值
      valueTitle: '',
      defaultExpandedKey: []
    }
  },
  mounted () {
    this.initHandle()
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
      this.initHandle()
    },
    label (val) {
      this.valueTitle = val
    }
  },
  methods: {
    // 初始化值
    initHandle () {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => {
          ele.style.width = 0
        })
      })
    },
    // 切换选项
    handleNodeClick (node) {
      this.valueTitle = node[this.props.label]
      this.selectValue = node[this.props.value]
      this.$emit('input', this.selectValue)
      this.defaultExpandedKey = []
    },
    // 清除选中
    clearHandle () {
      this.valueTitle = ''
      this.selectValue = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('input', null)
    },
    /* 清空选中样式 */
    clearSelected () {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element) => element.classList.remove('is-current'))
    },
    loadNode (node, resolve) {
      this.$emit('load', node, resolve)
    }
  }
}
</script>

<style scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
  ul li >>>.el-tree .el-tree-node__content{
    height:auto;
    padding: 0 20px;
  }
  .el-tree-node__label{
    font-weight: normal;
  }
  .el-tree >>>.is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
    color:#606266;
    font-weight: normal;
  }
</style>

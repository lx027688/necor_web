<template>
  <div class="t_pagination_select">
    <!-- 多选时是否将选中值只展示第一个-->
    <el-select v-if="multiple && collapse" v-model="childSelectedValue" @change="(val) => $emit('change',val)" :style="{width: width||'100%'}" v-bind="attrs"
               :remote-method="(val) => $emit('page-change',1,val)" @focus="() => $emit('page-change',1,null)" remote multiple collapse-tags>
      <el-option v-for="item in optionSource" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]"></el-option>
      <el-pagination small layout="prev, pager, next" @current-change="(val) => $emit('page-change',val)" :hide-on-single-page="true" :page-size="paginationOption.pageSize"
                     :current-page="paginationOption.currentPage" :pager-count="paginationOption.pagerCount" :total="paginationOption.total"></el-pagination>
    </el-select>
    <!-- 多选时是否将选中值按文字的形式展示-->
    <el-select v-else-if="multiple && !collapse" v-model="childSelectedValue" @change="(val) => $emit('change',val)" :style="{width: width||'100%'}" v-bind="attrs"
               :remote-method="(val) => $emit('page-change',1,val)" @focus="() => $emit('page-change',1,null)" remote multiple>
      <el-option v-for="item in optionSource" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]"></el-option>
      <el-pagination small layout="prev, pager, next" @current-change="(val) => $emit('page-change',val)" :hide-on-single-page="true" :page-size="paginationOption.pageSize"
                     :current-page="paginationOption.currentPage" :pager-count="paginationOption.pagerCount" :total="paginationOption.total"></el-pagination>
    </el-select>
    <!-- 单选-->
    <el-select v-else v-model="childSelectedValue" @change="(val) => $emit('change',val)" :style="{width: width||'100%'}" v-bind="attrs"
               :remote-method="(val) => $emit('page-change',1,val)" @focus="() => $emit('page-change',1,null)" remote>
      <el-option v-for="item in optionSource" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]"></el-option>
      <el-pagination small layout="prev, pager, next" @current-change="(val) => $emit('page-change',val)" :hide-on-single-page="true" :page-size="paginationOption.pageSize"
                     :current-page="paginationOption.currentPage" :pager-count="paginationOption.pagerCount" :total="paginationOption.total"></el-pagination>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'necor-select-page',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    collapse: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array]
    },
    // 选择框宽度
    width: {
      type: String
    },
    // 传入的option数组中，要作为最终选择项的键值名称
    valueKey: {
      type: String
    },
    // 传入的option数组中，要作为显示项的键值名称
    labelKey: {
      type: String
    },
    // 下拉框组件数据源
    optionSource: {
      type: Array
    },
    // 分页配置项
    paginationOption: {
      type: Object,
      default: () => {
        return {
          pageSize: 6, // 每页显示条数
          currentPage: 1, // 当前页
          pagerCount: 5, // 按钮数，超过时会折叠
          total: 0 // 总条数
        }
      }
    }
  },
  computed: {
    childSelectedValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    attrs () {
      return {
        'popper-append-to-body': false,
        clearable: true,
        filterable: true,
        ...this.$attrs
      }
    }
  },
  mounted () {
    this.$emit('page-change', 1, null)
  },
  watch: {
    childSelectedValue (val) {
      this.childSelectedValue = val
    }
  }
}
</script>

<style scoped>
.t_pagination_select {
    ::v-deep .el-pagination {
    display: flex;
    margin-top: 15px;
    margin-left: 15px;
    background-color: #fff;
    align-items: center;
  }
}
/deep/ .el-pagination .el-pager {
  display: flex;
  align-items: center;
}
</style>

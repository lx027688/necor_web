<template>
  <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" :page-sizes="pageSizes" layout="total, sizes, prev, pager, next, jumper"
                 style="margin: -10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    cp: {
      required: true,
      type: Number,
      default: 1
    },
    ps: {
      required: true,
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default () {
        return [10, 30, 50, 100]
      }
    }
  },
  computed: {
    currentPage: {
      get () {
        return this.cp
      },
      set (val) {
        this.$emit('update:cp', val)
      }
    },
    pageSize: {
      get () {
        return this.ps
      },
      set (val) {
        this.$emit('update:ps', val)
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.$emit('pagination', { cp: this.currentPage, ps: val })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.$emit('pagination', { cp: val, ps: this.pageSize })
    }
  }
}
</script>

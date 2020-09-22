<template>
<d2-container>
  <!-- 查询 -->
  <el-form :inline="true" :model="query" ref="form" style="margin-bottom: -18px;">
    <el-form-item label="" prop="search">
      <el-input v-model="query.search" placeholder="搜索项" style="width: 180px;"/>
    </el-form-item>
    <el-form-item>
    <el-button type="primary" @click="search()">
      <d2-icon name="search"/>查询
    </el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveHandle()">
      <d2-icon name="plus"/>新增</el-button>
    </el-form-item>
  </el-form>

  <!-- 列表-->
  <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChangeHandle" v-loading="loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
    <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
    <el-table-column prop="createDate" header-align="center" align="center" sortable="custom" label="创建时间"></el-table-column>
    <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
    <el-table-column prop="ident" header-align="center" align="center" label="标识"></el-table-column>
    <el-table-column prop="description" header-align="center" align="center" label="描述"></el-table-column>
    <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
      <template slot-scope="scope">
        <el-button type="text" size="small">查看</el-button>
        <el-button type="text" size="small" @click="saveHandle(scope.row.id)">修改</el-button>
        <el-button type="text" size="small" @click="removeHandle(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 列表尾部-->
  <pagination :cp.sync="query.currentPage" :ps.sync="query.pageSize" :total.sync="query.total" @pagination="getList"></pagination>

  <!-- 弹窗, 新增 / 修改 -->
  <save v-if="saveVisible" ref="save" @refreshList="getList"></save>
</d2-container>
</template>

<script>
import { list, remove } from '@api/nav/position'
import pagination from '@/components/pagination'
import save from './save'

export default {
  name: 'system-navPosition',
  components: { pagination, save },
  data () {
    return {
      loading: false,
      query: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        search: '',
        orderKey: '',
        orderVal: ''
      },
      data: [],
      saveVisible: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    search () {
      this.query.currentPage = 1
      this.getList()
    },
    getList () {
      this.loading = true
      list({ ...this.query }).then(res => {
        this.data = res.data
        this.query.total = res.recordsFiltered
        this.loading = false
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    sortChange (column, prop, order) {
      this.query.orderKey = column.prop
      this.query.orderVal = column.order
      if (this.query.orderKey !== undefined && this.query.orderVal !== undefined) {
        this.getList()
      }
    },
    selectionChangeHandle (val) {
      console.log(val)
    },
    // 新增 / 修改
    saveHandle (id) {
      this.saveVisible = true
      this.$nextTick(() => {
        this.$refs.save.init(id)
      })
    },
    removeHandle (id) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(id).then(r => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(err => {
          console.log('err', err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

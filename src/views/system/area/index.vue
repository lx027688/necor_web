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
  <el-table :data="data" @sort-change="sortChange" v-loading="loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;"
            row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" lazy :load="load">
    <el-table-column prop="name" header-align="left" align="left" label="区域名称"></el-table-column>
    <el-table-column prop="simpleName" header-align="center" align="center" label="区域简称"></el-table-column>
    <el-table-column prop="parentName" header-align="center" align="center" label="所属区域">
      <template slot-scope="scope">{{scope.row.parent.name}}</template>
    </el-table-column>
    <el-table-column prop="level" header-align="center" align="center" label="级别" sortable="custom">
      <template slot-scope="scope">
        <necor-dict-convert :code="scope.row.level"></necor-dict-convert>
      </template>
    </el-table-column>
    <el-table-column prop="code" header-align="center" align="center" label="区域代码"></el-table-column>
    <el-table-column prop="lon" header-align="center" align="center" label="区域经度"></el-table-column>
    <el-table-column prop="lat" header-align="center" align="center" label="区域纬度"></el-table-column>
    <el-table-column prop="zipCode" header-align="center" align="center" label="区域邮编"></el-table-column>
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
import { list, getArea, remove } from '@api/system/area'
import pagination from '@/components/pagination'
import save from './save'

export default {
  name: 'system-area',
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
        orderVal: '',
        parentId: ''
      },
      data: [],
      saveVisible: false
    }
  },
  beforeCreate () {
  },
  mounted () {
    this.loadDict(['105']).then(() => {
      this.getList()
    })
  },
  methods: {
    search () {
      this.query.currentPage = 1
      this.getList()
    },
    getList () {
      this.loading = true
      // 开始请求登录接口
      list({ ...this.query }).then(r => {
        const res = r.data
        this.data = res.data
        this.query.total = res.recordsFiltered
        this.loading = false
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    load (tree, treeNode, resolve) {
      if (this.isNotBlank(tree) && this.isNotBlank(tree.id)) {
        var params = new URLSearchParams()
        params.append('parentId', tree.id)
        getArea(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          console.log('err', err)
        })
      }
    },
    sortChange (column, prop, order) {
      this.query.orderKey = column.prop
      this.query.orderVal = column.order
      if (this.query.orderKey !== undefined && this.query.orderVal !== undefined) {
        this.getList()
      }
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

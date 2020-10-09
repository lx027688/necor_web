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
    </el-form>

    <!-- 列表-->
    <el-table :data="data" @sort-change="sortChange" v-loading="loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
      <el-table-column prop="createDate" header-align="center" align="center" sortable="custom" label="创建时间" width="160"></el-table-column>
      <el-table-column prop="fileType" header-align="center" align="center" label="文件类型" width="100">
        <template slot-scope="scope">{{convertDict('102',scope.row.fileType)}}</template>
      </el-table-column>
      <el-table-column prop="busiType" header-align="center" align="center" label="业务类型" width="120">
        <template slot-scope="scope">{{convertDict('199',scope.row.busiType)}}</template>
      </el-table-column>
      <el-table-column prop="busiNo" header-align="center" align="center" label="业务编号" width="300"></el-table-column>
      <el-table-column prop="saveName" header-align="center" align="center" label="文件存储名" width="220"></el-table-column>
      <el-table-column prop="expandName" header-align="center" align="center" label="扩展名" width="100"></el-table-column>
      <el-table-column prop="size" header-align="center" align="center" label="文件大小（B）"></el-table-column>
      <el-table-column prop="netPath" header-align="center" align="center" label="网络路径" width="500">
        <template slot-scope="scope"><a :href="scope.row.netPath" target="_blank">{{scope.row.netPath}}</a></template>
      </el-table-column>
      <!--<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="removeHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <!-- 列表尾部-->
    <pagination :cp.sync="query.currentPage" :ps.sync="query.pageSize" :total.sync="query.total" @pagination="getList"></pagination>

  </d2-container>
</template>

<script>
import { list } from '@api/fileInfo'
import pagination from '@/components/pagination'

export default {
  name: 'system-fileInfo',
  components: { pagination },
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
      data: []
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
      list({ ...this.query }).then(r => {
        let res = r.data
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
    }
    // removeHandle (id) {
    //   this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     remove(id).then(r => {
    //       this.getList()
    //       this.$message({
    //         message: '删除成功',
    //         type: 'success'
    //       })
    //     }).catch(err => {
    //       console.log('err', err)
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     })
    //   })
    // }
  }
}
</script>

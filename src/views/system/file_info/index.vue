<template>
  <d2-container>
    <!-- 查询 -->
    <el-form :inline="true" :model="query" ref="form" @submit.native.prevent style="margin-bottom: -18px;">
      <el-form-item label="" prop="search">
        <el-input v-model="query.search" placeholder="搜索项" clearable @keyup.enter.native="search" style="width: 180px;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()"><d2-icon name="search"/>&nbsp;查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refresh"><d2-icon name="refresh"/>&nbsp;重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表-->
    <el-table :data="data" @sort-change="sortChange" v-loading="loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
      <el-table-column prop="createdAt" header-align="center" align="center" sortable="custom" label="创建时间" width="160"></el-table-column>
      <el-table-column prop="fileType" header-align="center" align="center" label="文件类型" width="100">
        <template v-slot="scope">
          {{translateEnum('FILE_TYPE', scope.row.fileType)}}
        </template>
      </el-table-column>
      <el-table-column prop="busiType" header-align="center" align="center" label="业务类型" width="120">
        <template v-slot="scope">
          <necor-dict-convert :code="scope.row.busiType"></necor-dict-convert>
        </template>
      </el-table-column>
      <el-table-column prop="busiNo" header-align="center" align="center" label="业务编号" width="300"></el-table-column>
      <el-table-column prop="saveName" header-align="center" align="center" label="文件存储名" width="220"></el-table-column>
      <el-table-column prop="expandName" header-align="center" align="center" label="扩展名" width="100"></el-table-column>
      <el-table-column prop="size" header-align="center" align="center" label="文件大小（B）"></el-table-column>
    </el-table>

    <!-- 列表尾部-->
    <pagination :cp.sync="query.currentPage" :ps.sync="query.pageSize" :total.sync="query.total" @pagination="getPage"></pagination>

  </d2-container>
</template>

<script>
import { page } from '@api/system/fileInfo'
import pagination from '@/components/pagination'

const originalData = {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  search: '',
  orderKey: '',
  orderVal: ''
}

export default {
  name: 'system-fileInfo',
  components: { pagination },
  data () {
    return {
      loading: false,
      query: this.cloneDeep(originalData),
      data: []
    }
  },
  beforeCreate () {
  },
  mounted () {
    this.getPage()
  },
  methods: {
    search () {
      this.query.currentPage = 1
      this.getPage()
    },
    refresh () {
      this.query = this.resetFormData('form', originalData)
      this.search()
    },
    getPage () {
      this.loading = true
      page({ ...this.query }).then(r => {
        const res = r.data
        this.data = res.data
        this.query.total = Number(res.recordsFiltered)
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
        this.getPage()
      }
    }
  }
}
</script>

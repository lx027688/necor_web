<template>
  <d2-container>
    <!-- 查询 -->
    <el-form :inline="true" :model="query" ref="form" style="margin-bottom: -18px;">
      <el-form-item label="" prop="search">
        <el-input v-model="query.search" placeholder="标签或标题" style="width: 180px;"/>
      </el-form-item>
      <el-form-item label="" prop="country">
        <necor-dict-select v-model="query.country" code="106"></necor-dict-select>
      </el-form-item>
      <el-form-item label="" prop="navPositionId">
        <el-select v-model="query.navPositionId" clearable placeholder="请选择导航位">
          <el-option v-for="p in positions" :key="p.id" :label="p.name" :value="p.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
      <el-button type="primary" @click="search">
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
      <el-table-column prop="createDate" header-align="center" align="center" sortable="custom" label="创建时间" width="160"></el-table-column>
      <el-table-column prop="title" header-align="center" align="center" label="标题" width="250">
        <template slot-scope="scope"><el-link type="primary" :href="scope.row.url" target="_blank" :title="scope.row.url">{{scope.row.title}}</el-link></template>
      </el-table-column>
      <el-table-column prop="tag" header-align="center" align="center" label="标签" width="300">
        <template slot-scope="scope">
          <el-tag v-for="t in scope.row.tag.split(',')">{{t}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="country" header-align="center" align="center" label="国家">
        <template slot-scope="scope">{{convertDict('106',scope.row.country)}}</template>
      </el-table-column>
      <el-table-column prop="isEnable" header-align="center" align="center" label="是否启用">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnable==='100000' ? 'success' : 'danger'" disable-transitions @click="updateNavEnable(scope.row.id,scope.row.isEnable)" style="cursor:pointer;">{{scope.row.isEnable==='100000'?'可用':'不可用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row.id)">查看</el-button>
          <el-button type="text" size="small" @click="saveHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="removeHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 列表尾部-->
    <pagination :cp.sync="query.currentPage" :ps.sync="query.pageSize" :total.sync="query.total" @pagination="getList"></pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <save v-if="saveVisible" ref="save" @refreshList="getList"></save>

    <!-- 弹窗, 详情 -->
    <detail v-if="detailVisible" ref="detail"></detail>
  </d2-container>
</template>

<script>
import { list, remove, updateEnable } from '@api/nav/baseInfo'
import { all } from '@api/nav/position'
import pagination from '@/components/pagination'
import save from './save'
import detail from './detail'

export default {
  name: 'system-nav',
  components: { pagination, save, detail },
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
        country: '',
        navPositionId: ''
      },
      data: [],
      saveVisible: false,
      detailVisible: false,
      positions: []
    }
  },
  mounted () {
    this.getPosition()
    this.getList()
  },
  methods: {
    search () {
      this.query.currentPage = 1
      this.getList()
    },
    getList () {
      this.loading = true
      var params = new URLSearchParams(this.query)
      list(params).then(r => {
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
    // 详情
    detailHandle (id) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detail.init(id)
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
    },
    updateNavEnable (id, isEnable) {
      let params = new FormData()
      params.append('id', id)
      isEnable = isEnable === '100000' ? '100001' : '100000'
      params.append('isEnable', isEnable)
      updateEnable(params).then(res => {
        this.getList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    getPosition () {
      all().then(res => {
        this.positions = res.data
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
}
</script>

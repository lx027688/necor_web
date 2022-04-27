<template>
  <el-dialog title="供应商" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <!-- 查询 -->
    <el-form :inline="true" ref="form" style="margin-bottom: -18px;">
      <el-form-item label="" prop="search">
        <el-input v-model="query.search" placeholder="搜索项" style="width: 180px;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">
          <d2-icon name="search"/>查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirmSelect">
          <d2-icon name="confirm"/>确定选择
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 列表-->
    <el-table :data="data" @sort-change="sortChange" v-loading="loading" @selection-change="handleSelect" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;" ref="multipleTable">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
      <el-table-column prop="mnCode" header-align="center" align="center" label="助记码"></el-table-column>
      <el-table-column prop="contactPerson" header-align="center" align="center" label="联系人"></el-table-column>
      <el-table-column prop="contactNumber" header-align="center" align="center" label="联系电话"></el-table-column>
      <el-table-column prop="province.name" header-align="center" align="center" label="省"></el-table-column>
      <el-table-column prop="city.name" header-align="center" align="center" label="市"></el-table-column>
      <el-table-column prop="district.name" header-align="center" align="center" label="区"></el-table-column>
      <el-table-column prop="address" header-align="center" align="center" label="详细地址"></el-table-column>
    </el-table>

    <!-- 列表尾部-->
    <pagination :cp.sync="query.currentPage" :ps.sync="query.pageSize" :total.sync="query.total" @pagination="getList"></pagination>
  </el-dialog>
</template>

<script>

import { list } from '@api/erp/supplier'
import pagination from '@/components/pagination'

export default {
  name: 'system-erp-supplier-list',
  components: { pagination },
  data() {
    return {
      visible: false,
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
      objs: [],
      supplierIds: []
    }
  },
  methods: {
    init(ids) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        if(this.isNotBlank(ids)){
          this.supplierIds = ids
        }
        this.getList()
      })
    },
    search () {
      this.query.currentPage = 1
      this.getList()
    },
    getList () {
      this.loading = true
      list({...this.query}).then(r => {
        let res = r.data
        this.data = res.data
        this.query.total = res.recordsFiltered
        this.loading = false

        let self = this
        window.setTimeout(function (){
          let d = self.data.filter(e => self.supplierIds.indexOf(e.id) !== -1)
          self.selected(d)
        },500);
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    sortChange(column, prop, order) {
      this.query.orderKey = column.prop
      this.query.orderVal = column.order
      if (this.query.orderKey !== undefined && this.query.orderVal !== undefined) {
        this.getList()
      }
    },
    selected (rows) {
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
    },
    handleSelect(data) {
      let ops = []
      for (let index in data) {
        let d = data[index]
        let option = {
          value: d.id,
          name: d.name
        };
        ops.push(option);
      }
      this.objs = ops
    },
    confirmSelect(){
      this.$emit('listenResp', this.objs)
      this.visible = false
    }
  }
}
</script>

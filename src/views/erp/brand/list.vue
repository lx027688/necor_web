<template>
  <el-dialog title="品牌" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <!-- 查询 -->
    <el-form :inline="true" ref="form" style="margin-bottom: -18px;">
      <el-form-item label="" prop="keywords">
        <el-input v-model="keywords" placeholder="搜索项" style="width: 180px;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">
          <d2-icon name="search"/>
          查询
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 列表-->
    <el-table :data="showData.slice((page.currentPage-1)*page.pageSize,page.currentPage*page.pageSize)"
              v-loading="loading" stripe border highlight-current-row
              @current-change="handleSelect" style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
      <el-table-column prop="code" header-align="center" align="center" label="code"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
    </el-table>

    <!-- 列表尾部-->
    <el-pagination layout="sizes, prev, pager, next" :current-page="page.currentPage" :page-size="page.pageSize"
                   :page-sizes="page.pageSizes" :total="showData.length" @size-change="handleSizeChange"
                   @current-change="handleCurrentChange">
    </el-pagination>
  </el-dialog>
</template>

<script>

import {dictChilds} from "@api/system/dict";

export default {
  data() {
    return {
      visible: false,
      keywords: '',
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 50, 100]
      },
      data: [],
      showData: []
    }
  },
  methods: {
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        this.getList()
      })
    },
    getList() {
      this.loading = true
      dictChilds(301).then(res => {
        this.data = res.data
        this.showData = this.data
        this.loading = false
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    query() {
      this.showData = this.data.filter(item => {
        return item.name.match(this.keywords) || item.code.match(this.keywords)
      })

      this.page.currentPage = 1
    },
    // 翻页方法
    handleSizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
    },
    handleSelect(val) {
      let data = {
        code: val.code,
        name: val.name
      }
      this.$emit('listenDictResp', data)
      this.visible = false
    }
  }
}
</script>

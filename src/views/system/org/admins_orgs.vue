<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" :model="query" ref="form" @submit.native.prevent style="margin-bottom: -18px;">
      <el-form-item label="" prop="search">
        <el-input v-model="query.search" placeholder="用户名或姓名" clearable @keyup.enter.native="search" style="width: 180px;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()"><d2-icon name="search"/>&nbsp;查询</el-button>
      </el-form-item>
      <el-form-item style="float: right" v-if="org.id">
        <span style="font-size: 20px; color: #e1790d;">所选机构：{{ org.name }}</span>
      </el-form-item>
    </el-form>

    <!-- 列表-->
    <el-table :data="data" @sort-change="sortChange" v-loading="loading" stripe border style="width: 100%; margin-top:10px;margin-bottom: 20px;">
      <el-table-column header-align="center" align="center" label="管理员" width="80">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="请先选择组织机构" :disabled="isNotBlank(org.id)" placement="top">
            <el-checkbox :value="checkedPosition(scope.row.adminsOrgs,'107000')" @change="handleSelect('107000',scope.row.id)" :disabled="isBlank(org.id)"></el-checkbox>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="组员" width="80">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="请先选择组织机构" :disabled="isNotBlank(org.id)" placement="top">
            <el-checkbox :value="checkedPosition(scope.row.adminsOrgs,'107001')"  @change="handleSelect('107001',scope.row.id)" :disabled="isBlank(org.id)"></el-checkbox>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
      <el-table-column prop="username" header-align="center" align="center" label="用户名"></el-table-column>
    </el-table>

    <!-- 列表尾部-->
    <pagination :cp.sync="query.currentPage" :ps.sync="query.pageSize" :total.sync="query.total" @pagination="getList"></pagination>

  </div>
</template>

<script>
import { list, save } from '@api/system/admins_orgs'
import pagination from '@/components/pagination'

export default {
  name: 'admins-orgs-index',
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
      data: [],
      saveVisible: false,
      form: {
        id: '',
        name: '',
        parentId: ''
      },
      org: {
        id: '',
        name: ''
      }
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
        const res = r.data
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
    selectOrg (id, name) {
      this.org = {
        id: id,
        name: name
      }
    },
    checkedPosition (rels, position) {
      if (this.isBlank(this.org.id)) {
        return false
      }
      const self = this
      const flag = rels.some(function (value, index, array) {
        return value.orgId === self.org.id && value.position === position
      })
      return flag
    },
    handleSelect (position, adminId) {
      if (this.isBlank(position)) {
        this.$message({
          message: '职位为空',
          type: 'warning'
        })
        return
      }
      if (this.isBlank(adminId)) {
        this.$message({
          message: '机构成员为空',
          type: 'warning'
        })
        return
      }
      if (this.isBlank(this.org.id)) {
        this.$message({
          message: '机构为空',
          type: 'warning'
        })
        return
      }

      save({ adminId: adminId, orgId: this.org.id, position: position }).then(r => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getList()
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
}
</script>

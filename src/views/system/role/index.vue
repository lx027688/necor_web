<template>
  <d2-container>
    <el-row>
      <el-col :span="14">
        <!-- 查询 -->
        <el-form :inline="true" ref="form" style="margin-bottom: -18px;">
          <el-form-item label="" prop="keywords">
            <el-input v-model="keywords" placeholder="搜索项" style="width: 180px;"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()"><d2-icon name="search"/>&nbsp;查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refresh"><d2-icon name="refresh"/>&nbsp;重置</el-button>
          </el-form-item>
          <el-form-item style="float: right" v-permission="['role:save']">
            <el-button type="primary" @click="saveHandle()"><d2-icon name="plus"/>&nbsp;新增</el-button>
          </el-form-item>
        </el-form>

        <!-- 列表-->
        <el-table :data="showData.slice((page.currentPage-1)*page.pageSize,page.currentPage*page.pageSize)"
                  v-loading="loading" stripe border highlight-current-row style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
          <el-table-column prop="createDate" header-align="center" align="center" sortable="custom" label="创建时间"></el-table-column>
          <el-table-column prop="updateDate" header-align="center" align="center" sortable="custom" label="修改时间"></el-table-column>
          <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
          <el-table-column prop="mark" header-align="center" align="center" label="标识"></el-table-column>
          <el-table-column prop="isEnable" header-align="center" align="center" label="是否启用">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isEnable==='100000' ? 'success' : 'danger'" disable-transitions @click="updateRoleEnable(scope.row.id,scope.row.isEnable)">{{scope.row.isEnable==='100000'?'可用':'不可用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="getMenus(scope.row.id)">配置菜单</el-button>
              <el-button type="text" size="small" @click="saveHandle(scope.row.id)" v-permission="['role:save']">修改</el-button>
              <el-button type="text" size="small" @click="removeHandle(scope.row.id)" v-permission="['role:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 列表尾部-->
        <el-pagination layout="sizes, prev, pager, next" :current-page="page.currentPage" :page-size="page.pageSize"
                       :page-sizes="page.pageSizes" :total="showData.length" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>

        <!-- 弹窗, 新增 / 修改 -->
        <save v-if="saveVisible" ref="save" @refreshList="getList"></save>
      </el-col>
      <el-col :span="8">
        <el-tree ref="tree" class="filter-tree" node-key="id" default-expand-all highlight-current :data="menuList" :props="defaultProps" check-strictly
                 show-checkbox :default-checked-keys="selectMenuIds" @check="handleCheckChange" v-loading="menuLoading">
        </el-tree>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import { all, remove, updateEnable, getMenusByRole, saveRoleMenu } from '@api/system/role'
import permission from '@/directive/permission/index' // 权限判断指令
import save from './save'

export default {
  name: 'system-role',
  components: { save },
  directives: { permission },
  data () {
    return {
      loading: false,
      menuLoading: false,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 50, 100]
      },
      keywords: '',
      data: [],
      showData: [],
      saveVisible: false,
      defaultProps: {
        label: 'name'
      },
      menuList: [],
      selectMenuIds: [],
      currentRow: ''
    }
  },
  mounted () {
    this.getList()
    this.getMenus()
  },
  methods: {
    search () {
      this.showData = this.data.filter(item => {
        return this.contains(item.name, this.keywords) || this.contains(item.code, this.keywords)
      })
      this.page.currentPage = 1
    },
    refresh () {
      this.keywords = ''
      this.getList()
    },
    getList () {
      this.loading = true
      all().then(res => {
        this.data = res.data
        this.showData = this.data
        this.loading = false
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    // 翻页方法
    handleSizeChange (val) {
      this.page.currentPage = 1
      this.page.pageSize = val
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
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
    },
    updateRoleEnable (id, isEnable) {
      const params = new FormData()
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
    getMenus (id) {
      this.menuLoading = true
      const that = this
      this.selectMenuIds = []
      if (this.isBlank(id)) {
        this.menuLoading = false
        return
      }
      const params = new FormData()
      params.append('roleId', id)
      getMenusByRole(params).then(r => {
        const res = r.data
        this.menuList = res.menus
        if (this.isNotBlank(res.roleMenus)) {
          res.roleMenus.map(function (v) {
            that.selectMenuIds.push(v.id)
          })
        }
        this.currentRow = id
        this.menuLoading = false
      })
    },
    handleCheckChange (data, checked, indeterminate) {
      if (this.isBlank(this.currentRow)) {
        this.$message({
          message: '请选择角色',
          type: 'warning'
        })
      } else {
        const params = new FormData()
        const menuIds = []
        this.$refs.tree.getCheckedNodes(false, true).map(function (v) {
          menuIds.push(v.id)
        })
        params.append('id', this.currentRow)
        params.append('menuIds', menuIds)
        saveRoleMenu(params).then(res => {
        })
      }
    }
  }
}
</script>

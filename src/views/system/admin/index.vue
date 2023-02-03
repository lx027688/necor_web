<template>
  <d2-container>
    <!-- 查询 -->
    <el-form :inline="true" :model="query" ref="form" @submit.native.prevent style="margin-bottom: -18px;">
      <el-form-item label="" prop="username">
        <el-input v-model="query.username" placeholder="用户名" clearable @keyup.enter.native="search" style="width: 180px;"/>
      </el-form-item>
      <el-form-item label="" prop="name">
        <el-input v-model="query.name" placeholder="姓名" clearable @keyup.enter.native="search" style="width: 180px;"/>
      </el-form-item>
      <el-form-item label="" prop="mobile">
        <el-input v-model="query.mobile" placeholder="手机号" clearable @keyup.enter.native="search" style="width: 180px;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()"><d2-icon name="search"/>&nbsp;查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveHandle()"><d2-icon name="plus"/>&nbsp;新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="exportExcl()"><d2-icon name="share-square-o"/>&nbsp;导出</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <span style="color:#303133;font-size: 20px;margin-right: 20px;">共有用户:<span style="color: #67C23A;">{{ userStatistics.total }}</span></span>
<!--        <span style="color:#303133;font-size: 20px;">在线用户:<span style="color: #d43333;">{{ userStatistics.online }}</span></span>-->
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChangeHandle" v-loading="loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="username" header-align="center" align="center" label="用户名"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="姓名"></el-table-column>
      <el-table-column prop="nickName" header-align="center" align="center" label="昵称"></el-table-column>
      <el-table-column prop="birthday" header-align="center" align="center" label="生日"></el-table-column>
      <el-table-column prop="age" header-align="center" align="center" label="年龄" width="80"></el-table-column>
      <el-table-column prop="gender" header-align="center" align="center" label="性别" width="80">
        <template slot-scope="scope">
          <necor-dict-convert :code="scope.row.gender"></necor-dict-convert>
        </template>
      </el-table-column>
      <el-table-column prop="loginIp" header-align="center" align="center" label="登陆IP"></el-table-column>
      <el-table-column prop="loginDate" header-align="center" align="center" label="登陆时间" sortable="custom"></el-table-column>
      <el-table-column prop="isLocked" header-align="center" align="center" label="是否被锁" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isLocked==='100000' ? 'danger' : 'success'" disable-transitions>{{scope.row.isLocked==='100000'?'已锁定':'正常'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isEnable" header-align="center" align="center" label="是否可用" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnable==='100000' ? 'success' : 'danger'" disable-transitions @click="updateAdminEnable(scope.row.id,scope.row.isEnable)" style="cursor:pointer;">{{scope.row.isEnable==='100000'?'可用':'不可用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row.id)">查看</el-button>
          <el-button type="text" size="small" @click="resetAdminPassword(scope.row.id)">重置密码</el-button>
          <el-button type="text" size="small" @click="configRole(scope.row.id, scope.row.operations.roleIds)">配置角色</el-button>
          <el-button type="text" size="small" @click="saveHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="removeAdmin(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 列表尾部-->
    <pagination :cp.sync="query.currentPage" :ps.sync="query.pageSize" :total.sync="query.total" @pagination="getList"></pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <save v-if="saveVisible" ref="save" @refreshList="getList"></save>
    <!-- 弹窗, 详情 -->
    <detail v-if="detailVisible" ref="detail"></detail>

    <el-dialog title="角色配置" :visible.sync="configRoleVisible" width="45%" center>
      <el-transfer v-model="selectRoles" :data="roles" @change="updateRole" :titles="['所有角色', '已选角色']" v-loading="roleLoading"></el-transfer>
    </el-dialog>
  </d2-container>
</template>

<script>
import { list, remove, updateEnable, resetPassword, saveRoles, exportAdmin } from '@api/system/admin'
import { all } from '@api/system/role'
import pagination from '@/components/pagination'
import save from './save'
import detail from './detail'
export default {
  name: 'system-admin',
  components: { pagination, save, detail },
  data () {
    return {
      loading: false,
      roleLoading: false,
      query: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        username: '',
        name: '',
        mobile: '',
        orderKey: '',
        orderVal: ''
      },
      data: [],
      userStatistics: {
        total: 0,
        online: 0
      },
      saveVisible: false,
      detailVisible: false,
      currentAdmin: '',
      configRoleVisible: false,
      roles: [],
      selectRoles: []
    }
  },
  beforeCreate () {
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
        this.userStatistics.total = res.recordsTotal
        // this.userStatistics.online = res.params.onlineUser
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
    removeAdmin (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
    updateAdminEnable (id, isEnable) {
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
    resetAdminPassword (id) {
      this.loading = true
      const params = new FormData()
      params.append('id', id)
      resetPassword(params).then(res => {
        this.loading = false
        this.$message({
          message: '重置成功',
          type: 'success'
        })
      })
    },
    configRole (id, roles) {
      this.roleLoading = true
      this.roles = []
      this.selectRoles = roles
      this.currentAdmin = id
      const that = this
      this.configRoleVisible = true
      all().then(r => {
        const res = r.data
        res.map(function (v) {
          that.roles.push({
            key: v.id,
            label: v.name
          })
        })
        this.roleLoading = false
      }).catch(err => {
        this.roleLoading = false
        console.log('err', err)
      })
    },
    updateRole () {
      const params = new FormData()
      params.append('adminId', this.currentAdmin)
      params.append('roleIds[]', this.selectRoles)
      saveRoles(params).then(res => {
      })
    },
    exportExcl () {
      exportAdmin({ ...this.query }).then(res => {
        if (!res) {
          return
        }
        const url = window.URL.createObjectURL(new Blob([res]))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '管理员.xlsx')
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>

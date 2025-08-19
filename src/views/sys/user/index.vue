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
        <el-button type="primary" @click="refresh"><d2-icon name="refresh"/>&nbsp;重置</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <span style="color:#303133;font-size: 20px;margin-right: 20px;">共有用户:<span style="color: #67C23A;">{{ userStatistics.total }}</span></span>
        <!--        <span style="color:#303133;font-size: 20px;">在线用户:<span style="color: #d43333;">{{ userStatistics.online }}</span></span>-->
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" @click="exportExcl()"><d2-icon name="share-square-o"/>&nbsp;导出</el-button>
      </el-form-item>
      <el-form-item style="float: right" v-permission="['user:save']">
        <el-button type="primary" @click="saveHandle()"><d2-icon name="plus"/>&nbsp;新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChangeHandle" v-loading="loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="username" header-align="center" align="center" label="用户名"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="姓名"></el-table-column>
      <el-table-column prop="nickName" header-align="center" align="center" label="昵称"></el-table-column>
      <el-table-column prop="roles" header-align="center" align="center" label="角色" show-overflow-tooltip>
        <template v-slot="scope"> {{ isNotBlank(scope.row.roles)?scope.row.roles.map(e => { return e.name }).join('，'):'-' }}</template>
      </el-table-column>
      <el-table-column prop="depts" header-align="center" align="center" label="部门" show-overflow-tooltip>
        <template v-slot="scope"> {{ isNotBlank(scope.row.depts)?scope.row.depts.map(e => { return e.name }).join('，'):'-' }}</template>
      </el-table-column>
      <el-table-column prop="age" header-align="center" align="center" label="年龄" width="80"></el-table-column>
      <el-table-column prop="gender" header-align="center" align="center" label="性别" width="80">
        <template v-slot="scope">{{translateEnum('GENDER', scope.row.gender)}}</template>
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="用户状态" width="100">
        <template v-slot="scope">
          <el-tag :type="scope.row.status==='ACTIVE' ? 'success' : 'danger'" disable-transitions @click="updateUserStatus(scope.row.id,scope.row.status)" style="cursor:pointer;">{{translateEnum('USER_STATUS', scope.row.status)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="240" label="操作">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row.id)" v-permission="['user:detail']">查看</el-button>
          <el-button type="text" size="small" @click="resetUserPassword(scope.row.id)">重置密码</el-button>
          <el-button type="text" size="small" @click="configRole(scope.row.id, scope.row.roles.map(r=>r.id))">配置角色</el-button>
          <el-button type="text" size="small" @click="saveHandle(scope.row.id)" v-permission="['user:save']">修改</el-button>
          <el-button type="text" size="small" @click="removeUser(scope.row.id)" v-permission="['user:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 列表尾部-->
    <pagination :cp.sync="query.currentPage" :ps.sync="query.pageSize" :total.sync="query.total" @pagination="getPage"></pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <save v-if="saveVisible" ref="save" @refreshList="getPage"></save>
    <!-- 弹窗, 详情 -->
    <detail v-if="detailVisible" ref="detail"></detail>

    <el-dialog title="角色配置" :visible.sync="configRoleVisible" width="35%" center>
      <el-transfer v-model="selectRoles" :data="roles" @change="updateRole" :titles="['所有角色', '已选角色']" v-loading="roleLoading"></el-transfer>
    </el-dialog>
  </d2-container>
</template>

<script>
import { page, remove, updateStatus, resetPassword, assignRole, exportUser } from '@api/sys/user'
import { all } from '@api/sys/role'
import pagination from '@/components/pagination'
import permission from '@/directive/permission/index' // 权限判断指令
import save from './save'
import detail from './detail'

const originalData = {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  username: '',
  name: '',
  mobile: '',
  orderKey: '',
  orderVal: ''
}

export default {
  name: 'system-user',
  components: { pagination, save, detail },
  directives: { permission },
  data () {
    return {
      loading: false,
      roleLoading: false,
      query: this.cloneDeep(originalData),
      data: [],
      userStatistics: {
        total: 0,
        online: 0
      },
      saveVisible: false,
      detailVisible: false,
      currentUserId: '',
      configRoleVisible: false,
      roles: [],
      selectRoles: []
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
        this.getPage()
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
    removeUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(id).then(r => {
          this.getPage()
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
    updateUserStatus (id, status) {
      const params = new FormData()
      params.append('id', id)
      status = status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
      params.append('status', status)
      updateStatus(params).then(res => {
        this.getPage()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    resetUserPassword (id) {
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
    configRole (id, roleIds) {
      this.roleLoading = true
      this.roles = []
      this.selectRoles = roleIds
      this.currentUserId = id
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
      params.append('userId', this.currentUserId)
      params.append('roleIds', this.selectRoles)
      assignRole(params).then(res => {
        this.getPage()
      })
    },
    exportExcl () {
      exportUser({ ...this.query }).then(res => {
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
    },
    getDept (depts) {
      const self = this
      var map = {}
      depts.forEach(e => {
        if (map[e.name]) {
          map[e.name] = map[e.name] + '，' + self.getDict(e.position).name
        } else {
          map[e.name] = self.getDict(e.position).name
        }
      })
      return map
    }
  }
}
</script>

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
      <el-form-item style="float: right">
        <el-button type="primary" @click="flushDictCache()"><i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;刷新字典缓存</el-button>
      </el-form-item>
      <el-form-item style="float: right" v-permission="['dict:save']">
        <el-button type="primary" @click="saveHandle()"><d2-icon name="plus"/>&nbsp;新增</el-button>
      </el-form-item>
      <!--      <el-form-item>
              <el-button type="primary" @click="addStore">
                <d2-icon name="plus"/>添加
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getStore">
                <d2-icon name="plus"/>获取
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="removeStore">
                <d2-icon name="plus"/>删除
              </el-button>
            </el-form-item>-->
    </el-form>

    <!-- 列表-->
    <el-table :data="data" @sort-change="sortChange" v-loading="loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="code" header-align="left" align="left" label="值"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
      <el-table-column prop="createDate" header-align="center" align="center" sortable="custom" label="创建时间"></el-table-column>
      <el-table-column prop="updateDate" header-align="center" align="center" sortable="custom" label="修改时间"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="描述"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="saveHandle('addItem',scope.row.id)" v-permission="['dict:save']">添加字典项</el-button>
          <el-button type="text" size="small" @click="saveHandle('updateDict',scope.row.id)" v-permission="['dict:save']">修改</el-button>
          <el-button type="text" size="small" @click="removeHandle(scope.row.id)" v-permission="['dict:remove']">删除</el-button>
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
import { list, remove } from '@api/system/dict'
import pagination from '@/components/pagination'
import permission from '@/directive/permission/index' // 权限判断指令
import save from './save'

const originalData = {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  search: '',
  orderKey: '',
  orderVal: ''
}

export default {
  name: 'system-dict',
  components: { pagination, save },
  directives: { permission },
  data () {
    return {
      loading: false,
      query: this.cloneDeep(originalData),
      data: [],
      saveVisible: false
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
    refresh () {
      this.query = this.resetFormData('form', originalData)
      this.search()
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
    // 新增 / 修改
    saveHandle (type, id) {
      this.saveVisible = true
      this.$nextTick(() => {
        this.$refs.save.init(type, id)
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
    flushDictCache () {
      this.loadDict()
    }
    // addStore () {
    //   // this.$localStore.set('a', 'cccc')
    // },
    // getStore () {
    //   // console.log(this.$localStore.get('a'))
    //   // console.log(this.$localStore.aa('a'))
    //   // console.log(this.$localStore.get('dicts'))
    // },
    // removeStore () {
    //   // this.$localStore.remove('a')
    // }
  }
}
</script>

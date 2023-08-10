<template>
  <d2-container>
    <!-- 查询 -->
    <el-form :inline="true" ref="form" style="margin-bottom: -18px;">
      <el-form-item label="" prop="keywords">
        <el-input v-model="keywords" placeholder="搜索项" style="width: 180px;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search"><d2-icon name="search"/>查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refresh"><d2-icon name="refresh"/>&nbsp;重置</el-button>
      </el-form-item>
      <el-form-item style="float: right" v-permission="['area:save']">
        <el-button type="primary" @click="saveHandle()"><d2-icon name="plus"/>&nbsp;新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表-->
    <el-table :data="showData.slice((page.currentPage-1)*page.pageSize,page.currentPage*page.pageSize)" v-loading="loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;"
              row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" lazy :load="load">
      <el-table-column prop="name" header-align="left" align="left" label="区域名称"></el-table-column>
      <el-table-column prop="simpleName" header-align="center" align="center" label="区域简称"></el-table-column>
      <el-table-column prop="parentName" header-align="center" align="center" label="所属区域">
        <template slot-scope="scope"><span v-if="scope.row.parent">{{scope.row.parent.name}}</span></template>
      </el-table-column>
      <el-table-column prop="level" header-align="center" align="center" label="级别" sortable="custom">
        <template slot-scope="scope">
          <necor-dict-convert :code="scope.row.level"></necor-dict-convert>
        </template>
      </el-table-column>
      <el-table-column prop="code" header-align="center" align="center" label="区域代码"></el-table-column>
      <el-table-column prop="lon" header-align="center" align="center" label="区域经度"></el-table-column>
      <el-table-column prop="lat" header-align="center" align="center" label="区域纬度"></el-table-column>
      <el-table-column prop="zipCode" header-align="center" align="center" label="区域邮编"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="120" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="saveHandle(scope.row.id)" v-permission="['area:save']">修改</el-button>
          <el-button type="text" size="small" @click="removeHandle(scope.row.id)" v-permission="['area:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 列表尾部-->
    <el-pagination layout="sizes, prev, pager, next" :current-page="page.currentPage" :page-size="page.pageSize"
                   :page-sizes="page.pageSizes" :total="showData.length" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>

    <!-- 弹窗, 新增 / 修改 -->
    <save v-if="saveVisible" ref="save" @refreshList="getList"></save>
  </d2-container>
</template>

<script>
import { list, remove } from '@api/system/area'
import permission from '@/directive/permission/index' // 权限判断指令
import save from './save'

export default {
  name: 'system-area',
  components: { save },
  directives: { permission },
  data () {
    return {
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 50, 100]
      },
      keywords: '',
      data: [],
      showData: [],
      saveVisible: false
    }
  },
  beforeCreate () {
  },
  mounted () {
    this.getList()
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
      // 开始请求登录接口
      list().then(res => {
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
    load (tree, treeNode, resolve) {
      if (this.isNotBlank(tree) && this.isNotBlank(tree.id)) {
        var params = new URLSearchParams()
        params.append('parentId', tree.id)
        list(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          console.log('err', err)
        })
      }
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
    }
  }
}
</script>

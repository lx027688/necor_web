<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" :model="query" ref="form" style="margin-bottom: -18px;">
      <el-form-item>
        <el-button type="primary" @click="openSaveDialog()">
          <d2-icon name="plus"/>&nbsp;新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表-->
    <el-table :data="data" v-loading="loading" stripe border  highlight-current-row @current-change="addMembers"
              style="width: 100%;margin-top: 10px;margin-bottom: 20px;" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
      <el-table-column prop="createDate" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="240" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openSaveDialog('','',scope.row.id)">添加下级机构</el-button>
          <el-button type="text" size="small" @click="openSaveDialog(scope.row.id,scope.row.name)">修改</el-button>
          <el-button type="text" size="small" @click="removeHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 列表尾部-->
    <pagination :cp.sync="query.currentPage" :ps.sync="query.pageSize" :total.sync="query.total" @pagination="getList"></pagination>

    <el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="saveVisible" width="30%">
      <el-form :model="form" ref="saveForm" :rules="saveRule" @submit.native.prevent label-width="80px">
        <el-form-item label="机构名称" prop="name" :rules="[{required: true, message: '请填写机构名称'}]">
          <el-input v-model="form.name" @keyup.enter.native="saveData"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--点击取消清空面板内容-->
        <el-button @click="saveVisible = false">取 消</el-button>
        <!--点击确定添加内容-->
        <el-button type="primary" @click="saveData" >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { list, save, remove } from '@/api/system/org'
import pagination from '@/components/pagination'

export default {
  name: 'org-index',
  components: { pagination },
  data () {
    return {
      loading: false,
      query: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
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
      saveRule: {
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
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
    // 新增 / 修改
    openSaveDialog (id, name, parentId) {
      this.saveVisible = true
      this.form = {
        id: id || '',
        name: name || '',
        parentId: parentId || ''
      }
    },
    saveData () {
      this.$refs.saveForm.validate((valid) => {
        if (valid) {
          save(this.form).then(r => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.saveVisible = false
            this.getList()
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    },
    addMembers (row) {
      if (this.isNotBlank(row)) {
        this.$emit('addMembers', row.id, row.name)
      }
    }
  }
}
</script>

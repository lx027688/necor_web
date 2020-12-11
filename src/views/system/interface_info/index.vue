<template>
<d2-container>
	<!-- 查询 -->
	<el-form :inline="true" ref="form" style="margin-bottom: -18px;">
    <el-form-item label="" prop="keywords">
      <el-input v-model="keywords" placeholder="搜索项" style="width: 180px;"/>
    </el-form-item>
		<el-form-item>
      <el-button type="primary" @click="query">
        <d2-icon name="search"/> 查询
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="batchUpdateInfIsLog('100000')">
        <d2-icon name="check"/> 批量开启接口日志
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="batchUpdateInfIsLog('100001')">
        <d2-icon name="close"/> 批量关闭接口日志
      </el-button>
		</el-form-item>
	</el-form>

	<!-- 列表-->
	<el-table :data="showData.slice((page.currentPage-1)*page.pageSize,page.currentPage*page.pageSize)" @selection-change="selectionChangeHandle" v-loading="loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
		<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
    <el-table-column prop="isLog" header-align="center" align="center" label="是否需要记录日志" width="200">
      <template slot-scope="scope">
        <el-tag :type="scope.row.isLog==='100000' ? 'success' : 'danger'" @click="updateInfIsLog(scope.row.id,scope.row.isLog)" disable-transitions>{{scope.row.isLog==='100000'?'需要记录日志':'无需记录日志'}}</el-tag>
      </template>
    </el-table-column>
    <!--<el-table-column prop="id" header-align="center" align="center" sortable="custom" label="ID"></el-table-column>-->
    <el-table-column prop="className" header-align="center" align="center" label="接口类名" width="550"></el-table-column>
    <el-table-column prop="interfaceUrl" header-align="center" align="center" label="接口地址" width="350"></el-table-column>
    <el-table-column prop="methodName" header-align="center" align="center" label="接口方法名" width="360"></el-table-column>
		<el-table-column prop="auth" header-align="center" align="center" label="接口权限" width="200"></el-table-column>
	</el-table>

	<!-- 列表尾部-->
  <el-pagination layout="sizes, prev, pager, next" :current-page="page.currentPage" :page-size="page.pageSize"
                 :page-sizes="page.pageSizes" :total="showData.length" @size-change="handleSizeChange" @current-change="handleCurrentChange">
  </el-pagination>
</d2-container>
</template>

<script>
import { list, updateIsLog, batchUpdateIsLog } from '@api/system/interfaceInfo'

export default {
	name: 'system-interfaceInfo',
	data() {
		return {
      keywords: '',
			loading: false,
			page: {
				currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes:[10,20,50,100]
      },
			data: [],
			showData: [],
      ids: []
		}
	},
	mounted() {
		this.getList()
	},
	methods: {
		getList () {
			this.loading = true
			list().then(res => {
        this.data = res.data
        this.showData = this.data
        this.loading = false
			}).catch(err => {
				console.log('err', err)
				this.loading = false
			})
		},
    query () {
      this.showData = this.data.filter(item => {
        return item.className.match(this.keywords) || item.methodName.match(this.keywords) || item.interfaceUrl.match(this.keywords)
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
    selectionChangeHandle: function (val) {
      this.ids = val.map(o => {return o.id})
    },
    updateInfIsLog (id, isLog) {
      let params = new FormData()
      params.append('id', id)
      isLog = isLog === '100000' ? '100001' : '100000'
      params.append('isLog', isLog)
      updateIsLog(params).then(res => {
        this.getList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    batchUpdateInfIsLog (isLog) {
      let params = new FormData()
      params.append('ids[]', this.ids)
      params.append('isLog', isLog)
      // var params = new URLSearchParams();
      // params.append('ids[]',this.ids);
      // params.append('isLog',isLog);

      batchUpdateIsLog(params).then(res => {
        this.getList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    }
	}
}
</script>

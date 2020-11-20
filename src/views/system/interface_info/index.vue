<template>
<d2-container>
	<!-- 查询 -->
	<el-form :inline="true" :model="query" ref="form" style="margin-bottom: -18px;">
		<el-form-item label="" prop="search">
			<el-input v-model="query.search" placeholder="搜索项" style="width: 180px;"/>
		</el-form-item>
    <el-form-item label="" prop="search">
      <necor-dict-select v-model="query.isLog" code="100" placeholder="是否开启接口日志"></necor-dict-select>
    </el-form-item>
		<el-form-item>
      <el-button type="primary" @click="search">
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
	<el-table :data="data" @sort-change="sortChange" @selection-change="selectionChangeHandle" v-loading="loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
		<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
<!--		<el-table-column prop="id" header-align="center" align="center" sortable="custom" label="ID"></el-table-column>-->
<!--		<el-table-column prop="createDate" header-align="center" align="center" sortable="custom" label="创建时间"></el-table-column>-->
<!--		<el-table-column prop="updateDate" header-align="center" align="center" sortable="custom" label="修改时间"></el-table-column>-->
    <el-table-column prop="className" header-align="center" align="center" label="接口类名" width="550"></el-table-column>
		<el-table-column prop="methodName" header-align="center" align="center" label="接口方法名" width="360"></el-table-column>
		<el-table-column prop="interfaceUrl" header-align="center" align="center" label="接口地址" width="350"></el-table-column>
		<el-table-column prop="auth" header-align="center" align="center" label="接口权限" width="200"></el-table-column>
		<el-table-column prop="isLog" header-align="center" align="center" label="是否需要记录日志" width="200">
      <template slot-scope="scope">
        <el-tag :type="scope.row.isLog==='100000' ? 'success' : 'danger'" @click="updateInfIsLog(scope.row.id,scope.row.isLog)" disable-transitions>{{scope.row.isLog==='100000'?'需要记录日志':'无需记录日志'}}</el-tag>
      </template>
    </el-table-column>
	<!--	<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
			<template slot-scope="scope">
				<el-button type="text" size="small">查看</el-button>
			</template>
		</el-table-column>-->
	</el-table>

	<!-- 列表尾部-->
	<pagination :cp.sync="query.currentPage" :ps.sync="query.pageSize" :total.sync="query.total" @pagination="getList"></pagination>

</d2-container>
</template>

<script>
import { list, updateIsLog, batchUpdateIsLog } from '@api/system/interfaceInfo'
import pagination from '@/components/pagination'

export default {
	name: 'system-interfaceInfo',
	components: { pagination },
	data() {
		return {
			loading: false,
			query: {
				currentPage: 1,
				pageSize: 10,
				total: 0,
				search: '',
				isLog: '',
				orderKey: '',
				orderVal: ''
			},
			data: [],
      ids: []
		}
	},
	mounted() {
		this.getList()
	},
	methods: {
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
      console.log(this.ids)
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

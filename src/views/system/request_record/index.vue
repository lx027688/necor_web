<template>
<d2-container>
	<!-- 查询 -->
	<el-form :inline="true" :model="query" ref="form" style="margin-bottom: -18px;">
		<el-form-item label="" prop="search">
			<el-input v-model="query.search" placeholder="搜索项" style="width: 180px;"/>
		</el-form-item>
		<el-form-item>
		<el-button type="primary" @click="search">
			<d2-icon name="search"/>查询
		</el-button>
		</el-form-item>
	</el-form>

	<!-- 列表-->
	<el-table :data="data" @sort-change="sortChange" @selection-change="selectionChangeHandle" v-loading="loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
		<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
		<!--<el-table-column prop="id" header-align="center" align="center" sortable="custom" label="ID"></el-table-column>
		<el-table-column prop="createDate" header-align="center" align="center" sortable="custom" label="创建时间"></el-table-column>
		<el-table-column prop="updateDate" header-align="center" align="center" sortable="custom" label="修改时间"></el-table-column>-->
    <el-table-column prop="currentAdmin" header-align="center" align="center" label="当前登录用户（发起请求的用户）"></el-table-column>
		<el-table-column prop="requestUrl" header-align="center" align="center" label="请求URL地址" width="350"></el-table-column>
<!--		<el-table-column prop="requestParams" header-align="center" align="center" label="请求参数"></el-table-column>-->
		<el-table-column prop="requestTime" header-align="center" align="center" label="请求时间"></el-table-column>
		<el-table-column prop="requestIp" header-align="center" align="center" label="请求来源IP地址"></el-table-column>
		<el-table-column prop="requestMethod" header-align="center" align="center" label="请求方法"></el-table-column>
		<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
			<template slot-scope="scope">
        <el-button type="text" size="small" @click="detailHandle(scope.row.id,scope.row.requestParams)">查看</el-button>
			</template>
		</el-table-column>
	</el-table>

	<!-- 列表尾部-->
	<pagination :cp.sync="query.currentPage" :ps.sync="query.pageSize" :total.sync="query.total" @pagination="getList"></pagination>

  <!-- 弹窗, 详情 -->
  <detail v-if="detailVisible" ref="detail"></detail>

</d2-container>
</template>

<script>
import { list } from '@api/system/requestRecord'
import pagination from '@/components/pagination'
import detail from "@/views/system/request_record/detail";

export default {
	name: 'system-request-record',
	components: { pagination, detail },
	data() {
		return {
			loading: false,
			query: {
				currentPage: 1,
				pageSize: 50,
				total: 0,
				search: '',
				orderKey: '',
				orderVal: ''
			},
			data: [],
      detailVisible: false
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
    // 详情
    detailHandle (id, requestParams) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detail.init(id, requestParams)
      })
    },
		sortChange(column, prop, order) {
			this.query.orderKey = column.prop
			this.query.orderVal = column.order
			if (this.query.orderKey !== undefined && this.query.orderVal !== undefined) {
				this.getList()
			}
		},
		selectionChangeHandle(val) {
			console.log(val)
		}
	}
}
</script>

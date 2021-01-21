<template>
<el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible">
	<el-form :rules="saveRule" :model="form" ref="saveForm" label-width="80px">
    <el-form-item label="SPU码" prop="spu">
			<el-input v-model="form.spu"></el-input>
		</el-form-item>
		<el-form-item label="名称" prop="name">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="类目" prop="category">
      <necor-select-tree v-model="form.category" :options="categorys" style="width: 100%" accordion :props="props"></necor-select-tree>
		</el-form-item>
		<el-form-item label="品牌" prop="brand">
      <el-input v-model="form.brandName" @focus="openBrand" readonly></el-input>
		</el-form-item>
		<el-form-item label="供应商" prop="supplierNames">
			<el-input v-model="form.supplierNames" @focus="openSupplier" readonly></el-input>
		</el-form-item>
		<el-form-item label="描述" prop="descr">
			<el-input v-model="form.descr"></el-input>
		</el-form-item>
	</el-form>
	<div slot="footer" class="dialog-footer">
		<!--点击取消清空面板内容-->
		<el-button @click="visible = false">取 消</el-button>
		<!--点击确定添加内容-->
		<el-button type="primary" @click="saveData()" >确 定</el-button>
	</div>
  <brandlist v-if="brandVisible" ref="brandlist" @listenDictResp="handBrand"></brandlist>
  <supplierlist v-if="supplierVisible" ref="supplierlist" @listenResp="handSupplier"></supplierlist>
</el-dialog>
</template>

<script>

import { save, detail } from '@api/erp/product'
import {dictTree} from "@api/system/dict";
import brandlist from '../brand/list'
import supplierlist from '../supplier/list'

export default {
  components: { brandlist, supplierlist },
	data () {
		return {
			visible: false,
			form: {
				spu: '',
				name: '',
				category: '',
				brand: '',
				brandName: '',
        supplierIds: '',
				supplierNames: '',
				descr: ''
			},
			saveRule: {
				spu: [ { required: true, message: '请输入SPU码', trigger: 'blur' } ],
				name: [ { required: true, message: '请输入名称', trigger: 'blur' } ],
				category: [ { required: true, message: '请输入类目', trigger: 'blur' } ],
				brand: [ { required: true, message: '请输入品牌', trigger: 'blur' } ],
        supplierNames: [ { required: true, message: '请输入供应商', trigger: 'blur' } ],
				descr: [ { required: true, message: '请输入描述', trigger: 'blur' } ]
			},
      categorys: [],
      props: {
        value: 'code', // code字段名
        label: 'name', // 显示名称
        children: 'children' // 子级字段名
      },
      brandVisible: false,
      supplierVisible: false
		}
	},
	methods: {
		init (id) {
			this.form.id = id || ''
			this.visible = true

			this.$nextTick(() => {
				this.$refs['saveForm'].resetFields()

        this.getCategorys()

				if (this.form.id) {
					detail(id).then(r => {
						this.form = r.data
					})
				}
			})
		},
		saveData () {
			this.$refs['saveForm'].validate((valid) => {
				if (valid) {
					save(this.form).then(r => {
						this.$message({
							message: '保存成功',
							type: 'success'
						})
						this.$refs['saveForm'].resetFields()
						this.$emit('refreshList')
						this.visible = false
					}).catch(err => {
						console.log('err', err)
					})
				}
			})
		},
    getCategorys () {
      dictTree('300').then(res => {
        this.categorys = res.data.children
      }).catch(err => {
        console.log('err', err)
      })
    },
    openBrand () {
      this.brandVisible = true
      this.$nextTick(() => {
        this.$refs.brandlist.init()
      })
    },
    handBrand (d) {
      this.form.brand = d.code
      this.form.brandName = d.name
    },
    openSupplier () {
      this.supplierVisible = true
      this.$nextTick(() => {
        this.$refs.supplierlist.init()
      })
    },
    handSupplier (d) {
      this.form.supplierIds = d.map(function(v){return v.value})
      this.form.supplierNames = d.map(function(v){return v.name}).join(',')
    }
	}
}
</script>

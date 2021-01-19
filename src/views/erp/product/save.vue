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
      <necor-select-tree v-model="form.category" :options="categorys" style="width: 100%" accordion></necor-select-tree>
		</el-form-item>
		<el-form-item label="品牌" prop="brand">
      <necor-dict-select code="301" v-model="form.brand" placeholder="请选择品牌"></necor-dict-select>
		</el-form-item>
		<el-form-item label="供应商" prop="suppliers">
			<el-input v-model="form.suppliers"></el-input>
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
</el-dialog>
</template>

<script>

import { save, detail } from '@api/erp/product'
import {dictTree} from "@api/dict";

export default {
	data () {
		return {
      categorys: [],
			visible: false,
			form: {
				spu: '',
				name: '',
				category: '',
				brand: '',
				suppliers: '',
				descr: ''
			},
			saveRule: {
				spu: [ { required: true, message: '请输入SPU码', trigger: 'blur' } ],
				name: [ { required: true, message: '请输入名称', trigger: 'blur' } ],
				category: [ { required: true, message: '请输入类目', trigger: 'blur' } ],
				brand: [ { required: true, message: '请输入品牌', trigger: 'blur' } ],
				suppliers: [ { required: true, message: '请输入供应商', trigger: 'blur' } ],
				descr: [ { required: true, message: '请输入描述', trigger: 'blur' } ]
			}
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
        let data = JSON.parse(res.data)
        this.categorys = data.dicts.children
      }).catch(err => {
        console.log('err', err)
      })
    },
	}
}
</script>

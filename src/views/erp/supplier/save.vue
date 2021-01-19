<template>
<el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible">
	<el-form :rules="saveRule" :model="form" ref="saveForm" label-width="80px">
    <el-form-item label="名称" prop="name">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="联系人" prop="contactPerson">
			<el-input v-model="form.contactPerson"></el-input>
		</el-form-item>
		<el-form-item label="联系电话" prop="contactNumber">
			<el-input v-model="form.contactNumber"></el-input>
		</el-form-item>
		<el-form-item label="省/市/区" prop="provinceId">
      <el-row>
        <el-col :span="8">
          <el-select v-model="form.provinceId" placeholder="请选择省份" clearable filterable @change="getAreas('c')">
            <el-option v-for="item in provinces" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select v-model="form.cityId" placeholder="请选择城市" clearable filterable @change="getAreas('d')">
            <el-option v-for="item in citys" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select v-model="form.districtId" placeholder="请选择区" clearable filterable>
            <el-option v-for="item in districts" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-row>
		</el-form-item>
		<el-form-item label="详细地址" prop="address">
			<el-input v-model="form.address"></el-input>
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

import { save, detail } from '@api/erp/supplier'
import { getArea } from '@api/area'

export default {
	data () {
		return {
			visible: false,
			form: {
			  id: '',
				name: '',
				contactPerson: '',
				contactNumber: '',
				provinceId: '',
				cityId: '',
				districtId: '',
				address: '',
				mnCode: ''
			},
			saveRule: {
				name: [ { required: true, message: '请输入名称', trigger: 'blur' } ],
				contactPerson: [ { required: true, message: '请输入联系人', trigger: 'blur' } ],
				contactNumber: [ { required: true, message: '请输入联系电话', trigger: 'blur' } ],
				address: [ { required: true, message: '请输入详细地址', trigger: 'blur' } ]
			},
      provinces: [],
      citys: [],
      districts: [],
		}
	},
	methods: {
		init (id) {
			this.form.id = id || ''
			this.visible = true

			this.$nextTick(() => {
				this.$refs['saveForm'].resetFields()
        this.form.provinceId = ''
        this.form.cityId = ''
        this.form.districtId = ''
        this.provinces = []
        this.citys = []
        this.districts = []
        this.getAreas('p')
				if (this.form.id) {
					detail(id).then(r => {
						this.form.id = r.data.id
						this.form.name = r.data.name
						this.form.contactPerson = r.data.contactPerson
						this.form.contactNumber = r.data.contactNumber
						this.form.address = r.data.address
            this.form.provinceId = r.data.province.id
            this.getAreas('c')
            this.form.cityId = r.data.city.id
            this.getAreas('d')
            this.form.districtId = r.data.district.id
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
    async getAreas (areaType) {
      var params = new URLSearchParams()
      if(areaType === 'c'){
        this.citys = []
        this.form.cityId = ''
        this.districts = []
        this.form.districtId = ''
        if(this.isBank(this.form.provinceId)){
          return
        }
        params.append('parentId', this.form.provinceId)
      }
      if(areaType === 'd'){
        this.districts = []
        this.form.districtId = ''
        if(this.isBank(this.form.cityId)){
          return
        }
        params.append('parentId', this.form.cityId)
      }
      await getArea(params).then(res => {
        if(areaType === 'p'){
          this.provinces = res.data
        }
        if(areaType === 'c'){
          this.citys = res.data
        }
        if(areaType === 'd'){
          this.districts = res.data
        }
      }).catch(err => {
        console.log('err', err)
      })
    }
	}
}
</script>

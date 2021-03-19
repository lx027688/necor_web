<template>
<el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible" width="80%">
  <el-form :rules="saveRule" :model="form" ref="saveForm" label-width="80px">
    <el-tabs>
      <el-tab-pane label="产品基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="SPU码" prop="spu">
              <el-input v-model="form.spu" readonly>
                <el-button slot="append" @click="generateSpu" :disabled="!(!form.id)"><span style="color: #67C23A">生成SPU</span></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类目" prop="category">
              <necor-select-tree v-model="form.category" :options="categorys" style="width: 100%" accordion :props="props" @changeHandle="getPropertyByCategory()"></necor-select-tree>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="品牌" prop="brandName">
              <el-input v-model="form.brandName" @focus="openBrand" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" prop="supplierNames">
              <el-input v-model="form.supplierNames" @focus="openSupplier" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="描述" prop="descr">
              <quill-editor ref="myTextEditor" v-model="form.descr" :options="editorOption" style="height:300px;"></quill-editor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="产品属性">
        <el-form-item v-for="item in property.propertys" v-bind:key="item.property" :label="item.property">
          <el-checkbox v-for="it in item.propertyVals.split(',')" v-bind:key="it" :label="it" @change="handleProperty(item.property+'-'+it+'-'+item.isSale+'-'+item.isQuery)" :checked="isSelected(item.property,it)"></el-checkbox>
        </el-form-item>

        <el-form-item label="SKU">
          <el-table :data="form.skus" border style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="规格">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>销售规格: {{form.skus[scope.$index].saleSpec}}</p>
                  <p>查询规格: {{form.skus[scope.$index].querySpec}}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag>{{form.skus[scope.$index].spec}}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="销售价" width="200">
              <template slot-scope="scope">
                <el-input-number v-model="form.skus[scope.$index].price" controls-position="right" :min="0.01"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="成本价" width="200">
              <template slot-scope="scope">
                <el-input-number v-model="form.skus[scope.$index].cost" controls-position="right" :min="0.01"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="库存量" width="200">
              <template slot-scope="scope">
                <el-input-number v-model="form.skus[scope.$index].inventory" controls-position="right" :min="1"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
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

import {save, detail, validateRepeatSpu, list} from '@api/erp/product'
import { all } from '@api/erp/categoryProperty'
import {dictTree} from "@api/system/dict"
import {snowflake} from "@api/system/algorithm"
import brandlist from '../brand/list'
import supplierlist from '../supplier/list'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: { brandlist, supplierlist, quillEditor },
	data () {
		return {
			visible: false,
			form: {
				spu: '',
				name: '',
				category: '',
				brand: '',
				brandName: '',
        supplierIds: [],
				supplierNames: '',
				descr: '',
        skus:[]
			},
			saveRule: {
				spu: [
          { required: true, message: '请输入SPU码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              var params = new URLSearchParams()
              params.append('spu', value)
              params.append('id', this.form.id)
              validateRepeatSpu(params).then(res => {
                if (!res) {
                  return callback(new Error('产品SPU已存在'))
                }
                callback()
              })
            }
          }
        ],
				name: [ { required: true, message: '请输入名称', trigger: 'blur' } ],
				category: [ { required: true, message: '请选择类目', trigger: 'blur' } ],
        brandName: [ { required: true, message: '请选择品牌', trigger: 'blur' } ],
        supplierNames: [ { required: true, message: '请选择供应商', trigger: 'blur' } ],
				descr: [ { required: true, message: '请输入描述', trigger: 'blur' } ]
			},
      categorys: [],
      props: {
        value: 'code', // code字段名
        label: 'name', // 显示名称
        children: 'children' // 子级字段名
      },
      brandVisible: false,
      supplierVisible: false,
      property:{
        propertys: [],
        selectedPros: []
      },
      editorOption:{
        placeholder: '产品描述'
      }
		}
	},
	methods: {
		async init (id) {
			this.form.id = id || ''
			this.visible = true

      if (this.isBank(this.categorys)) {
        let res = await dictTree('300')
        this.categorys = res.data.children
      }

			this.$nextTick(() => {
				this.$refs['saveForm'].resetFields()
        this.form.brand = ''
        this.form.brandName = ''
        this.form.supplierIds = []
        this.form.supplierNames = ''
        this.form.skus = []

        this.property = {
          propertys: [],
          selectedPros: []
        }

				if (this.form.id) {
					detail(id).then(r => {
            this.form.spu = r.data.spu,
            this.form.name = r.data.name,
            this.form.category = r.data.category,
            this.form.brand = r.data.brand,
            this.form.brandName = this.convertDict('301',r.data.brand)
            this.form.supplierIds = r.data.suppliers.map(e=>{return e.id})
            this.form.supplierNames = r.data.suppliers.map(e=>{return e.name}).join(',')
            this.form.descr = r.data.descr

            all({'category':this.form.category}).then(res => {
              this.property.propertys = res.data

              for(let i=0;i<r.data.skus.length;i++){
                let s = r.data.skus[i]
                s.price = parseFloat(s.price.match(/^\d+(?:\.\d{0,2})?/))
                s.cost = parseFloat(s.cost.match(/^\d+(?:\.\d{0,2})?/))
                this.form.skus.push(s)

                let spec = JSON.parse(s.spec)
                for (var key in spec){

                  let isSale = '100001'
                  let isQuery = '100001'
                  for(let j=0;j<this.property.propertys.length;j++){
                    let p = this.property.propertys[j]
                    if(p.property === key){
                      isSale = p.isSale
                      isQuery = p.isQuery
                      break
                    }
                  }

                  let val = spec[key]
                  if(this.property.selectedPros.length === 0){
                    let selectedPro = {
                      key: key,
                      isSale: isSale,
                      isQuery: isQuery,
                      val: []
                    }
                    selectedPro.val.push(val)
                    this.property.selectedPros.push(selectedPro)
                  }else{
                    let flag = false
                    for (let j=0;j<this.property.selectedPros.length;j++) {
                      let sp = this.property.selectedPros[j]
                      if(sp.key === key){
                        if(!this.contains(sp.val,val)){
                          sp.val.push(val)
                        }
                        flag = true
                        break
                      }
                    }
                    if(!flag){
                      let selectedPro = {
                        key: key,
                        isSale: isSale,
                        isQuery: isQuery,
                        val: []
                      }
                      selectedPro.val.push(val)
                      this.property.selectedPros.push(selectedPro)
                    }
                  }
                }
              }
            }).catch(err => {
              console.log('err', err)
            })
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
    generateSpu () {
      snowflake().then(r => {
        this.form.spu = r.data
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
        this.$refs.supplierlist.init(this.form.supplierIds)
      })
    },
    handSupplier (d) {
      this.form.supplierIds = d.map(function(v){return v.value})
      this.form.supplierNames = d.map(function(v){return v.name}).join(',')
    },
    getPropertyByCategory () {
      all({'category':this.form.category}).then(r => {
        this.property.propertys = r.data
        this.property.selectedPros = []
      }).catch(err => {
        console.log('err', err)
      })
    },
    handleProperty (p) {
      let selectedPro= {
        key: '',
        val: [],
        isSale: '100001',
        isQuery: '100001'
      }
      if(this.isBank(this.property.selectedPros)){
        selectedPro.key = p.split('-')[0]
        selectedPro.val.push(p.split('-')[1])
        selectedPro.isSale = p.split('-')[2]
        selectedPro.isQuery = p.split('-')[3]
        this.property.selectedPros.push(selectedPro)
      }else{
        let ps = null
        let key = p.split('-')[0]
        let val = p.split('-')[1]
        let isSale = p.split('-')[2]
        let isQuery = p.split('-')[3]
        for (let i = 0;i<this.property.selectedPros.length;i++) {
          let pro = this.property.selectedPros[i]
          if(pro.key === key){
            ps = pro
            break
          }
        }

        if(this.isNotBank(ps)){
          let c = -1
          for(let i=0;i<ps.val.length;i++){
            let v = ps.val[i]
            if(v===val){
              c = i
              break
            }
          }
          if(c !== -1){
            // 存在就先删除掉
            ps.val.splice(c,1)
          }else {
            ps.val.push(val)
          }
        }else {
          selectedPro.key = key
          selectedPro.isSale = isSale
          selectedPro.isQuery = isQuery
          selectedPro.val.push(val)
          this.property.selectedPros.push(selectedPro)
        }
      }

      let skus = []
      for(let i=0;i<this.property.selectedPros.length;i++){
        let po = this.property.selectedPros[i]
        if(this.isNotBank(po.val)){
          if(i===0){
            for(let j=0;j<po.val.length;j++){
              let pro = {}
              let v = po.val[j]
              pro[po.key] = v
              skus.push(pro)
            }
          }else{
            const datas = JSON.parse(JSON.stringify(skus))
            skus = []
            for(let j=0;j<po.val.length;j++){
              let ky = po.key
              let v = po.val[j]
              for (let k=0;k<JSON.parse(JSON.stringify(datas)).length;k++) {
                let pro = JSON.parse(JSON.stringify(datas))[k]
                pro[ky] = v
                skus.push(pro)
              }
            }
          }
        }
      }

      let delIsSales = []
      let delIsQuerys = []
      for(let i=0;i<this.property.selectedPros.length;i++){
        let pro = this.property.selectedPros[i]
        if(pro.isSale === '100001'){
          delIsSales.push(pro.key)
        }
        if(pro.isQuery === '100001'){
          delIsQuerys.push(pro.key)
        }
      }

      var oldSkus = this.form.skus
      this.form.skus = []
      for(let i=0;i<skus.length;i++){
        let ds = skus[i]
        let existSku = null
        for(let j=0;j<oldSkus.length;j++){
          let oldSku = oldSkus[j]
          if(oldSku.spec === JSON.stringify(ds)){
            existSku = oldSku
            break
          }
        }
        if(this.isNotBank(existSku)){
          this.form.skus.push(existSku)
        }else{
          let saleSpec = JSON.parse(JSON.stringify(ds))
          let querySpec = JSON.parse(JSON.stringify(ds))

          for(let j=0;j<delIsSales.length;j++){
            let s = delIsSales[j]
            delete saleSpec[s]
          }
          for(let j=0;j<delIsQuerys.length;j++){
            let q = delIsQuerys[j]
            delete querySpec[q]
          }

          let sku = {
            spec: JSON.stringify(ds),
            saleSpec: JSON.stringify(saleSpec),
            querySpec: JSON.stringify(querySpec),
            price: 0,
            cost: 0,
            inventory: 0
          }
          this.form.skus.push(sku)
        }
      }

      // console.log(this.form.skus)
    },
    isSelected (key,value) {
      for(let i=0;i<this.property.selectedPros.length;i++){
        let pro = this.property.selectedPros[i]
        if(pro.key === key){
          let vs = pro.val
          return this.contains(vs,value)
        }
      }
      return false
    },
    handleUpload (raw) {
      console.log(raw)
    }
	}
}
</script>

<style type="text/css">
  .ql-container{
    height: 85%;
  }
</style>

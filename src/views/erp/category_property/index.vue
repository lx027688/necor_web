<template>
  <d2-container>
    <el-row :gutter="20">
      <el-col :span="12">
        <!-- 查询 -->
        <el-form :inline="true" :model="dict1.query" ref="form" style="margin-bottom: -18px;">
          <el-form-item label="" prop="search">
            <el-input v-model="dict1.query.search" placeholder="搜索项" style="width: 180px;"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search1()">
              <d2-icon name="search"/>查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveHandle()">
              <d2-icon name="plus"/>新增</el-button>
          </el-form-item>
        </el-form>

        <!-- 列表-->
        <el-table :data="dict1.data" @sort-change="sortChange1" v-loading="dict1.loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;" row-key="code" key="1"
                  ref="dict1" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="code" header-align="left" align="left" label="值" width="200" sortable="custom"></el-table-column>
          <el-table-column prop="name" header-align="center" align="center" label="名称"  width="150"></el-table-column>
          <el-table-column prop="remark" header-align="center" align="center" label="描述"></el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="configAttr(scope.row)">配置属性</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 列表尾部-->
        <pagination :cp.sync="dict1.query.currentPage" :ps.sync="dict1.query.pageSize" :total.sync="dict1.query.total" @pagination="getDictList1"></pagination>
      </el-col>

      <el-col :span="12">
        <!-- 查询 -->
        <el-form :inline="true" :model="dict2.query" ref="form" style="margin-bottom: -18px;">
          <el-form-item label="" prop="search">
            <el-input v-model="dict2.query.search" placeholder="搜索项" style="width: 180px;"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search2()">
              <d2-icon name="search"/>查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveHandle()">
            <d2-icon name="plus"/>新增</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-breadcrumb separator=">" style="margin-top: 10px;">
              <el-breadcrumb-item style="font-size: 20px;" v-for="showTitle in showTitles" v-bind:key="showTitle">{{showTitle}}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-form-item>
        </el-form>

        <!-- 列表-->
        <el-table :data="dict2.data" @sort-change="sortChange2" v-loading="dict2.loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;"
                  row-key="code" key="2" ref="dict2" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column label="选择" header-align="center" align="center" width="80">
            <template slot-scope="scope">
              <el-checkbox @change="selectionHandle(scope.row.parent.code,scope.row.code)" :value="isChecked(scope.row.code)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="code" header-align="left" align="left" label="值" width="200" sortable="custom"></el-table-column>
          <el-table-column prop="name" header-align="center" align="center" label="名称"  width="150"></el-table-column>
          <el-table-column prop="remark" header-align="center" align="center" label="描述"></el-table-column>
        </el-table>
        <!-- 列表尾部-->
        <pagination :cp.sync="dict2.query.currentPage" :ps.sync="dict2.query.pageSize" :total.sync="dict2.query.total" @pagination="getDictList2"></pagination>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import { dictChildsPage } from '@api/system/dict'
import { save, detail } from "@api/erp/categoryProperty"
import pagination from '@/components/pagination'

export default {
  name: 'erp-category-property',
  components: { pagination },
  data () {
    return {
      dict1: {
        loading: false,
        query: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          search: '',
          code: '300',
          orderKey: '',
          orderVal: ''
        },
        data: []
      },
      dict2: {
        loading: false,
        query: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          search: '',
          code: '302',
          orderKey: '',
          orderVal: ''
        },
        data: []
      },
      showTitles: [],
      categoryProperty: {
        category: '',
        rels: []
      },
      selectRels: []
    }
  },
  mounted () {
    this.getDictList1()
    this.getDictList2()
  },
  methods: {
    search1 () {
      this.dict1.query.currentPage = 1
      this.getDictList1()
    },
    getDictList1 () {
      this.dict1.loading = true
      dictChildsPage({ ...this.dict1.query }).then(r => {
        let res = r.data
        this.dict1.data = res.data
        this.dict1.query.total = res.recordsFiltered
        this.dict1.loading = false
      }).catch(err => {
        console.log('err', err)
        this.dict1.loading = false
      })
    },
    sortChange1 (column, prop, order) {
      this.dict1.query.orderKey = column.prop
      this.dict1.query.orderVal = column.order
      if (this.dict1.query.orderKey !== undefined && this.dict1.query.orderVal !== undefined) {
        this.getDictList1()
      }
    },
    search2 () {
      this.dict2.query.currentPage = 1
      this.getDictList2()
    },
    getDictList2 () {
      this.dict2.loading = true
      dictChildsPage({ ...this.dict2.query }).then(r => {
        let res = r.data
        this.dict2.data = res.data
        this.dict2.query.total = res.recordsFiltered
        this.dict2.loading = false
      }).catch(err => {
        console.log('err', err)
        this.dict2.loading = false
      })
    },
    sortChange2 (column, prop, order) {
      this.dict2.query.orderKey = column.prop
      this.dict2.query.orderVal = column.order
      if (this.dict2.query.orderKey !== undefined && this.dict2.query.orderVal !== undefined) {
        this.getDictList2()
      }
    },
    configAttr (data) {
      this.categoryProperty = {
        category: '',
        rels: []
      }
      this.showTitles = []

      this.showTitles.push(data.name)
      this.getShowTitles(data.parent);
      this.showTitles.reverse()

      this.categoryProperty.category = data.code
      this.categoryProperty.rels = []
      this.selectRels = []

      if (this.categoryProperty.category) {
        detail(this.categoryProperty.category).then(r => {
          let d = r.data
          for(let i=0;i<d.length;i++){
            let r = {
              property: d[i].property,
              propertyVals: d[i].propertyVals
            }
            let r1 = {
              property: d[i].property,
              propertyVals: d[i].propertyVals.split(',')
            }
            this.categoryProperty.rels.push(r)
            this.selectRels.push(r1)
          }
        })
      }
    },
    getShowTitles (data) {
      if(this.isNotBank(data) && data.code !== '300'){
        this.showTitles.push(data.name)
        this.getShowTitles(data.parent);
      }
    },
    selectionHandle (parentCode,code) {
      if (this.isBank(this.categoryProperty.category)) {
        this.$message({
          message: '产品分类不能为空',
          type: 'warning'
        })
        return
      }
      // 定义property关系对象
      let rel = {
        property: '',
        propertyVals: []
      }
      // 如果选中的关系集合为空 （第一次选择）
      if(this.isBank(this.selectRels)){
        if(parentCode === '302'){ // 选择得为属性
          rel.property = code
          // 获取属性下的所有的所有值，并选中
          for (let j=0;j<this.dict2.data.length;j++) {
            let d = this.dict2.data[j]
            if(d.code ===code && this.isNotBank(d.children)){
              rel.propertyVals = d.children.map(e=>{return e.code})
            }
          }
        }else { // 选择的为值
          rel.property = parentCode
          rel.propertyVals.push(code)
        }
        // 添加关系对象值关系集合
        this.selectRels.push(rel)
      }else { // 如果选中的关系集合不为空 （第N次选择）
        if(parentCode === '302'){ // 选择得为属性
          let flag = false
          for(let j=0;j<this.selectRels.length;j++){
            if(this.selectRels[j].property === code){
              // 存在就先删除掉
              this.selectRels.splice(j,1)
              flag = true
              break
            }
          }
          if(!flag){
            rel.property = code
            // 获取属性下的所有的所有值，并选中
            for (let j=0;j<this.dict2.data.length;j++) {
              let d = this.dict2.data[j]
              if(d.code ===code && this.isNotBank(d.children)){
                rel.propertyVals = d.children.map(e=>{return e.code})
              }
            }

            // 添加关系对象值关系集合
            this.selectRels.push(rel)
          }
        }else { // 选择的为值
          let r = null
          for(let j=0;j<this.selectRels.length;j++){
            if(this.selectRels[j].property === parentCode){
              r = this.selectRels[j]
              break
            }
          }
          if(this.isNotBank(r)){
            let flag = false
            for (let j=0;j<r.propertyVals.length;j++) {
              if(r.propertyVals[j] === code){
                // 存在就先删除掉
                r.propertyVals.splice(j,1)
                flag = true
                break
              }
            }
            if(flag){
             if(r.propertyVals.length===0){
               for(let j=0;j<this.selectRels.length;j++){
                 if(this.selectRels[j].property ===  r.property){
                   // 存在就先删除掉
                   this.selectRels.splice(j,1)
                   break
                 }
               }
             }
            }else{
              r.propertyVals.push(code)
            }
          }else{
            rel.property = parentCode
            rel.propertyVals.push(code)
            // 添加关系对象值关系集合
            this.selectRels.push(rel)
          }
        }
      }

      let rs = []
      for(let i=0;i<this.selectRels.length;i++){
        let r = {
          property: '',
          propertyVals: ''
        }
        let rl = this.selectRels[i]
        r.property = rl.property
        r.propertyVals = rl.propertyVals.join(',')
        rs.push(r)
      }
      this.categoryProperty.rels = rs

      save(this.categoryProperty).then(r => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      }).catch(err => {
        console.log('err', err)
      })
    },
    isChecked (code) {
      for (let i=0;i<this.selectRels.length;i++) {
        let rel = this.selectRels[i]
        if(rel.property === code){
          return true
        }
        for (let j=0;j<rel.propertyVals.length;j++) {
          let val = rel.propertyVals[j]
          if(val === code){
            return true
          }
        }
      }
      return false
    }
  }
}
</script>

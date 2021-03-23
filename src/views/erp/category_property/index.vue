<template>
  <d2-container>
    <el-row :gutter="20">
      <el-col :span="12">
        <!-- 查询 -->
        <el-form :inline="true" :model="dict.query" ref="form" style="margin-bottom: -18px;">
          <el-form-item label="" prop="search">
            <el-input v-model="dict.query.search" placeholder="搜索项" style="width: 180px;"/>
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
        <el-table :data="dict.data" @sort-change="sortChange1" v-loading="dict.loading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;" row-key="code" key="1"
                  ref="dict" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :default-sort = "{prop: dict.query.orderKey, order: dict.query.orderVal}">
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
        <pagination :cp.sync="dict.query.currentPage" :ps.sync="dict.query.pageSize" :total.sync="dict.query.total" @pagination="getDictList1"></pagination>
      </el-col>

      <el-col :span="12">
        <el-breadcrumb separator=">" style="margin-top: 10px;margin-bottom: 25px;">
          <el-breadcrumb-item style="font-size: 20px;" v-for="showTitle in showTitles" v-bind:key="showTitle">{{showTitle}}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-form ref="form" >
          <el-form-item prop="fields">
            <el-table :data="categoryProperty.propertys" border style="width: 100%">
              <el-table-column prop="property" label="属性名称" width="120">
                <template slot-scope="scope">
                  <el-input v-model="categoryProperty.propertys[scope.$index].property" placeholder="属性名称"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="inputValue" label="属性值">
                <template slot-scope="scope">
                  <el-tag v-show="categoryProperty.propertys[scope.$index].propertyVals!=null && categoryProperty.propertys[scope.$index].propertyVals!=''"
                          v-for="tag in categoryProperty.propertys[scope.$index].propertyVals.split(',')" :key="tag" closable :disable-transitions="false"
                          @close="delTag(scope.$index,tag)">{{tag}}</el-tag>
                  <el-input class="input-new-tag" v-if="categoryProperty.propertys[scope.$index].tagVisible" v-model="categoryProperty.propertys[scope.$index].inputValue"
                            ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.$index)" @blur="handleInputConfirm(scope.$index)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.$index)">+ 属性</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="isQuery" label="查询属性" width="80" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="categoryProperty.propertys[scope.$index].isQuery" :checked="categoryProperty.propertys[scope.$index].isQuery=='100000'" true-label="100000" false-label="100001"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="isSale" label="销售属性" width="80" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="categoryProperty.propertys[scope.$index].isSale" :checked="categoryProperty.propertys[scope.$index].isSale=='100000'" true-label="100000" false-label="100001"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column fixed="right" header-align="center" align="center" label="操作" width="80">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="deleteNode(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addNode()">添加属性规格</el-button>
            <el-button type="primary" @click="saveProperty()">保存属性</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import { dictChildsPage } from '@api/system/dict'
import { save,detail } from '@api/erp/categoryProperty'
import pagination from '@/components/pagination'

export default {
  name: 'erp-category-property',
  components: { pagination },
  data () {
    return {
      dict: {
        loading: false,
        query: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          search: '',
          code: '300',
          orderKey: 'code',
          orderVal: 'ascending'
        },
        data: []
      },
      showTitles: [],
      categoryProperty: {
        category: '',
        propertys: [ { property: '', propertyVals: '', isSale: '100001', isQuery: '100001', tagVisible: false, inputValue: '' } ]
      }
    }
  },
  mounted () {
    this.getDictList1()
  },
  methods: {
    search1 () {
      this.dict.query.currentPage = 1
      this.getDictList1()
    },
    getDictList1 () {
      this.dict.loading = true
      dictChildsPage({ ...this.dict.query }).then(r => {
        let res = r.data
        this.dict.data = res.data
        this.dict.query.total = res.recordsFiltered
        this.dict.loading = false
      }).catch(err => {
        console.log('err', err)
        this.dict.loading = false
      })
    },
    sortChange1 (column, prop, order) {
      this.dict.query.orderKey = column.prop
      this.dict.query.orderVal = column.order
      if (this.dict.query.orderKey !== undefined && this.dict.query.orderVal !== undefined) {
        this.getDictList1()
      }
    },
    configAttr (data) {
      this.showTitles = []

      this.showTitles.push(data.name)
      this.getShowTitles(data.parent);
      this.showTitles.reverse()

      this.categoryProperty.category = data.code

      if (this.categoryProperty.category) {
        detail(this.categoryProperty.category).then(r => {
          this.categoryProperty.propertys = []
          if(r.data.length==0){
            this.categoryProperty.propertys.push({ property: '', propertyVals: '',isSale: '100001', isQuery: '100001',tagVisible: false, inputValue: '' })
          }else{
            let data = r.data
            for (let i=0;i<data.length;i++) {
              let pro = {
                property: '',
                propertyVals: '',
                isSale: '100001',
                isQuery: '100001',
                tagVisible: false,
                inputValue: ''
              }
              pro.property = data[i].property
              pro.propertyVals = data[i].propertyVals
              pro.isSale = data[i].isSale
              pro.isQuery = data[i].isQuery
              this.categoryProperty.propertys.push(pro)
            }
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
    // 添加标本div
    addNode () {
      this.categoryProperty.propertys.push({ property: '', propertyVals: '',isSale: '100001', isQuery: '100001',tagVisible: false, inputValue: '' })
    },
    // 删除样本div
    deleteNode (i) {
      this.categoryProperty.propertys.splice(i, 1)
    },
    showInput(index) {
      this.categoryProperty.propertys[index].tagVisible = true;
      // this.$nextTick(_ => {
      //   this.$refs.saveTagInput.$refs.input.focus();
      // });
    },
    handleInputConfirm(index) {
      let inputValue = this.categoryProperty.propertys[index].inputValue
      if (inputValue) {
        if(this.isBank(this.categoryProperty.propertys[index].propertyVals)){
          this.categoryProperty.propertys[index].propertyVals = inputValue
        }else {
          this.categoryProperty.propertys[index].propertyVals += ','+inputValue
        }
      }
      this.categoryProperty.propertys[index].tagVisible = false;
      this.categoryProperty.propertys[index].inputValue = '';
    },
    delTag (index,tag) {
      let tags = this.categoryProperty.propertys[index].propertyVals
      let ts = tags.split(',')
      for(let i=0;i<ts.length;i++){
        let t = ts[i]
        if(t===tag){
          ts.splice(i,1);
        }
      }
      this.categoryProperty.propertys[index].propertyVals = ts.join(',')
    },
    saveProperty(){
      save(this.categoryProperty).then(r => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
}
</script>

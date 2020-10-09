<template>
  <el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="form" ref="detailForm" label-width="100px" label-suffix="：">
      <el-row>
        <el-col :span="8">
          <el-form-item label="标题" prop="title" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.title}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="网址" prop="url" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.url}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="国家" prop="country" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{convertDict('106',form.country)}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="导航位" prop="positionNames" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.positionNames}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标签" prop="tags" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.tag}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述" prop="description" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.description}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>

import { detail } from '@api/nav/baseInfo'

export default {
  data () {
    return {
      visible: false,
      form: {
        id: '',
        title: '',
        description: '',
        url: '',
        country: '',
        tag: '',
        positionNames: ''
      }
    }
  },
  methods: {
    init (id) {
      this.form.id = id || ''
      this.visible = true

      this.$nextTick(() => {
        this.$refs['detailForm'].resetFields()
        if (this.form.id) {
          detail(id).then(res => {
            let r = res.data
            this.form.title = r.title
            this.form.country = r.country
            this.form.url = r.url
            this.form.description = r.description
            this.form.tag = r.tag
            let that = this
            r.postions.forEach(function (item, index) {
              if (index === r.postions.length - 1) {
                that.form.positionNames += item.name
              } else {
                that.form.positionNames += item.name + ','
              }
            })
          })
        }
      })
    }
  }
}
</script>

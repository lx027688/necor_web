<template>
<el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible">
  <el-form :rules="saveRule" :model="form" ref="saveForm" label-width="80px">
    <el-form-item label="作者" prop="author">
      <el-input v-model="form.author"></el-input>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="关键字" prop="keywords">
      <el-input v-model="form.keywords"></el-input>
    </el-form-item>
    <el-form-item label="文章类型(码类200)" prop="type">
      <el-input v-model="form.type"></el-input>
    </el-form-item>
    <el-form-item label="简介" prop="introduction">
      <el-input v-model="form.introduction"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="cont">
      <el-input v-model="form.cont"></el-input>
    </el-form-item>
    <el-form-item label="封面" prop="cover">
      <el-input v-model="form.cover"></el-input>
    </el-form-item>
    <el-form-item label="是否发布(码类100)" prop="published">
      <el-input v-model="form.published"></el-input>
    </el-form-item>
    <el-form-item label="来源" prop="sourse">
      <el-input v-model="form.sourse"></el-input>
    </el-form-item>
    <el-form-item label="来源url" prop="sourseUrl">
      <el-input v-model="form.sourseUrl"></el-input>
    </el-form-item>
    <el-form-item label="发布日期" prop="publishedDate">
      <el-input v-model="form.publishedDate"></el-input>
    </el-form-item>
    <el-form-item label="点击量" prop="hits">
      <el-input v-model="form.hits"></el-input>
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

import { save, detail } from '@api/article'

export default {
  data () {
    return {
      visible: false,
      form: {
        author: '',
        title: '',
        keywords: '',
        type: '',
        introduction: '',
        cont: '',
        cover: '',
        published: '',
        sourse: '',
        sourseUrl: '',
        publishedDate: '',
        hits: ''
      },
      saveRule: {
        author: [ { required: true, message: '请输入作者', trigger: 'blur' } ],
        title: [ { required: true, message: '请输入标题', trigger: 'blur' } ],
        keywords: [ { required: true, message: '请输入关键字', trigger: 'blur' } ],
        type: [ { required: true, message: '请输入文章类型(码类200)', trigger: 'blur' } ],
        introduction: [ { required: true, message: '请输入简介', trigger: 'blur' } ],
        cont: [ { required: true, message: '请输入内容', trigger: 'blur' } ],
        cover: [ { required: true, message: '请输入封面', trigger: 'blur' } ],
        published: [ { required: true, message: '请输入是否发布(码类100)', trigger: 'blur' } ],
        sourse: [ { required: true, message: '请输入来源', trigger: 'blur' } ],
        sourseUrl: [ { required: true, message: '请输入来源url', trigger: 'blur' } ],
        publishedDate: [ { required: true, message: '请输入发布日期', trigger: 'blur' } ],
        hits: [ { required: true, message: '请输入点击量', trigger: 'blur' } ]
      }
    }
  },
  methods: {
    init (id) {
      this.form.id = id || ''
      this.visible = true

      this.$nextTick(() => {
        this.$refs['saveForm'].resetFields()
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
    }
  }
}
</script>

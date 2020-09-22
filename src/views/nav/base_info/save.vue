<template>
  <el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :rules="saveRule" :model="form" ref="saveForm" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="网址" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <necor-dict-select code="106" v-model="form.country" placeholder="请选择国家"></necor-dict-select>
      </el-form-item>
      <el-form-item label="导航位" prop="navPositionIds">
        <el-select v-model="form.navPositionIds" multiple placeholder="请选择导航位">
          <el-option v-for="p in positions" :key="p.id" :label="p.name" :value="p.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ICO" prop="icoFile">
        <el-upload ref="upload" action="/" :class="{disabled:fileListLength>0}" :on-preview="handlePreview" :on-remove="handleRemove" :on-change="handleChange" :http-request="handleUpload"
                   list-type="picture-card" :file-list="fileList" :auto-upload="false" multiple :limit="1">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-tag :key="tag" v-for="tag in tags" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="2"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!--点击取消清空面板内容-->
      <el-button @click="visible = false">取 消</el-button>
      <!--点击确定添加内容-->
      <el-button type="primary" @click="saveData()" >确 定</el-button>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-dialog>
</template>

<script>

import { save, detail } from '@api/nav/baseInfo'
import { all } from '@api/nav/position'

export default {
  data () {
    return {
      visible: false,
      form: {
        title: '',
        description: '',
        url: '',
        country: '',
        tags: [],
        navPositionIds: [],
        icoPortrait: ''
      },
      saveRule: {
        title: [ { required: true, message: '请输入标题', trigger: 'blur' } ],
        ico: [ { required: true, message: '请输入ico', trigger: 'blur' } ],
        logo: [ { required: true, message: '请输入logo', trigger: 'blur' } ],
        description: [ { required: true, message: '请输入描述', trigger: 'blur' } ],
        url: [ { required: true, message: '请输入网址', trigger: 'blur' } ],
        country: [ { required: true, message: '请输入国家（码类100）', trigger: 'blur' } ],
        isEnable: [ { required: true, message: '请输入是否启用（码类100）', trigger: 'blur' } ]
      },
      tags: [],
      inputVisible: false,
      inputValue: '',
      positions: [],
      isUploadHead: false,
      fileList: [],
      fileListLength: 0,
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    init (id) {
      this.form.id = id || ''
      this.visible = true
      this.fileListLength = 0
      this.isUploadHead = false

      this.$nextTick(() => {
        this.$refs['saveForm'].resetFields()
        this.form.navPositionIds = []
        this.tags = []
        this.fileList = []
        if (this.form.id) {
          detail(id).then(r => {
            this.form.title = r.title
            this.form.country = r.country
            this.form.url = r.url
            this.form.description = r.description
            if (this.isNotBank(r.tag)) {
              this.tags = r.tag.split(',')
            }
            let that = this
            that.form.navPositionIds = []
            r.postions.forEach(function (item, index) {
              that.form.navPositionIds.push(item.id)
            })

            if (r.ico !== null && r.ico !== '') {
              let file = {
                name: 'ico',
                url: this.$localStore.get('basic').baseUrl + '/' + r.ico
              }
              this.fileListLength = 1
              this.fileList.push(file)
            }
          })
        }
      })
      this.getPosition()
    },
    saveData () {
      this.$refs['saveForm'].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()

          if (this.isNotBank(this.tags)) {
            this.form.tag = this.tags.join(',')
          }

          let params = new FormData()
          for (let key of Object.keys(this.form)) {
            if (this.isNotBank(this.form[key])) {
              params.append(key, this.form[key])
            }
          }
          if (this.fileList.length > 0 && this.isUploadHead) {
            params.append('icoFile', this.fileList[0], this.fileList[0].name)
          }

          save(params).then(r => {
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
    handleClose (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getPosition () {
      all().then(res => {
        this.positions = res
      }).catch(err => {
        console.log('err', err)
      })
    },
    handleUpload (raw) {
      this.fileList.push(raw.file)
      this.fileListLength = this.fileList.length
    },
    handleRemove (file, fileList) {
      this.fileList = fileList
      this.fileListLength = this.fileList.length
    },
    handlePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange (file, fileList) {
      this.isUploadHead = true
      this.fileListLength = fileList.length
    }
  }
}
</script>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

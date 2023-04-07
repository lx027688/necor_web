<template>
  <el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :rules="saveRule" :model="form" ref="saveForm" label-width="80px" v-loading="loading" @keyup.enter.native="saveAdmin">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" :disabled="isNotBlank(form.id)"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="form.nickName"></el-input>
      </el-form-item>
      <el-form-item label="身份证" prop="idCard">
        <el-input v-model="form.idCard"></el-input>
      </el-form-item>
      <el-form-item label="email" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="headPortraitFile">
        <el-upload ref="upload" action="/" :auto-upload="false" :limit="1" :class="'headPortrait'"
                   list-type="picture-card" :file-list="fileList" :on-preview="handlePreview"
                   :on-change="(file, fileList) => handleChange(file, fileList, 'headPortrait')"
                   :on-remove="(file, fileList) => handleRemove(file, fileList, 'headPortrait')">
          <i class="el-icon-plus"></i>
        </el-upload>
        <!--        <el-upload ref="upload" action="" :auto-upload="false" :limit="1" :file-list="fileList" list-type="picture-card"
                           :on-change="(file, fileList) => picChange1(file, fileList, 'blockRef1', 'backPic1', 'backPics')"
                           :on-remove="(file, fileList) => picRemove1(file, fileList, 'backPic1', 'backPics')"
                           :on-preview="(file) => picView(file)" :class="'picUpload backPic1'">
                  <i class="el-icon-plus picIcon"></i>
                  <span class="picSpan"></span>
                </el-upload>-->
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!--点击取消清空面板内容-->
      <el-button @click="visible = false">取 消</el-button>
      <!--点击确定添加内容-->
      <el-button type="primary" @click="saveAdmin" >确 定</el-button>
    </div>

    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-dialog>
</template>

<script>

import { save, detail, validateRepeatUsername, validateRepeatIdCard, validateRepeatEmail, validateRepeatMobile } from '@api/system/admin'

const originalData = {
  id: '',
  username: '',
  password: '',
  name: '',
  nickName: '',
  idCard: '',
  email: '',
  mobile: '',
  headPortrait: '',
  headPortraitFile: null
}

export default {
  data () {
    return {
      visible: false,
      loading: false,
      form: this.cloneDeep(originalData),
      saveRule: {
        name: [
          { pattern: /[\u4e00-\u9fa5]/, message: '姓名必须是中文', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              var params = new URLSearchParams()
              params.append('username', value)
              params.append('id', this.form.id)
              validateRepeatUsername(params).then(res => {
                if (!res) {
                  return callback(new Error('用户名已存在'))
                }
                callback()
              })
            }
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3,4,5,7,8]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              var params = new URLSearchParams()
              params.append('mobile', value)
              params.append('id', this.form.id)
              validateRepeatMobile(params).then(res => {
                if (!res) {
                  return callback(new Error('手机号已存在'))
                }
                callback()
              })
            }
          }
        ],
        email: [
          { type: 'email', message: '请输入正确的email', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              var params = new URLSearchParams()
              params.append('email', value)
              params.append('id', this.form.id)
              validateRepeatEmail(params).then(res => {
                if (!res) {
                  return callback(new Error('邮箱已存在'))
                }
                callback()
              })
            }
          }
        ],
        idCard: [
          { pattern: /^([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}(x|X)))$/, message: '身份证格式不正确', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              var params = new URLSearchParams()
              params.append('idCard', value)
              params.append('id', this.form.id)
              validateRepeatIdCard(params).then(res => {
                if (!res) {
                  return callback(new Error('身份证号码已存在'))
                }
                callback()
              })
            }
          }
        ]
      },
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.loading = true

      this.$nextTick(() => {
        this.form = this.resetFormData('saveForm', originalData)
        this.fileList = []
        if (id) {
          detail(id).then(res => {
            const r = res.data
            this.form = r
            if (r.headPortrait !== null && r.headPortrait !== '') {
              document.querySelector('.headPortrait > div').style.display = 'none'
              const file = {
                name: r.headPortrait.split('.')[r.headPortrait.split('.').length - 1],
                url: r.headPortrait
              }
              this.fileList.push(file)
            }
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    },
    saveAdmin () {
      this.loading = true
      this.$refs.saveForm.validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
          // 封装入参
          const params = new FormData()
          for (const key of Object.keys(this.form)) {
            if (this.isNotBlank(this.form[key])) {
              params.append(key, this.form[key])
            }
          }

          // 报错数据
          save(params).then(r => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$emit('refreshList')
            this.loading = false
            this.visible = false
          }).catch(err => {
            this.loading = false
            console.log('err', err)
          })
        } else {
          this.loading = false
        }
      })
    },
    handlePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange (file, fileList, className) {
      document.querySelector('.' + className + ' > div').style.display = 'none'
      this.form.headPortraitFile = file.raw
    },
    handleRemove (file, fileList, className) {
      document.querySelector('.' + className + ' > div').style.display = 'block'
      this.form.headPortrait = ''
      this.form.headPortraitFile = null
      this.fileList = []
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>

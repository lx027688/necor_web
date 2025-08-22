<template>
  <el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :rules="saveRule" :model="form" ref="saveForm" label-width="80px" v-loading="loading" @keyup.enter.native="saveUser">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" :disabled="isNotBlank(form.id)"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="form.nickName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="headPortraitFile">
        <el-upload ref="upload" action="/" :auto-upload="false" :limit="1" :class="'headPortrait'"
                   list-type="picture-card" :file-list="fileList" :on-preview="previewAvatar"
                   :on-change="(file, fileList) => changeAvatar(file, fileList, 'headPortrait')"
                   :on-remove="(file, fileList) => removeAvatar(file, fileList, 'headPortrait')">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!--点击取消清空面板内容-->
      <el-button @click="visible = false">取 消</el-button>
      <!--点击确定添加内容-->
      <el-button type="primary" @click="saveUser" >确 定</el-button>
    </div>

    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-dialog>
</template>

<script>

import { save, detail, validateRepeat } from '@api/sys/user'

const originalData = {
  id: '',
  username: '',
  password: '',
  nickName: '',
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
        nickName: [
          { min: 0, max: 30, message: '长度不能超过30个字符', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              var params = new URLSearchParams()
              params.append('vType', 'username')
              params.append('vParam', value)
              params.append('id', this.form.id)
              validateRepeat(params).then(res => {
                if (res.data) {
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
              params.append('vType', 'mobile')
              params.append('vParam', value)
              params.append('id', this.form.id)
              validateRepeat(params).then(res => {
                if (res.data) {
                  return callback(new Error('手机号已存在'))
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
        this.initAvatar('headPortrait')
        if (id) {
          detail(id).then(res => {
            const r = res.data
            this.form = r
            if (this.isNotBlank(r.headPortrait)) {
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
    saveUser () {
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
    initAvatar (className) {
      document.querySelector('.' + className + ' > div').style.display = 'block'
    },
    previewAvatar (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    changeAvatar (file, fileList, className) {
      document.querySelector('.' + className + ' > div').style.display = 'none'
      this.form.headPortraitFile = file.raw
    },
    removeAvatar (file, fileList, className) {
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

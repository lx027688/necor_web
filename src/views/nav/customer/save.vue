<template>
<el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible">
  <el-form :rules="saveRule" :model="form" ref="saveForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <necor-dict-select code="101" v-model="form.gender" placeholder="请选择性别"></necor-dict-select>
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="form.phone"></el-input>
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

import { save, detail, validateRepeatUsername, validateRepeatPhone } from '@api/nav/customer'

export default {
  data () {
    return {
      visible: false,
      form: {
        username: '',
        password: '',
        name: '',
        gender: '',
        phone: ''
      },
      saveRule: {
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
        password: [ { required: true, message: '请输入密码', trigger: 'blur' } ],
        phone: [
          { pattern: /^1[3,4,5,7,8]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              var params = new URLSearchParams()
              params.append('mobile', value)
              params.append('id', this.form.id)
              validateRepeatPhone(params).then(res => {
                if (!res) {
                  return callback(new Error('手机号已存在'))
                }
                callback()
              })
            }
          }
        ]
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
            this.form = r
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

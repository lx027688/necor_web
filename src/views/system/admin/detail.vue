<template>
  <el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="form" ref="detailForm" label-width="100px" label-suffix="：">
      <el-row>
        <el-col :span="8">
          <el-form-item label="用户名" prop="username" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.username}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名" prop="name" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="昵称" prop="nickName" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.nickName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="身份证" prop="idCard" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.idCard}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="email" prop="email" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.email}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号" prop="mobile" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.mobile}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="头像" prop="headPortrait" style="font-size: 15px;font-weight: bold;">
           <el-image style="width: 100px; height: 100px" :src="form.headPortrait" :preview-src-list="srcList"></el-image>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>

import { detail } from '@api/system/admin'

export default {
  data () {
    return {
      visible: false,
      form: {
        id: '',
        username: '',
        password: '',
        name: '',
        nickName: '',
        idCard: '',
        email: '',
        mobile: '',
        headPortrait: ''
      },
      srcList: []
    }
  },
  methods: {
    init (id) {
      this.form.id = id || ''
      this.visible = true

      this.$nextTick(() => {
        this.$refs.detailForm.resetFields()
        if (this.form.id) {
          detail(id).then(r => {
            this.form = r.data
            if (r.data.headPortrait !== null && r.data.headPortrait !== '') {
              this.srcList.push(r.data.headPortrait)
            }
          })
        }
      })
    }
  }
}
</script>

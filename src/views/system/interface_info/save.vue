<template>
<el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible">
 <el-form :rules="saveRule" :model="form" ref="saveForm" label-width="80px">
  <el-form-item label="接口类名" prop="className">
   <el-input v-model="form.className"></el-input>
  </el-form-item>
  <el-form-item label="接口方法名" prop="methodName">
   <el-input v-model="form.methodName"></el-input>
  </el-form-item>
  <el-form-item label="接口地址" prop="interfaceUrl">
   <el-input v-model="form.interfaceUrl"></el-input>
  </el-form-item>
  <el-form-item label="接口权限" prop="auth">
   <el-input v-model="form.auth"></el-input>
  </el-form-item>
  <el-form-item label="是否需要记录日志" prop="isLog">
   <el-input v-model="form.isLog"></el-input>
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

import { save, detail } from '@api/system/interfaceInfo'

export default {
  data () {
    return {
      visible: false,
      form: {
        className: '',
        methodName: '',
        interfaceUrl: '',
        auth: '',
        isLog: ''
      },
      saveRule: {
        className: [{ required: true, message: '请输入接口类名', trigger: 'blur' }],
        methodName: [{ required: true, message: '请输入接口方法名', trigger: 'blur' }],
        interfaceUrl: [{ required: true, message: '请输入接口地址', trigger: 'blur' }],
        auth: [{ required: true, message: '请输入接口权限', trigger: 'blur' }],
        isLog: [{ required: true, message: '请输入是否需要记录日志', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init (id) {
      this.form.id = id || ''
      this.visible = true

      this.$nextTick(() => {
        this.$refs.saveForm.resetFields()
        if (this.form.id) {
          detail(id).then(r => {
            this.form = r
          })
        }
      })
    },
    saveData () {
      this.$refs.saveForm.validate((valid) => {
        if (valid) {
          save(this.form).then(r => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$refs.saveForm.resetFields()
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

<template>
<el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible">
  <el-form :rules="saveRule" :model="form" ref="saveForm" label-width="80px" v-loading="loading" @keyup.enter.native="saveData">
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="标识" prop="mark">
      <el-input v-model="form.mark"></el-input>
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

import { save, detail } from '@api/system/role'

const originalData = {
  name: '',
  mark: ''
}

export default {
  data () {
    return {
      visible: false,
      loading: false,
      form: this.cloneDeep(originalData),
      saveRule: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }, { min: 0, max: 40, message: '长度不能超过40个字符', trigger: 'blur' }],
        mark: [{ required: true, message: '请输入标识', trigger: 'blur' }, { min: 0, max: 40, message: '长度不能超过40个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.loading = true

      this.$nextTick(() => {
        this.form = this.resetFormData('saveForm', originalData)
        if (id) {
          detail(id).then(r => {
            this.form = r.data
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    },
    saveData () {
      this.loading = true
      this.$refs.saveForm.validate((valid) => {
        if (valid) {
          save(this.form).then(r => {
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
    }
  }
}
</script>

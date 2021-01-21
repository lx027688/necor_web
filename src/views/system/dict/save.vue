<template>
  <el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :rules="saveRule" :model="form" ref="saveForm" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="值" prop="code">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="form.remark"></el-input>
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

import { save, detail } from '@api/system/dict'

export default {
  data () {
    return {
      visible: false,
      form: {
        id: '',
        name: '',
        code: '',
        remark: '',
        parentId: ''
      },
      saveRule: {
        name: [ { required: true, message: '请输入名称', trigger: 'blur' } ],
        code: [ { required: true, message: '请输入值', trigger: 'blur' } ]
      }
    }
  },
  methods: {
    init (type, id) {
      if (type === 'addItem') { // 添加字典项
        this.form.parentId = id || ''
        this.form.id = ''
      } else {
        this.form.id = id || ''
        this.form.parentId = ''
      }
      this.visible = true

      this.$nextTick(() => {
        this.$refs['saveForm'].resetFields()
        if (this.form.id) {
          detail(id).then(r => {
            this.form = r.data
            this.form.parentId = r.data.parent.id
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

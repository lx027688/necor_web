<template>
<el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible">
  <el-form :rules="saveRule" :model="form" ref="saveForm" label-width="150px" v-loading="loading">
    <el-form-item label="所属地区" prop="parentId">
      <necor-select-tree-lazy v-model="form.parentId" @load="loadArea" :label="form.parentName"></necor-select-tree-lazy>
    </el-form-item>
    <el-form-item label="区域名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="区域代码" prop="code">
      <el-input v-model="form.code"></el-input>
    </el-form-item>
    <el-form-item label="区域邮编" prop="zipCode">
      <el-input v-model="form.zipCode"></el-input>
    </el-form-item>
    <el-form-item label="区域经度" prop="lon">
      <el-input v-model="form.lon"></el-input>
    </el-form-item>
    <el-form-item label="区域纬度" prop="lat">
      <el-input v-model="form.lat"></el-input>
    </el-form-item>
    <el-form-item label="区域简称" prop="simpleName">
      <el-input v-model="form.simpleName"></el-input>
    </el-form-item>
    <el-form-item label="区域完整名称" prop="wholeName">
      <el-input v-model="form.wholeName"></el-input>
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

import { save, detail, getArea } from '@api/system/area'

export default {
  data () {
    return {
      visible: false,
      loading: false,
      form: {
        name: '',
        code: '',
        zipCode: '',
        lon: '',
        lat: '',
        level: '',
        simpleName: '',
        wholeName: '',
        parentId: '',
        parentName: ''
      },
      saveRule: {
        name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入区域代码', trigger: 'blur' }],
        zipCode: [{ required: true, message: '请输入区域邮编', trigger: 'blur' }],
        lon: [{ required: true, message: '请输入区域经度', trigger: 'blur' }],
        lat: [{ required: true, message: '请输入区域纬度', trigger: 'blur' }],
        simpleName: [{ required: true, message: '请输入区域简称', trigger: 'blur' }],
        wholeName: [{ required: true, message: '请输入区域完整名称', trigger: 'blur' }]
      },
      areas: [],
      placeholder: '请选择地区'
    }
  },
  methods: {
    init (id) {
      this.form.id = id || ''
      this.visible = true

      this.$nextTick(() => {
        this.$refs.saveForm.resetFields()
        if (this.form.id) {
          detail(id).then(res => {
            const r = res.data
            this.form = r
            this.form.parentId = r.parent.id
            this.form.parentName = r.parent.name
          })
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
            this.$refs.saveForm.resetFields()
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
    loadArea (node, resolve) {
      if (node.level === 0) {
        getArea().then(r => {
          return resolve(r.data)
        }).catch(err => {
          console.log('err', err)
        })
      }
      if (node.level >= 1) {
        const params = new URLSearchParams()
        params.append('parentId', node.data.id)
        getArea(params).then(r => {
          return resolve(r.data)
        }).catch(err => {
          console.log('err', err)
        })
      }
    }
  }
}
</script>

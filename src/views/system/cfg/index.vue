<template>
  <d2-container>
    <el-row>
      <el-col :span="11" style="margin-top:15px;">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>基础配置</span>
            <el-button style="float: right;margin-top: -4px;" size="small" round type="primary" @click="saveGeneralInfo">保存基础配置</el-button>
          </div>
          <el-form label-position="right" label-width="120px" :model="generalForm" ref="generalForm" label-suffix=":" :rules="generalFormRule" :inline="true">
            <el-form-item label="Allow Origin" prop="allowOrigin">
              <el-input v-model="generalForm.allowOrigin" placeholder="Allow Origin"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top:15px;" :offset="1">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>存储配置</span>
            <el-button style="float: right;margin-top: -4px;" size="small" round type="primary" @click="saveStorageInfo">保存存储配置</el-button>
          </div>
          <el-form label-position="right" label-width="150px" :model="storageForm" ref="storageForm" :rules="storageFormRule">
            <el-form-item label="存储类型" prop="type">
              <necor-dict-radio code="104" v-model="storageForm.type" placeholder="存储类型"></necor-dict-radio>
            </el-form-item>
            <el-form-item label="endpoint" prop="endpoint" v-if="storageForm.type === '104001'">
              <el-input v-model="storageForm.endpoint" placeholder="endpoint" ></el-input>
            </el-form-item>
            <el-form-item label="accessKeyId" prop="accessKeyId" v-if="storageForm.type === '104001'">
              <el-input v-model="storageForm.accessKeyId" placeholder="accessKeyId"></el-input>
            </el-form-item>
            <el-form-item label="accessKeySecret" prop="accessKeySecret" v-if="storageForm.type === '104001'">
              <el-input v-model="storageForm.accessKeySecret" placeholder="accessKeySecret"></el-input>
            </el-form-item>
            <el-form-item label="bucket" prop="bucket" v-if="storageForm.type === '104001'">
              <el-input v-model="storageForm.bucket" placeholder="bucket"></el-input>
            </el-form-item>
            <el-form-item label="文件路径" prop="path" v-if="storageForm.type === '104000'">
              <el-input v-model="storageForm.path" placeholder="文件路径"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </d2-container>
</template>

<script>

import { getGeneral, saveGeneral, getStorage, saveStorage } from '@/api/system/cfg'

export default {
  name: 'system-setting',
  data () {
    return {
      generalForm: {
        allowOrigin: ''
      },
      storageForm: {
        type: '',
        endpoint: '',
        accessKeyId: '',
        accessKeySecret: '',
        bucket: '',
        path: ''
      },
      generalFormRule: {
        allowOrigin: [{ required: true, message: '请填写Allow Origin', trigger: 'blur' }]
      },
      storageFormRule: {
        type: [{ required: true, message: '存储类型不能为空', trigger: 'blur' }]
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created () {
    this.generalInfo()
    this.storageInfo()
  },
  methods: {
    generalInfo () {
      const that = this
      getGeneral().then(res => {
        const r = res.data
        this.$refs.generalForm.resetFields()
        that.generalForm = r
      }).catch(err => {
        console.log('err', err)
      })
    },
    saveGeneralInfo () {
      this.$refs.generalForm.validate((valid) => {
        if (valid) {
          saveGeneral(this.generalForm).then(r => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.generalInfo()
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    },
    storageInfo () {
      getStorage().then(r => {
        this.$refs.storageForm.resetFields()
        this.storageForm = r.data
      }).catch(err => {
        console.log('err', err)
      })
    },
    saveStorageInfo () {
      this.$refs.storageForm.validate((valid) => {
        if (valid) {
          saveStorage(this.storageForm).then(r => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    }
  }
}
</script>

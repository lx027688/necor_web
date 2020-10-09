<template>
  <d2-container>
    <el-row>
      <el-col :span="11" style="margin-top:15px;">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>基础配置</span>
            <el-button style="float: right;margin-top: -4px;" size="small" round type="primary" @click="saveBaseSetting">保存基础配置</el-button>
          </div>
          <el-form label-position="right" label-width="120px" :model="baseSettingForm" ref="baseSettingForm" label-suffix=":" :rules="baseSettingFormRule" :inline="true">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="baseSettingForm.companyName" placeholder="公司名称"></el-input>
            </el-form-item>
            <el-form-item label="系统名称" prop="systemName">
              <el-input v-model="baseSettingForm.systemName" placeholder="系统名称"></el-input>
            </el-form-item>
            <el-form-item label="系统网址" prop="website">
              <el-input v-model="baseSettingForm.website" placeholder="系统网址"></el-input>
            </el-form-item>
            <el-form-item label="网址前缀" prop="baseUrl">
              <el-input v-model="baseSettingForm.baseUrl" placeholder="网址前缀"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="baseSettingForm.contact" placeholder="联系人"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactMobile">
              <el-input v-model="baseSettingForm.contactMobile" placeholder="联系电话"></el-input>
            </el-form-item>
            <el-form-item label="QQ" prop="qq">
              <el-input v-model="baseSettingForm.qq" placeholder="QQ"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="address">
              <el-input v-model="baseSettingForm.address" placeholder="公司地址"></el-input>
            </el-form-item>
            <el-form-item label="备案号" prop="icp">
              <el-input v-model="baseSettingForm.icp" placeholder="备案号"></el-input>
            </el-form-item>
            <el-form-item label="系统版本" prop="version">
              <el-input v-model="baseSettingForm.version" placeholder="系统版本"></el-input>
            </el-form-item>
            <el-form-item label="系统LOGO" prop="logoFile">
              <el-upload ref="logoUpload" action="/" :class="{disabled:logoFileListLength>0}" :on-preview="logoHandlePreview" :on-remove="logoHandleRemove" :on-change="logoHandleChange" :http-request="logoHandleUpload"
                         list-type="picture-card" :file-list="LogoFileList" :auto-upload="false" multiple :limit="1">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="微信二维码" prop="wechatFile">
              <el-upload ref="wechatUpload" action="/" :class="{disabled:wechatFileListLength>0}" :on-preview="logoHandlePreview" :on-remove="wechatHandleRemove" :on-change="wechatHandleChange" :http-request="wechatHandleUpload"
                         list-type="picture-card" :file-list="wechatFileList" :auto-upload="false" multiple :limit="1">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top:15px;" :offset="1">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>存储配置</span>
            <el-button style="float: right;margin-top: -4px;" size="small" round type="primary" @click="saveStorageSetting">保存存储配置</el-button>
          </div>
          <el-form label-position="right" label-width="150px" :model="storageSettingForm" ref="storageSettingForm" :rules="storageSettingFormRule">
            <el-form-item label="存储类型" prop="type">
              <necor-dict-radio code="104" v-model="storageSettingForm.type" placeholder="存储类型"></necor-dict-radio>
            </el-form-item>
            <el-form-item label="endpoint" prop="endpoint" v-if="storageSettingForm.type === '104001'">
              <el-input v-model="storageSettingForm.endpoint" placeholder="endpoint" ></el-input>
            </el-form-item>
            <el-form-item label="accessKeyId" prop="accessKeyId" v-if="storageSettingForm.type === '104001'">
              <el-input v-model="storageSettingForm.accessKeyId" placeholder="accessKeyId"></el-input>
            </el-form-item>
            <el-form-item label="accessKeySecret" prop="accessKeySecret" v-if="storageSettingForm.type === '104001'">
              <el-input v-model="storageSettingForm.accessKeySecret" placeholder="accessKeySecret"></el-input>
            </el-form-item>
            <el-form-item label="bucketName" prop="bucketName" v-if="storageSettingForm.type === '104001'">
              <el-input v-model="storageSettingForm.bucketName" placeholder="bucketName"></el-input>
            </el-form-item>
            <el-form-item label="文件路径" prop="filePath" v-if="storageSettingForm.type === '104000'">
              <el-input v-model="storageSettingForm.filePath" placeholder="文件路径"></el-input>
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

import { baseSettingDetail, baseSettingSave, storageSettingDetail, storageSettingSave } from '@api/setting'

export default {
  name: 'system-setting',
  data () {
    return {
      baseSettingForm: {
        companyName: '',
        systemName: '',
        website: '',
        baseUrl: '',
        contact: '',
        contactMobile: '',
        qq: '',
        address: '',
        icp: '',
        version: ''
      },
      storageSettingForm: {
        type: '',
        endpoint: '',
        accessKeyId: '',
        accessKeySecret: '',
        bucketName: '',
        filePath: ''
      },
      baseSettingFormRule: {
        companyName: [ { required: true, message: '请输入公司名称', trigger: 'blur' } ]
      },
      storageSettingFormRule: {
        type: [ { required: true, message: '存储类型不能为空', trigger: 'blur' } ]
      },
      isUploadLogo: false,
      LogoFileList: [],
      logoFileListLength: 0,
      isUploadWechat: false,
      wechatFileList: [],
      wechatFileListLength: 0,
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created () {
    this.baseSettingInfo()
    this.storageSettingInfo()
  },
  methods: {
    baseSettingInfo () {
      let that = this
      baseSettingDetail().then(res => {
        let r = res.data
        that.logoFileListLength = 0
        that.LogoFileList = []
        this.$refs['baseSettingForm'].resetFields()
        that.baseSettingForm = r
        if (r.logo !== null && r.logo !== '') {
          let file = {
            id: '1',
            name: 'logo.' + r.logo.split('.')[r.logo.split('.').length - 1],
            url: r.logo
          }
          that.logoFileListLength = 1
          that.LogoFileList.push(file)
        }
        if (r.wechat !== null && r.wechat !== '') {
          that.wechatFileListLength = 0
          that.wechatFileList = []
          let file1 = {
            id: '1',
            name: 'wechat.' + r.wechat.split('.')[r.wechat.split('.').length - 1],
            url: r.wechat
          }
          that.wechatFileListLength = 1
          that.wechatFileList.push(file1)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    saveBaseSetting () {
      let that = this
      this.$refs['baseSettingForm'].validate((valid) => {
        if (valid) {
          this.$refs.logoUpload.submit()
          this.$refs.wechatUpload.submit()
          // 封装入参
          let params = new FormData()
          for (let key of Object.keys(that.baseSettingForm)) {
            if (this.isNotBank(that.baseSettingForm[key])) {
              params.append(key, that.baseSettingForm[key])
            }
          }
          if (that.LogoFileList.length > 0 && that.isUploadLogo) {
            params.append('logoFile', that.LogoFileList[0], that.LogoFileList[0].name)
          }
          if (that.wechatFileList.length > 0 && that.isUploadWechat) {
            params.append('wechatFile', that.wechatFileList[0], that.wechatFileList[0].name)
          }

          baseSettingSave(params).then(r => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.baseSettingInfo()
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    },
    storageSettingInfo () {
      storageSettingDetail().then(r => {
        this.$refs['storageSettingForm'].resetFields()
        this.storageSettingForm = r.data
      }).catch(err => {
        console.log('err', err)
      })
    },
    saveStorageSetting () {
      this.$refs['storageSettingForm'].validate((valid) => {
        if (valid) {
          storageSettingSave(this.storageSettingForm).then(r => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    },
    logoHandleUpload (raw) {
      this.LogoFileList.push(raw.file)
      this.logoFileListLength = this.LogoFileList.length
    },
    logoHandleRemove (file, fileList) {
      this.LogoFileList = fileList
      this.logoFileListLength = this.LogoFileList.length
    },
    logoHandlePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    logoHandleChange (file, fileList) {
      this.isUploadLogo = true
      this.logoFileListLength = fileList.length
    },
    wechatHandleUpload (raw) {
      this.wechatFileList.push(raw.file)
      this.wechatFileListLength = this.wechatFileList.length
    },
    wechatHandleRemove (file, fileList) {
      this.wechatFileList = fileList
      this.wechatFileListLength = this.wechatFileList.length
    },
    wechatHandlePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    wechatHandleChange (file, fileList) {
      this.isUploadWechat = true
      this.wechatFileListLength = fileList.length
    }
  }
}
</script>

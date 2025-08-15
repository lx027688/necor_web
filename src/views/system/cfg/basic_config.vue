<template>
  <el-card shadow="always">
    <div slot="header" class="clearfix">
      <span>基础配置</span>
      <el-button style="float: right;margin-top: -4px;" size="small" round type="primary" @click="saveBaseConfig">保存基础配置</el-button>
    </div>
    <el-form label-position="right" label-width="120px" :model="form" ref="form" label-suffix=":" v-loading="loading">
      <el-form-item :label="item.label" :prop="`configs.${index}.value`" :key="index" v-for="(item, index) in form.configs">
        <el-input v-model="item.value" :placeholder="item.label" style="width: 60%;">
          <template slot="append">
            <el-popover placement="top-start" title="温馨提示" width="300" trigger="hover">
              <li>企业邮箱，用于发送邮件或接收邮件</li>
              <el-button slot="reference" size="mini" icon="el-icon-info" style="float:right"></el-button>
            </el-popover>
          </template>
        </el-input>
      </el-form-item>
<!--      <el-form-item label="Allow Origin" prop="allowOrigin">
        <el-input v-model="form.allowOrigin" placeholder="Allow Origin">
          <template slot="append">
            <el-popover placement="top-start" title="温馨提示" width="300" trigger="hover">
              <li>允许所有跨域请填写all</li>
              <li>多个域名设置跨域用逗号[,]隔开</li>
              <el-button slot="reference" size="mini" icon="el-icon-info" style="float:right"></el-button>
            </el-popover>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="域名地址" prop="websit">
        <el-input v-model="form.websit" placeholder="websit">
          <template slot="append">
            <el-popover placement="top-start" title="温馨提示" width="300" trigger="hover">
              <li>前面需要加上http:// 或 https://</li>
              <el-button slot="reference" size="mini" icon="el-icon-info" style="float:right"></el-button>
            </el-popover>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="企业邮箱" prop="email">
        <el-input v-model="form.email" placeholder="email">
          <template slot="append">
            <el-popover placement="top-start" title="温馨提示" width="300" trigger="hover">
              <li>企业邮箱，用于发送邮件或接收邮件</li>
              <el-button slot="reference" size="mini" icon="el-icon-info" style="float:right"></el-button>
            </el-popover>
          </template>
        </el-input>
      </el-form-item>-->
    </el-form>
  </el-card>
</template>

<script>

import { getConfig, updateValue } from '@/api/system/config'

export default {
  name: 'basic-config',
  data () {
    return {
      loading: false,
      form: {
        id: null,
        configs: []
      }
    }
  },
  created () {
    this.getBasicConfig()
  },
  methods: {
    getBasicConfig () {
      this.loading = true
      const params = {
        configGroup: 'BASIC'
      }
      getConfig(params).then(res => {
        this.form.id = res.data.id
        this.form.configs = JSON.parse(res.data.value)
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log('err', err)
      })
    },
    saveBaseConfig () {
      this.loading = true
      const jsonString = JSON.stringify(this.form.configs)
      const id = this.form.id

      try {
        const params = new FormData()
        params.append('id', id)
        params.append('value', jsonString)
        updateValue(params).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.loading = false
        })
      } catch (err) {
        this.loading = false
        console.log('err', err)
      }
    }
  }
}
</script>

<template>
  <el-card shadow="always">
    <div slot="header" class="clearfix">
      <span>存储配置</span>
      <el-button style="float: right;margin-top: -4px;" size="small" round type="primary" @click="saveStorageConfig">保存存储配置</el-button>
    </div>
    <el-form label-position="right" label-width="130px" :model="form" ref="form" label-suffix=":" v-loading="loading">
      <el-form-item v-if="form.configs" :label="form.configs.key" :prop="`configs.key`" key="0" style="width: 80%;">
        <el-radio-group v-model="selectedType" @change="handleTypeChange">
          <el-radio :label="item.type" :key="index" v-for="(item, index) in form.configs.value">{{ item.type }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 显示当前选中的配置参数（可选） -->
      <el-form-item v-for="param in currentConfig.config_params" :key="param.key" :label="param.label" >
        <el-input v-model="param.value" style="width: 60%;"></el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

import { getConfig, updateValue } from '@/api/system/config'

export default {
  name: 'storage-config',
  data () {
    return {
      loading: false,
      form: {
        id: null,
        configs: null
      }
    }
  },
  created () {
    this.getStorageConfig()
  },
  computed: {
    selectedType: {
      get () {
        const activeItem = this.form.configs.value.find(item => item.active)
        return activeItem ? activeItem.type : ''
      },
      set (newType) {
        this.form.configs.value.forEach(item => {
          item.active = item.type === newType
        })
      }
    },
    // 当前选中的配置
    currentConfig () {
      if (this.isNotBlank(this.form) && this.isNotBlank(this.form.configs)) {
        return this.form.configs.value.find(item => item.active)
      } else {
        return []
      }
    }
  },
  methods: {
    // 切换存储类型时更新 active 状态
    handleTypeChange (newType) {
      this.form.configs.value.forEach(item => {
        item.active = item.type === newType
      })
    },
    getStorageConfig () {
      this.loading = true
      const params = {
        configGroup: 'STORAGE'
      }
      getConfig(params).then(res => {
        this.form.id = res.data.id
        console.log(res.data.value)
        this.form.configs = JSON.parse(res.data.value)
        console.log(this.form.configs)
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log('err', err)
      })
    },
    saveStorageConfig () {
      this.loading = true
      const jsonString = JSON.stringify(this.form.configs)
      const id = this.form.id

      try {
        console.log(this.form)
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

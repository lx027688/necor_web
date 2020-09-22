<template>
  <d2-container>
    <template slot="header">
      <el-alert type="success" :closable="false" title="公用存储指所有用户共用的存储区域，
          使用 await this.$store.dispatch('d2admin/db/database') 获得存储实例进行操作" />
    </template>
    <el-row>
      <el-col :span="12">
        <el-form>
          <el-row :gutter="20">
            <el-col :span="3">
              <el-form-item>
                <span>普通缓存放入</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="key" placeholder="键"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="value" placeholder="值"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button @click="addKeyValue">添加</el-button>
                <el-button @click="handleClear">删除</el-button>
                <el-button @click="handleClear">获取</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="12">
        <d2-highlight :code="dataDisplay" />
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
export default {
  data () {
    return {
      key: '',
      value: ''
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

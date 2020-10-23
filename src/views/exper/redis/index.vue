<template>
  <d2-container>
    <template slot="header">
      <el-alert type="success" :closable="false" title="公用存储指所有用户共用的存储区域，
          使用 await this.$store.dispatch('d2admin/db/database') 获得存储实例进行操作" />
    </template>
    <el-row>
      <el-col :span="24">
        <el-form :rules="saveRule" :model="redis" ref="redisForm" >
          <el-row :gutter="20">
            <el-col :span="2">
              <el-form-item>
                <B>存入缓存：</B>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="types">
                <el-select v-model="redis.types" placeholder="请选择">
                  <el-option key="s" label="字符串存入" value="s"></el-option>
                  <el-option key="l" label="list存入" value="l"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="key">
                <el-input v-model="redis.key" placeholder="键"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="value">
                <el-input v-model="redis.value" placeholder="值"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="expire">
                <el-input v-model="redis.expire" placeholder="时效">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-button @click="addRedis">添加</el-button>
                <el-button @click="deleteRedis">删除</el-button>
                <el-button @click="getRedis">获取</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div style="text-align: center"><h2>redis返回值：{{redisValue}}</h2></div>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

import { add, remove, get } from '@api/exper/redis'

export default {
  name: 'redis-quartz',
  data () {
    return {
      redisValue: '',
      redis:{
        types: '',
        key: '',
        value: '',
        expire: ''
      },
      saveRule: {
        types: [ { required: true, message: '请选择redis操作类型', trigger: 'blur' } ],
        key: [ { required: true, message: '请输入redis key', trigger: 'blur' } ]
      }
    }
  },
  mounted () {
  },
  methods: {
    addRedis () {
      this.$refs['redisForm'].validate((valid) => {
        if (valid) {
          let params = new FormData()
          params.append('types', this.redis.types)
          params.append('key', this.redis.key)
          params.append('value', this.redis.value)
          params.append('expire', this.isNotBank(this.redis.expire)?this.redis.expire:0)
          add(params).then(r => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    },
    deleteRedis () {
      this.$refs['redisForm'].validate((valid) => {
        if (valid) {
          let params = new FormData()
          params.append('types', this.redis.types)
          params.append('key', this.redis.key)
          remove(params).then(r => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    },
    getRedis () {
      this.$refs['redisForm'].validate((valid) => {
        if (valid) {
          let params = new FormData()
          params.append('types', this.redis.types)
          params.append('key', this.redis.key)
          get(params).then(r => {
            this.redisValue = r.data
            this.$message({
              message: '操作成功',
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

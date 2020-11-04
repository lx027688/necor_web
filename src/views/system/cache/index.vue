<template>
  <d2-container>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card" shadow="hover" body-style="{ padding: '0px' }">
          <div slot="header">
            <el-row>
              <el-col :span="8"><span class="fa fa-sun-o" style="font-size: 100px;"></span></el-col>
              <el-col :span="16"><span style="font-size: 100px;">{{data.maxMemory}}M</span></el-col>
            </el-row>
          </div>
          <el-row style="background-color: #00b7ee">
            <el-col :span="24"><p style="text-align: center;color: white;">总内存</p></el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover" body-style="{ padding: '0px' }">
          <div slot="header">
            <el-row>
              <el-col :span="8"><span class="fa fa-sun-o" style="font-size: 100px;"></span></el-col>
              <el-col :span="16"><span style="font-size: 100px;">{{data.usedMemory}}M</span></el-col>
            </el-row>
          </div>
          <el-row style="background-color: #00b7ee">
            <el-col :span="24"><p style="text-align: center;color: white;">已使用内存</p></el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover" body-style="{ padding: '0px' }">
          <div slot="header">
            <el-row>
              <el-col :span="8"><span class="fa fa-sun-o" style="font-size: 100px;"></span></el-col>
              <el-col :span="16"><span style="font-size: 100px;">{{data.totalAvailableMemory}}M</span></el-col>
            </el-row>
          </div>
          <el-row style="background-color: #00b7ee">
            <el-col :span="24"><p style="text-align: center;color: white;">剩余可用内存</p></el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8">
        <el-card class="box-card" shadow="hover" body-style="{ padding: '0px' }">
          <div slot="header">
            <el-row>
              <el-col :span="8"><span class="fa fa-sun-o" style="font-size: 100px;"></span></el-col>
              <el-col :span="16"><p class="cont">{{data.path}}</p></el-col>
            </el-row>
          </div>
          <el-row style="background-color: #00b7ee">
            <el-col :span="24"><p style="text-align: center;color: white;">缓存路径</p></el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover" body-style="{ padding: '0px' }">
          <div slot="header">
            <el-row>
              <el-col :span="8"><span class="fa fa-sun-o" style="font-size: 100px;"></span></el-col>
              <el-col :span="16"><span style="font-size: 99px;text-align: center;">{{data.size}}</span></el-col>
            </el-row>
          </div>
          <el-row style="background-color: #00b7ee">
            <el-col :span="24"><p style="text-align: center;color: white;cursor: pointer" @click="flushCache">刷新缓存</p></el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import { index, buildAll, getBaseSetting } from '@api/system/cache'

export default {
  name: 'system-cache',
  components: {  },
  data () {
    return {
      loading: false,
      data: [],
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      index().then(r => {
        this.data = r.data
        this.loading = false
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    flushCache () {
      let self = this
      buildAll().then(r => {
        self.init()
        getBaseSetting().then(r1 => {
          self.$localStore.set('basic', r1.data)
          this.$message({
            message: '缓存刷新成功',
            type: 'success'
          })
        })
      }).catch(err => {
        this.$message({
          message: '缓存刷新失败',
          type: 'error'
        })
        console.log('err', err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .cont {
    font-size: 26px;
    word-wrap:break-word;
    word-break:normal;
  }
</style>

<template>
  <d2-container>
    <el-row>
      <el-button type="primary" size="small" @click="cronDialog()">cron生成器</el-button>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="9">
        <!-- 列表 -->
        <el-table :data="jobs" v-loading="jobsLoading" stripe border highlight-current-row @current-change="handRow" style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
          <el-table-column prop="name" header-align="center" align="center" label="任务名称" width="200">
            <template slot-scope="scope">
              <span :title="scope.row.name">{{abbr(scope.row.desc,35)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="params" header-align="center" align="center" label="任务参数" width="200"></el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addJobGroupDialog(scope.row.name,scope.row.params)">添加任务组</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="15">
        <!-- 列表 -->
        <el-table :data="groups" v-loading="groupsLoading" stripe border style="width: 100%;margin-top: 10px;margin-bottom: 20px;">
          <!--<el-table-column prop="name" header-align="center" align="center" label="任务名称" width="250"></el-table-column>-->
          <el-table-column prop="group" header-align="center" align="center" label="任务组" width="120"></el-table-column>
          <el-table-column prop="state" header-align="center" align="center" label="任务状态" width="120"></el-table-column>
          <el-table-column prop="nextTime" header-align="center" align="center" label="下一次触发时间" width="180"></el-table-column>
          <el-table-column prop="jobData" header-align="center" align="center" label="任务参数" width="270">
            <template slot-scope="scope">
              <span :title="scope.row.jobData">{{abbr(scope.row.jobData,35)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cron" header-align="center" align="center" label="cron表达式" width="180"></el-table-column>
          <el-table-column prop="description" header-align="center" align="center" label="描述" width="180">
            <template slot-scope="scope">
              <span :title="scope.row.description">{{abbr(scope.row.description,20)}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editjobDialog(scope.row.name,scope.row.group)">编辑</el-button>
              <el-button v-if="scope.row.state==='NORMAL'" type="text" size="small" @click="pausejob(scope.row.name,scope.row.group)">暂停</el-button>
              <el-button v-if="scope.row.state==='PAUSED'" type="text" size="small" @click="resumejob(scope.row.name,scope.row.group)">开启</el-button>
              <el-button type="text" size="small" @click="deleteJob(scope.row.name,scope.row.group)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 弹窗, 新增 / 修改 -->
    <save v-if="saveVisible" ref="save" @refreshList="groupsList"></save>

    <!-- cron 生成器 -->
    <cron v-if="cronVisible" ref="cron"></cron>

  </d2-container>
</template>

<script>

import { getJobs, getGroups, remove, pause, resume } from '@api/exper/quartz'
import save from './save'
import cron from './cron'

export default {
  name: 'exper-quartz',
  components: { save, cron },
  data () {
    return {
      jobsLoading: false,
      jobs: [],
      groupsLoading: false,
      groups: [],
      saveVisible: false,
      cronVisible: false
    }
  },
  mounted () {
    this.jobsList()
  },
  methods: {
    jobsList () {
      this.jobsLoading = true
      getJobs().then(res => {
        this.jobs = res
        this.jobsLoading = false
      }).catch(err => {
        console.log('err', err)
        this.jobsLoading = false
      })
    },
    handRow(obj){
      this.groupsList(obj.name)
    },
    groupsList (name) {
      this.groupsLoading = true

      let params = new FormData()
      params.append('jobClassName', name)

      getGroups(params).then(res => {
        this.groups = res
        this.groupsLoading = false
      }).catch(err => {
        console.log('err', err)
        this.groupsLoading = false
      })
    },
    addJobGroupDialog(name,params){
      this.saveVisible = true
      this.$nextTick(() => {
        this.$refs.save.init(name,null,params)
      })
    },
    editjobDialog(name,group){
      this.saveVisible = true
      this.$nextTick(() => {
          this.$refs.save.init(name,group,null)
      })
    },
    deleteJob (name,group) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new FormData()
        params.append('jobClassName', name)
        params.append('jobGroupName', group)
        remove(params).then(r => {
          this.groupsList(name)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(err => {
          console.log('err', err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    pausejob(name,group) {
      let params = new FormData()
      params.append('jobClassName', name)
      params.append('jobGroupName', group)
      pause(params).then(r => {
        this.groupsList(name)
        this.$message({
          message: '暂停成功',
          type: 'success'
        })
      }).catch(err => {
        console.log('err', err)
      })
    },
    resumejob(name,group) {
      let params = new FormData()
      params.append('jobClassName', name)
      params.append('jobGroupName', group)
      resume(params).then(r => {
        this.groupsList(name)
        this.$message({
          message: '暂停成功',
          type: 'success'
        })
      }).catch(err => {
        console.log('err', err)
      })
    },
    cronDialog () {
      this.cronVisible = true
      this.$nextTick(() => {
        this.$refs.cron.init()
      })
    }
  }
}
</script>

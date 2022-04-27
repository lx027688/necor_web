<template>
  <el-dialog :title="!form.id?'新增':'修改'" :close-on-click-modal="false" :visible.sync="visible" top="5vh">

    <el-tabs v-model="activeName">

      <el-tab-pane label="定时任务" name="first">
        <el-form :rules="saveRule" :model="form" ref="saveForm" label-width="120px">
          <el-form-item label="任务名称" prop="jobClassName">
            <el-input v-model="form.jobClassName" disabled></el-input>
          </el-form-item>
          <el-form-item label="任务组名称" prop="jobGroupName">
            <el-input v-model="form.jobGroupName" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="cron表达式" prop="cronExpression">
            <el-input v-model="form.cronExpression"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item v-for="(p,i) in params" :label="p.key" :prop="p.key">
            <el-input v-model="params[i].val"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="cron生成器" name="second">
        <iframe src="https://www.pppet.net/" width="100%" scrolling="yes" height="600px"></iframe>
      </el-tab-pane>

    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <!--点击取消清空面板内容-->
      <el-button @click="visible = false">取 消</el-button>
      <!--点击确定添加内容-->
      <el-button type="primary" @click="saveData()" >确 定</el-button>
    </div>

  </el-dialog>
</template>

<script>

import { addJob, reschedulejob, getGroup } from '@api/exper/quartz'

export default {
  data () {
    return {
      isEdit: false,
      visible: false,
      activeName: 'first',
      params: [],
      form: {
        jobClassName: '',
        jobGroupName: '',
        cronExpression: '',
        description: '',
      },
      saveRule: {
        jobClassName: [ { required: true, message: '请输入任务名', trigger: 'blur' } ],
        jobGroupName: [ { required: true, message: '请输入组名', trigger: 'blur' } ],
        cronExpression: [ { required: true, message: '请输入cron表达式', trigger: 'blur' } ],
      }
    }
  },
  methods: {
    init (name,group,ps) {
      this.visible = true
      this.isEdit = false

      this.$nextTick(() => {
        this.$refs['saveForm'].resetFields()
        this.form.jobClassName = name || ''
        this.form.jobGroupName = group || ''

        this.params = []
        if(this.isNotBlank(ps)){
          let kv = ps.split(",")
          for(let i=0;i<kv.length;i++){
            let k = kv[i];
            let p = new Object()
            p.key = k
            this.params.push(p)
          }
        }

        // 修改执行逻辑
        if (this.form.jobClassName && this.form.jobGroupName) {
          let params = new FormData()
          params.append('jobClassName', this.form.jobClassName)
          params.append('jobGroupName', this.form.jobGroupName)

          getGroup(params).then(r => {
            let res = r.data
            this.form.cronExpression = res.cron
            this.form.description = res.description
            this.isEdit = true

            let ds = eval(res.jobData)
            for(let i=0;i<ds.length;i++){
              let d = ds[i]
              for(let k in d){
                let p = new Object()
                p.key = k
                p.val = d[k]
                this.params.push(p)
              }
            }
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    },
    saveData () {
      this.$refs['saveForm'].validate((valid) => {
        if (valid) {
          for (let i=0; i < this.params.length; i++) {
            let p = this.params[i]
            this.form[p.key] = p.val
          }

          // 添加
          if(!this.isEdit){
            let jobClassName = this.form.jobClassName
            addJob(this.form).then(r => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.$refs['saveForm'].resetFields()
              this.$emit('refreshList',jobClassName)
              this.visible = false
            }).catch(err => {
              console.log('err', err)
            })
          }
          // 修改
          if(this.isEdit){
            let jobClassName = this.form.jobClassName
            reschedulejob(this.form).then(r => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$refs['saveForm'].resetFields()
              this.$emit('refreshList',jobClassName)
              this.isEdit = false
              this.visible = false
            }).catch(err => {
              console.log('err', err)
            })
          }
        }
      })
    }
  }
}
</script>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

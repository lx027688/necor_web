<template>
  <el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="form" ref="detailForm" label-width="100px" label-suffix="：">
      <el-row>
        <el-col :span="24">
          <el-form-item label="请求参数" prop="requestParams" style="font-size: 15px;font-weight: bold;">
            <span class="font-style">{{form.requestParams}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>

export default {
  data () {
    return {
      visible: false,
      form: {
        id: '',
        requestParams: ''
      }
    }
  },
  methods: {
    init (id,requestParams) {
      this.form.id = id || ''
      this.form.requestParams = requestParams || ''
      this.visible = true
    }
  }
}
</script>

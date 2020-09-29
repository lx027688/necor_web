<template>
  <el-dialog title="cron生成器" :close-on-click-modal="false" :visible.sync="visible">
    <iframe src="https://www.pppet.net/" width="100%" scrolling="yes" height="660px"></iframe>
  </el-dialog>
</template>

<script>

export default {
  data () {
    return {
      visible: false
    }
  },
  methods: {
    init () {
      this.visible = true
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

<template>
  <d2-container>
    <el-row :gutter="20">
      <el-col :span="12">
        <dept ref="dept" @addMembers="addMembers"></dept>
      </el-col>
      <el-col :span="12">
        <admin-dept ref="adminDept"></admin-dept>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import dept from './dept'
import adminDept from './admin_dept.vue'

export default {
  name: 'system-dept',
  components: { dept, adminDept },
  methods: {
    addMembers (id, name) {
      this.$refs.adminDept.selectDept(id, name)
    }
  }
}
</script>

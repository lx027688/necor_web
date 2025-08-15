<template>
  <d2-container>
    <el-row :gutter="20">
      <el-col :span="12">
        <dept ref="dept" @addMembers="addMembers"></dept>
      </el-col>
      <el-col :span="12">
        <user-dept ref="userDept"></user-dept>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import dept from './dept'
import userDept from './user_dept.vue'

export default {
  name: 'system-dept',
  components: { dept, userDept },
  methods: {
    addMembers (id, name) {
      this.$refs.userDept.selectDept(id, name)
    }
  }
}
</script>

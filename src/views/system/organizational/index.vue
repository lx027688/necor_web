<template>
  <d2-container>
    <el-row :gutter="20">
      <el-col :span="12">
        <organizational ref="organizational" @addMembers="addMembers"></organizational>
      </el-col>
      <el-col :span="12">
        <admins-organizationals ref="adminsOrganizationals"></admins-organizationals>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import organizational from './organizational'
import adminsOrganizationals from './admins_organizationals'

export default {
  name: 'system-organizational',
  components: { organizational, adminsOrganizationals },
  methods: {
    addMembers (id,name) {
      this.$refs.adminsOrganizationals.selectOrganizational(id, name)
    }
  }
}
</script>

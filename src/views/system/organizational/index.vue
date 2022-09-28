<template>
  <d2-container>
    <el-row :gutter="20">
      <el-col :span="12">
        <organizational ref="organizational" @addMembers="addMembers"></organizational>
      </el-col>
      <el-col :span="12">
        <admins-orgs ref="adminsOrgs"></admins-orgs>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import organizational from './organizational'
import adminsOrgs from './admins_orgs'

export default {
  name: 'system-organizational',
  components: { organizational, adminsOrgs },
  methods: {
    addMembers (id,name) {
      this.$refs.adminsOrgs.selectOrganizational(id, name)
    }
  }
}
</script>

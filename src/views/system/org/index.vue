<template>
  <d2-container>
    <el-row :gutter="20">
      <el-col :span="12">
        <org ref="org" @addMembers="addMembers"></org>
      </el-col>
      <el-col :span="12">
        <admins-orgs ref="adminsOrgs"></admins-orgs>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import org from './org'
import adminsOrgs from './admins_orgs'

export default {
  name: 'system-org',
  components: { org, adminsOrgs },
  methods: {
    addMembers (id, name) {
      this.$refs.adminsOrgs.selectOrganizational(id, name)
    }
  }
}
</script>

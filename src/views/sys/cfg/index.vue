<template>
  <d2-container>
    <el-row>
      <el-col :span="11" style="margin-top:15px;">
        <basicConfig ref="basicConfig"></basicConfig>
      </el-col>
      <el-col :span="12" style="margin-top:15px;" :offset="1">
        <storageConfig ref="storageConfig"></storageConfig>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

import basicConfig from './basic_config.vue'
import storageConfig from './storage_config.vue'

export default {
  name: 'system-setting',
  components: { basicConfig, storageConfig },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

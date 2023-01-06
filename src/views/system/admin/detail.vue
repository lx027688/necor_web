<template>
  <el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible">
    <el-descriptions class="margin-top" title="" :column="3" size="medium" border v-loading="loading">
      <el-descriptions-item>
        <template slot="label"><i class="el-icon-user"></i>&nbsp;用户名</template>{{form.username}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"><i class="fa fa-user-o"></i>&nbsp;姓名</template>{{form.name}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"><i class="fa fa-user-circle"></i>&nbsp;昵称</template>{{form.nickName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"><i class="fa fa-id-card"></i>&nbsp;身份证</template>{{form.idCard}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"><i class="el-icon-mobile-phone"></i>&nbsp;手机号</template>{{form.mobile}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"><i class="fa fa-envelope-o"></i>&nbsp;邮箱</template>{{form.email}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"><i class="fa fa-file-image-o"></i>&nbsp;头像</template>
        <el-image style="width: 100px; height: 100px" :src="form.headPortrait" :preview-src-list="srcList"></el-image>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script>

import { detail } from '@api/system/admin'

export default {
  data () {
    return {
      visible: false,
      loading: false,
      form: {
        id: '',
        username: '',
        password: '',
        name: '',
        nickName: '',
        idCard: '',
        email: '',
        mobile: '',
        headPortrait: ''
      },
      srcList: []
    }
  },
  methods: {
    init (id) {
      this.form.id = id || ''
      this.visible = true
      this.loading = true

      this.$nextTick(() => {
        if (this.form.id) {
          detail(id).then(r => {
            this.form = r.data
            if (r.data.headPortrait !== null && r.data.headPortrait !== '') {
              this.srcList.push(r.data.headPortrait)
            }
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>

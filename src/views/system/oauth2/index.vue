<template>
  <div class="page">
    GITHUB11
  </div>
</template>

<script>
import store from '@/store'
import util from '@/libs/util'
import { oauth2Login } from '@api/system/login'

export default {
  data () {
    return {
      loginData: {
        token: '',
        state: ''
      }
    }
  },
  mounted () {
    this.func()
  },
  methods: {
    func () {
      var params = new URLSearchParams()
      params.append('code', this.$route.query.code)
      params.append('state', this.$route.query.state)

      oauth2Login(params).then(res => {
        console.log(res)
        util.cookies.set('uuid', res.data.username)
        util.cookies.set('token', res.data.token)
        store.dispatch('necor/user/set', { id: res.data.id, name: res.data.name }, { root: true })
        store.dispatch('load')
        this.$router.replace(this.$route.query.redirect || '/')
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    }
  }
}
</script>

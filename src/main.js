// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import necor from '@/plugin/necor'
// store
import store from '@/store/index'

// 菜单和路由设置
import router from './router'
// import { menuHeader, menuAside } from '@/menu'
// import { frameInRoutes } from '@/router/routes'

import { loadDict, getDict, isBlank, isNotBlank, abbr, contains, union } from '@/utils/common.js'

Vue.prototype.loadDict = loadDict
Vue.prototype.getDict = getDict
Vue.prototype.isBlank = isBlank
Vue.prototype.isNotBlank = isNotBlank
Vue.prototype.abbr = abbr
Vue.prototype.contains = contains
Vue.prototype.union = union

// 核心插件
Vue.use(necor)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    // // 处理路由 得到每一级的路由设置
    // this.$store.commit('d2admin/page/init', frameInRoutes)
    // // 设置顶栏菜单
    // this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // // 设置侧边栏菜单
    // this.$store.commit('d2admin/menu/asideSet', menuAside)
    // // 初始化菜单搜索功能
    // this.$store.commit('d2admin/search/init', menuHeader)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  }
}).$mount('#app')

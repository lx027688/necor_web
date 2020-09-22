// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// 菜单和路由设置
import router from './router'

// 引入公共的js文件
import { convertDict, isBank, isNotBank } from '@/utils/common.js'

// 引入封装好的js文件的路径
import localStore from '@/utils/localStore.js'

import { systemInfo } from '@api/cache'

// 导入数据字典
import NecorDictSelect from './components/necor-dict-select'
import NecorDictRadio from './components/necor-dict-radio'
import NecorSelectTree from './components/necor-select-tree'
import NecorSelectTreeLazy from './components/necor-select-tree-lazy'

// 把全局js挂接到vue原型上
Vue.prototype.$localStore = localStore

Vue.prototype.convertDict = convertDict
Vue.prototype.isBank = isBank
Vue.prototype.isNotBank = isNotBank

Vue.component('necor-dict-select', NecorDictSelect)
Vue.component('necor-dict-radio', NecorDictRadio)
Vue.component('necor-select-tree', NecorSelectTree)
Vue.component('necor-select-tree-lazy', NecorSelectTreeLazy)

// 核心插件
Vue.use(d2Admin)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
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

    this.getSystemBasicInfo()
  },
  watch: {
    // 检测路由变化切换侧边栏内容
    '$route.matched': {
      handler (matched) {
        if (matched.length > 0) {
          let fullAside = this.$store.state.d2admin.menu.fullAside
          const _side = fullAside.filter(menu => menu.path === matched[0].path)
          this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side[0].children : [])
        }
      },
      immediate: true
    }
  },
  methods: {
    getSystemBasicInfo () {
      systemInfo().then(r => {
        console.log(r)
        this.$localStore.set('basic', r)
      })
    }
  }
}).$mount('#app')

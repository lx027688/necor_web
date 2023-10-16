import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import { dbDel, dbGet, dbSet } from '@/libs/util.db'
import router from '@/router'
import { AccountLogin, AccountLogout } from '@/api/system/login'
import { isNotBlank } from '@/utils/common'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    async login ({ dispatch }, {
      username = '',
      password = '',
      captcha = ''
    } = {}) {
      const acctoken = dbGet({
        path: 'acctoken',
        user: true
      })

      // 开始请求登录接口
      var params = new URLSearchParams()
      params.append('username', username)
      params.append('password', password)
      params.append('captcha', captcha)
      params.append('accToken', acctoken)
      const res = await AccountLogin(params)
      // 设置 cookie 一定要存 uuid 和 token 两个 cookie
      // 整个系统依赖这两个数据进行校验和存储
      // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      // token 代表用户当前登录状态 建议在网络请求中携带 token
      // 如有必要 token 需要定时更新，默认保存一天
      util.cookies.set('uuid', res.data.username)
      util.cookies.set('token', res.data.token)
      // 加载菜单标识
      util.cookies.set('from', 'login')

      const roles = isNotBlank(res.data) && isNotBlank(res.data.roles) ? res.data.roles : []
      const auths = isNotBlank(res.data) && isNotBlank(res.data.auths) ? res.data.auths : []
      const menus = isNotBlank(res.data) && isNotBlank(res.data.menus) ? res.data.menus : []
      const depts = isNotBlank(res.data) && isNotBlank(res.data.depts) ? res.data.depts : []

      const rolePath = process.env.VUE_APP_TITLE + '-roles'
      const authPath = process.env.VUE_APP_TITLE + '-auths'
      const menuPath = process.env.VUE_APP_TITLE + '-menus'
      const deptPath = process.env.VUE_APP_TITLE + '-depts'

      dbSet({ path: rolePath, value: roles, user: true })
      dbSet({ path: authPath, value: auths, user: true })
      dbSet({ path: menuPath, value: menus, user: true })
      dbSet({ path: deptPath, value: depts, user: true })

      // 设置 vuex 用户信息
      await dispatch('necor/user/set', {
        id: res.data.id,
        name: isNotBlank(res.data.name) ? res.data.name : res.data.username,
        username: res.data.username
      }, { root: true })
      // 用户登录后从持久化数据加载一系列的设置
      await dispatch('load')
      // 加载路由及菜单
      router.beforeEach()
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout () {
        const res = await AccountLogout()
        if (res.code === 1000) {
          const username = util.cookies.get('uuid')
          // 删除cookie
          util.cookies.remove('token')
          util.cookies.remove('uuid')

          dbDel({ path: 'user', user: true })
          dbDel({ dbName: 'sys', path: 'user.' + username + '.user', user: true })

          // 清空 vuex 用户信息
          await dispatch('necor/user/set', {}, { root: true })
          // 跳转路由
          router.push({
            name: 'login'
          })
        }
      }
      // 判断是否需要确认
      if (confirm) {
        commit('necor/gray/set', true, { root: true })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', { type: 'warning' })
          .then(() => {
            commit('necor/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('necor/gray/set', false, { root: true })
            Message({ message: '取消注销操作' })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    async load ({ dispatch }) {
      // 加载用户名
      await dispatch('necor/user/load', null, { root: true })
      // 加载主题
      await dispatch('necor/theme/load', null, { root: true })
      // 加载页面过渡效果设置
      await dispatch('necor/transition/load', null, { root: true })
      // 持久化数据加载上次退出时的多页列表
      await dispatch('necor/page/openedLoad', null, { root: true })
      // 持久化数据加载侧边栏配置
      await dispatch('necor/menu/asideLoad', null, { root: true })
      // 持久化数据加载全局尺寸
      await dispatch('necor/size/load', null, { root: true })
      // 持久化数据加载颜色设置
      await dispatch('necor/color/load', null, { root: true })
    }
  }
}

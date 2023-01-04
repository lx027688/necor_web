import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'
import { dbGet } from '@/libs/util.db'
import { isURL } from '@/utils/validate'

import { getLoginData } from '@/api/system/login'
import { menuHeader } from '@/menu'
import layoutHeaderAside from '@/layout/header-aside'
// 路由数据
import routes, { frameInRoutes } from './routes'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  mode: 'history',
  routes
})

// 获取登录数据
let isFetchPermissionInfo = false

// 免校验token白名单
const whiteList = ['/login', '/oauth2']

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('necor/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('necor/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('necor/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (whiteList.indexOf(to.path) === -1) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    if (token && token !== 'undefined') {
      const user = dbGet({
        dbName: 'sys',
        path: 'user',
        user: true
      })
      const name = user.info.name
      if (name && name !== 'undefined' && !isFetchPermissionInfo) {
        // 请求拉取登录数据
        await loadMenu()
        // 拉取登录数据标识设为true 表示已拉取
        isFetchPermissionInfo = true
        // 跳转至请求页面
        next(to.path, true)
      } else {
        next()
      }
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      // https://github.com/d2-projects/d2-admin/issues/138
      NProgress.done()
    }
  } else {
    if (to.name === 'login') { // 登录页面
      // 请根据自身业务需要修改
      const token = util.cookies.get('token')
      const user = dbGet({
        dbName: 'sys',
        path: 'user',
        user: true
      })
      const name = user.info.name
      // 如果已经登录，则直接进入系统
      if (token && token !== undefined && name !== null && name !== '' && typeof name !== 'undefined') {
        next(from.path, true)
        NProgress.done()
      } else {
        next()
      }
    } else if (to.name === 'login') { // 登录页面

    } else { // 三方页面 无需登录的页面
      next()
    }
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('necor/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

/**
 * 加载菜单
 */
// eslint-disable-next-line no-unused-vars
async function loadMenu () {
  // 获取登录数据
  const loginData = await getLoginData().catch(err => {
    router.replace('/login')
    console.log('错误信息', err)
  })

  // 获取用户系统菜单
  const systemMenus = loginData.menus
  // 定义主路由集
  const mainRoutes = []

  // 遍历菜单,处理动态路由
  for (let i = 0; i < systemMenus.length; i++) {
    if (systemMenus[i].menuType === '103000') { //  判断菜单是否时按钮
      let mainPath = ''
      // 设置菜单的path 属性 后端会将path为空的属性处理掉
      if (systemMenus[i].path !== null && systemMenus[i].path !== '' && typeof systemMenus[i].path !== 'undefined') {
        mainPath = systemMenus[i].path
      } else {
        systemMenus[i].path = ''
      }
      // 定义子路由
      const routeChildren = []
      // 初始化主路由
      const mainRoute = { name: mainPath.replace('/', ''), children: routeChildren, path: mainPath, redirect: { name: '404' }, component: layoutHeaderAside }
      // 初始化主路由下的路由
      handleMenuAndRoutes(systemMenus[i].children, routeChildren)
      // 将主路由添加至主路由集
      mainRoutes.push(mainRoute)
      // 动态添加至路由
      router.addRoutes(mainRoutes)
    }
  }

  // 设置系统菜单 本地静态菜单数据+后端动态菜单数据
  const menus = [...menuHeader, ...systemMenus]
  frameInRoutes.push.apply(frameInRoutes, mainRoutes)
  // 处理路由 得到每一级的路由设置
  store.commit('necor/page/init', [...frameInRoutes])
  // 设置顶栏菜单
  store.commit('necor/menu/headerSet', menus)
  // 设置侧边栏菜单
  store.commit('necor/menu/asideSet', menus)
  // 初始化菜单搜索功能
  store.commit('necor/search/init', menus)
}

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 添加动态(菜单)路由
 * @param {*} systemMenuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function handleMenuAndRoutes (systemMenuList = [], routes = []) {
  for (let i = 0; i < systemMenuList.length; i++) {
    if (systemMenuList[i].children && systemMenuList[i].children.length >= 1) {
      handleMenuAndRoutes(systemMenuList[i].children, routes)
    } else if (systemMenuList[i].path && /\S/.test(systemMenuList[i].path)) {
      // 处理路由
      const id = systemMenuList[i].id
      const title = systemMenuList[i].title
      const path = systemMenuList[i].path
      const route = {
        path: path,
        component: null,
        name: path,
        meta: {
          menuId: id,
          title: title,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(systemMenuList[i].url)) {
        route.path = `i-${systemMenuList[i].id}`
        route.name = `i-${systemMenuList[i].id}`
        route.meta.iframeUrl = systemMenuList[i].url
      } else {
        try {
          route.component = _import(`${path.replace(/^\//, '')}`) || null
        } catch (e) {
        }
      }
      routes.push(route)
    }
  }
}

export default router

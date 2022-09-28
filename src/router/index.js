import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'

// 路由数据
import routes, { frameInRoutes } from './routes'
import { menuHeader } from '@/menu'
import { getLoginData } from '@/api/menu'

import { isURL } from '@/utils/validate'
import layoutHeaderAside from '@/layout/header-aside'

import localStore from '@/utils/localStore.js'

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
  routes
})

// 获取登录数据
let isFetchPermissionInfo = false
// 拉取登录数据
let fetchPermissionInfo = async () => {
  // 获取登录数据
  let loginData = await getLoginData().catch(err => {
    router.replace('/login')
    localStore.remove('admin')
    console.log('错误信息', err)
  })
  // 获取登录用户数据
  let admin = loginData.admin
  // 本地保存admin
  localStore.set('admin', admin)
  // 获取用户系统菜单
  let systemMenus = loginData.menus
  // 定义主路由集
  let mainRoutes = []

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
      let routeChildren = []
      // 初始化主路由
      let mainRoute = { name: mainPath.replace('/', ''), children: routeChildren, path: mainPath, redirect: { name: '404' }, component: layoutHeaderAside }
      // 初始化主路由下的路由
      handleMenuAndRoutes(systemMenus[i].children, routeChildren)
      // 将主路由添加至主路由集
      mainRoutes.push(mainRoute)
      // 动态添加至路由
      router.addRoutes(mainRoutes)
    }
  }

  // 设置系统菜单 本地静态菜单数据+后端动态菜单数据
  systemMenus = [...menuHeader, ...systemMenus]

  // 处理路由 得到每一级的路由设置
  store.commit('d2admin/page/init', [...frameInRoutes, ...mainRoutes])
  // 设置顶栏菜单
  store.commit('d2admin/menu/headerSet', systemMenus)
  // 设置侧边栏菜单
  store.commit('d2admin/menu/fullAsideSet', systemMenus)
  // 初始化菜单搜索功能
  store.commit('d2admin/search/init', systemMenus)
}
// 免校验token白名单
let whiteList = ['/login']

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 获取登录token
  const token = util.cookies.get('token')
  // 判断跳转非登录页
  if (whiteList.indexOf(to.path) === -1) {
    // 判断登录token是否有值
    if (token && token !== 'undefined') { // token值存在
      // 获取本地存储的用户信息
      let admin = localStore.get('admin')
      // 如果本地存储用户信息不存在且拉取登录数据标识为false 则请求后端拉取登录数据
      if (admin === null || admin === '' || typeof admin === 'undefined' || !isFetchPermissionInfo) {
        // 请求拉取登录数据
        await fetchPermissionInfo()
        // 拉取登录数据标识设为true 表示已拉取
        isFetchPermissionInfo = true
        // 跳转至请求页面
        next(to.path, true)
      } else { // 登录数据已拉取
        next()
      }
    } else { // token不存在 表示没有登录
      // 将当前预计打开的页面完整地址临时存储 登录后继续跳转
      // 这个 cookie(redirect) 会在登录后自动删除
      util.cookies.set('redirect', to.fullPath)
      // 没有登录的时候跳转到登录界面
      next({
        name: 'login'
      })
    }
  } else { // 跳转至登录页或三方页面
    if (to.name === 'login') { // 登录页面
      // 获取本地存储的用户信息
      let admin = localStore.get('admin')
      // 如果已经登录，则直接进入系统
      if (token && token !== undefined && admin !== null && admin !== '' && typeof admin !== 'undefined') {
        next(from.path, true)
        NProgress.done()
      } else {
        next()
      }
    } else { // 三方页面 无需登录的页面
      next()
    }
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

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
      let id = systemMenuList[i].id
      let title = systemMenuList[i].title
      let path = systemMenuList[i].path
      let route = {
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
        route['path'] = `i-${systemMenuList[i].menuId}`
        route['name'] = `i-${systemMenuList[i].menuId}`
        route['meta']['iframeUrl'] = systemMenuList[i].url
      } else {
        try {
          route['component'] = _import(`${path.replace(/^\//, '')}`) || null
        } catch (e) {
        }
      }
      routes.push(route)
    }
  }
}
export default router

import { dbGet } from '@/libs/util.db'

export default {
  inserted (el, binding, vnode) {
    const auths = dbGet({
      path: process.env.VUE_APP_TITLE + '-auths',
      user: true
    })
    const roles = dbGet({
      path: process.env.VUE_APP_TITLE + '-roles',
      user: true
    })
    const { value } = binding

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = auths.some(permission => {
        return permissionRoles.includes(permission)
      })
      const hasRole = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission && !hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('need roles! Like v-permission="[\'admin\']"')
    }
  }
}

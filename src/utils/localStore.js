import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
const adapter = new LocalStorage(`necor-${process.env.VUE_APP_VERSION}`)

const db = low(adapter)

const localStore = {}

// 设置数据
localStore.set = function (key, value) {
  db.set(key, value).write()
}

// 获取数据
localStore.get = function (key) {
  return db.get(key).value()
}

// 删除数据
localStore.remove = function (key) {
  db.unset(key).write()
}

// 清除所有缓存
localStore.clear = function () {
  for ( var d in db.getState() ) {
    if (d != 'posts' && d != 'admin' && d != 'basic') {
      db.unset(d).write()
    }
  }
}

export default localStore

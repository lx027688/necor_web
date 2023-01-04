import Vue from 'vue'
import Vuex from 'vuex'

import necor from './modules/necor'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    necor
  }
})

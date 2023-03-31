import Vue from 'vue'

import d2Container from './d2-container'

// 注意 有些组件使用异步加载会有影响
Vue.component('d2-container', d2Container)
Vue.component('d2-icon', () => import('./d2-icon'))
Vue.component('d2-icon-svg', () => import('./d2-icon-svg/index.vue'))
Vue.component('d2-icon-select', () => import('./d2-icon-select/index.vue'))

// 自定义组件
Vue.component('necor-dict-convert', () => import('./necor-dict-convert/index.vue'))
Vue.component('necor-dict-select', () => import('./necor-dict-select/index.vue'))
Vue.component('necor-dict-radio', () => import('./necor-dict-radio/index.vue'))
Vue.component('necor-select-tree', () => import('./necor-select-tree/index.vue'))
Vue.component('necor-select-tree-lazy', () => import('./necor-select-tree-lazy/index.vue'))
Vue.component('necor-upload-pic-base64', () => import('./necor-upload-pic-base64/index.vue'))
Vue.component('necor-editor', () => import('./necor-editor/index.vue'))

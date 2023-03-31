<template>
  <div>
    <tinymce-editor :id="tinymceId" :value="content" :init="init" :witdh="width" :height="height" :resize="resize"
                    :disabled="disabled"  @input="onInput"
    />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import tinymce from 'tinymce/tinymce'
import TinymceEditor from '@tinymce/tinymce-vue'
// 引入配置信息
import defaultConfig from './config'

export default {
  name: 'necor-editor',
  components: { TinymceEditor },
  props: {
    id: {
      type: String,
      default: function () {
        // 这个id一定要写，否则会出现莫名其妙的问题。
        return 'tinymce-' + Date.now() + Math.floor(Math.random() * 1000)
      }
    },
    // 内容
    content: {
      type: String,
      default: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 宽度
    width: {
      type: [String, Number],
      default: '100%'
    },
    // 高度
    height: {
      type: [String, Number],
      default: 450
    },
    // 是否允许拖动
    resize: {
      type: [String, Boolean],
      default: true
    },
    // 菜单栏
    menubar: {
      type: String,
      default: ''
    },
    // 工具栏
    toolbar: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tinymceId: this.id,
      init: Object.assign(defaultConfig, {
        // 组件值覆盖默认配置
        width: this.width,
        height: this.height,
        resize: this.resize,
        menubar: this.isBlank(this.menubar) ? defaultConfig.menubar : this.menubar,
        toolbar: this.isBlank(this.toolbar) ? defaultConfig.toolbar : this.toolbar
      })
    }
  },
  mounted () {
    tinymce.init({})
  },
  methods: {
    onInput (content) {
      this.$emit('update:content', content)
    }
  }
}
</script>

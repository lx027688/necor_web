// 引入主题和图标信息
import 'tinymce/themes/silver/theme.min.js'
import 'tinymce/icons/default/icons'

// 引入插件
// https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/code' // 源代码插件
import 'tinymce/plugins/pagebreak' // 分页符插件
import 'tinymce/plugins/charmap' // 特殊符号插件
import 'tinymce/plugins/emoticons' // 表情插件
import 'tinymce/plugins/save' // 保存插件
import 'tinymce/plugins/preview' // 预览插件
import 'tinymce/plugins/print' // 打印
import 'tinymce/plugins/image'// 上传图片插件
import 'tinymce/plugins/media'// 视频插件
import 'tinymce/plugins/link' // 链接插件
import 'tinymce/plugins/anchor' // 锚点插件
import 'tinymce/plugins/codesample' // 代码插件
import 'tinymce/plugins/table'// 表格插件
import 'tinymce/plugins/searchreplace' // 查找、替换插件
import 'tinymce/plugins/hr' // 水平分割线插件
import 'tinymce/plugins/insertdatetime' // 时间日期插件
import 'tinymce/plugins/paste' // 粘体插件
import 'tinymce/plugins/wordcount'// 字数统计插件
import 'tinymce/plugins/fullscreen' // 全屏插件
import 'tinymce/plugins/help' // 帮助插件

// 配置信息
// https://www.tiny.cloud/docs/configure/integration-and-setup/
export default {

  /**
   * 语言路径
   */
  language_url: '/tinymce/langs/zh_CN.js',

  /**
   * 语言
   */
  language: 'zh_CN',

  /**
   * 主题样式路径
   */
  skin_url: '/tinymce/skins/ui/oxide',

  /**
   * 文本样式路径
   */
  content_css: '/tinymce/skins/content/default/content.min.css',

  /**
   * 表情路径
   */
  emoticons_database_url: '/tinymce/emojis/emojis.min.js',

  /**
   * 宽度
   */
  width: '100%',

  /**
   * 高度
   */
  height: 450,

  /**
   * 插件
   */
  plugins: 'lists code pagebreak charmap emoticons save preview print image media link paste ' +
    'anchor codesample table wordcount fullscreen help searchreplace hr insertdatetime',

  /**
   * 菜单栏
   * file 文件
   * edit 编辑
   * view 视图
   * insert 插入
   * format 格式
   * tools 工具
   * table 表格
   * help 帮助
   */
  menubar: 'file edit view insert format tools table help',

  /**
   * 工具栏
   * https://www.tiny.cloud/docs/demo/full-featured/
   * | formatselect fontselect fontsizeselect | 段落、字体、字号
   * | undo redo | 撤销、重做
   * | code bold italic underline strikethrough | 源代码、粗体、斜体、下划线、删除线
   * | alignleft aligncenter alignright alignjustify | 左对齐、中间对齐、右对齐、两端对齐
   * | outdent indent numlist bullist insertdatetime | 减少缩进、增加缩进、编号列表、项目列表、时间日期
   * | table forecolor backcolor removeformat | 表格、文字颜色、背景色、清除格式
   * | hr searchreplace pagebreak charmap emoticons | 水平分割线、查找替换、分页符、特殊符号、表情
   * | fullscreen preview save print | 全屏、预览、保存、打印
   * | image media link anchor codesample | 上传文件、上传素材、插入链接、锚点、插入代码
   */
  toolbar: '| formatselect fontselect fontsizeselect ' +
    '| undo redo ' +
    '| code bold italic underline strikethrough ' +
    '| alignleft aligncenter alignright alignjustify ' +
    '| outdent indent numlist bullist insertdatetime ' +
    '| table forecolor backcolor removeformat ' +
    '| hr searchreplace pagebreak charmap emoticons ' +
    '| fullscreen preview save print ' +
    '| image media link anchor codesample ',

  /**
   * 工具栏展开方式
   */
  toolbar_mode: 'sliding',

  /**
   * 是否允许拖动
   * true（仅允许改变高度）, false（完全不让你动）, 'both'（宽高都能改变，注意引号）
   */
  resize: false,

  /**
   * 底部状态栏
   */
  statusbar: true,

  /**
   * 是否显示版权信息
   */
  branding: false,

  /**
   * 是否允许黏贴图片
   */
  paste_data_images: true,

  /**
   * 时间日期格式化
   */
  insertdatetime_formats: ['%H点%M分', '%Y年%m月%d日', '%Y年%m月%d日 %H点%M分', '%Y-%m-%d %H:%M']

  // // 默认使用base64格式
  // images_upload_handler: function (blobInfo, success, failure) {
  //   const maxSize = 2
  //   const blob = blobInfo.blob()
  //
  //   if (blob.size / 1024 / 1024 > maxSize) {
  //     failure('图片大小不能超过' + maxSize + 'MB')
  //     return
  //   }
  //
  //   const formData = new FormData()
  //   formData.append('file', blob, blobInfo.fileName)
  //
  //   save(formData).then(res => {
  //     success(res.data.fileUrl)
  //   }).catch(() => {
  //     failure('文件上传失败，请重试')
  //   })
  // }

}

<template>
  <span class="uploadCss">
    <el-upload ref="pic" action="/" :auto-upload="false" :accept="customAccept" :limit="limit" :class="customClass"
               list-type="picture-card" :file-list="files" :on-preview="handlePreview"
               :on-change="(file, fileList) => handleChange(file, fileList)"
               :on-remove="(file, fileList) => handleRemove(file, fileList)">
      <i class="el-icon-plus"></i>
    </el-upload>

    <el-dialog :visible.sync="imgDialog" append-to-body>
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
  </span>
</template>

<script>

export default {
  name: 'necor-upload-pic-base64',
  componentName: 'NecorUploadPicBase64',
  data () {
    return {
      files: [],
      imgUrl: '',
      imgDialog: false
    }
  },
  props: {
    pics: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    // 文件条数限制
    limit: {
      type: Number
    },
    // 文件大小限制(单位MB)
    size: {
      type: Number,
      default: 1
    },
    // 自定义class
    customClass: {
      type: String,
      default: 'customClass'
    },
    customAccept: {
      type: String
    }
  },
  created () {
  },
  mounted () {
    if (this.isNotBlank(this.pics)) {
      this.pics.forEach(e => {
        const file = {
          name: e.split('/')[e.split('/').length - 1],
          url: e
        }
        this.files.push(file)
      })
    }
    if (this.pics.length >= this.limit) {
      document.querySelector('.' + this.customClass + ' > div').style.display = 'none'
    } else {
      document.querySelector('.' + this.customClass + ' > div').style.display = 'inline-block'
    }
  },
  methods: {
    handlePreview (file) {
      this.imgUrl = file.url
      this.imgDialog = true
    },
    handleChange (file, fileList) {
      // 获取上传文件大小
      const fileSize = Number(file.size / 1024 / 1024)

      if (fileSize > this.size) {
        this.$msgbox({
          title: '',
          message: '文件大小不能超过' + this.size + 'MB，请重新上传。',
          type: 'warning'
        })
        const index = fileList.findIndex(item => item.uid === file.uid)
        fileList.splice(index, 1)
        return
      }

      if (this.pics.length + 1 >= this.limit) {
        document.querySelector('.' + this.customClass + ' > div').style.display = 'none'
      }
      this.getPicBase64(file.raw).then(res => {
        this.pics.push(res)
      })
      this.$emit('uploadChange')
    },
    handleRemove (file, fileList) {
      if (file.raw) {
        this.getPicBase64(file.raw).then(res => {
          const index = this.pics.indexOf(res)
          if (index !== -1) {
            this.pics.splice(index, 1)
          }
        })
      } else {
        const index = this.pics.indexOf(file.url)
        if (index !== -1) {
          this.pics.splice(index, 1)
        }
      }
      this.$emit('uploadChange')
      document.querySelector('.' + this.customClass + ' > div').style.display = 'inline-block'
    },
    // 图片转base64
    getPicBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          resolve(e.target.result)
        }
        reader.onerror = err => {
          reject(err)
        }
        reader.onloadend = e => {
          resolve(e.target.result)
        }
      })
    }
  }
}
</script>

<style>
.uploadCss > div > ul {
  line-height: 0px;
}
.uploadCss > div > ul > li {
  margin-bottom: 0px !important;
}

.customClass > div {
  width: 145px;
  height: 145px;
}
.customClass > div > i{
  margin-top: 30%;
  display: block;
}
.customClass > ul{
  width: 145px !important;
  height: 145px !important;
}
.customClass > ul > li{
  width: 145px !important;
  height: 145px !important;
}
</style>

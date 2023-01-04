<template>
  <d2-container>
    <el-card shadow="always">
      <el-form label-position="right" label-width="120px" :model="form" ref="form" >
        <el-row>
          <el-col :span="8">
            <el-popover placement="top-start" title="提示" width="250" trigger="hover" content="模块前缀例如sys，表前缀将会是sys，如：sys_xxx。类名前缀将会是Sys，如SysXxx。">
              <el-form-item label="模块前缀：" slot="reference" prop="prefix">
                <el-input v-model="form.prefix" placeholder="模块前缀" @blur="changePage()"></el-input>
              </el-form-item>
            </el-popover>
          </el-col>
          <el-col :span="8">
            <el-popover placement="top-start" title="提示" width="250" trigger="hover" content="例如UserEntity,实体名称为：user">
              <el-form-item label="实体名称：" slot="reference" prop="entityName">
                <el-input v-model="form.entityName" placeholder="实体名称" @blur="changePage()"></el-input>
              </el-form-item>
            </el-popover>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作者：" prop="author">
              <el-input v-model="form.author" placeholder="作者"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="版本：" prop="version">
              <el-input v-model="form.version" placeholder="版本"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="包路径：" prop="package">
              <el-input v-model="form.package" placeholder="包路径"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实体描述：" prop="entityDesc">
              <el-input v-model="form.entityDesc" placeholder="实体描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="字段："  prop="fields">
              <el-table :data="form.fields" border style="width: 100%">
                <el-table-column prop="fieldType" label="字段类型">
                  <template slot-scope="scope">
                    <el-input v-model="form.fields[scope.$index].fieldType" placeholder="字段类型"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="fieldName" label="字段名称">
                  <template slot-scope="scope">
                    <el-input v-model="form.fields[scope.$index].fieldName" placeholder="字段名称"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="fieldDesc" label="字段描述">
                  <template slot-scope="scope">
                    <el-input v-model="form.fields[scope.$index].fieldDesc" placeholder="字段描述"></el-input>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" header-align="center" align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteNode(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="addNode()">添加字段</el-button>
          <el-button type="primary" @click="generate()">生成代码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </d2-container>
</template>

<script>

import { generateCode } from '@api/system/develop'

export default {
  name: 'system-code',
  data () {
    return {
      form: {
        prefix: '',
        entityName: '',
        entityDesc: '',
        package: 'com.necor',
        author: 'necor',
        version: '1.0',
        fields: [{ fieldType: '', fieldName: '', fieldDesc: '' }]
      }
    }
  },
  created () {
  },
  methods: {
    // 添加标本div
    addNode () {
      this.form.fields.push({ fieldType: '', fieldName: '', fieldDesc: '' })
    },
    // 删除样本div
    deleteNode (i) {
      // 删除index为i,位置的数组元素
      this.form.fields.splice(i, 1)
    },
    changePage () {
      if (this.isNotBlank(this.form.prefix)) {
        this.form.package = 'com.necor.' + this.form.prefix
        if (this.isNotBlank(this.form.entityName)) {
          const classLowercase = this.form.entityName.replace(/([A-Z])/g, '_$1').toLowerCase()
          this.form.package = 'com.necor.' + this.form.prefix + '.' + classLowercase
        }
      }
    },
    generate () {
      generateCode(this.form).then(res => {
        if (!res) {
          return
        }
        const url = window.URL.createObjectURL(new Blob([res]))
        const link = document.createElement('a')
        const fileName = this.form.entityName + '.zip'
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
}
</script>

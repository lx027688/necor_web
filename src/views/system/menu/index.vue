<template>
  <d2-container>
    <el-button-group>
      <el-button :type="addType" icon="el-icon-circle-plus-outline" size="mini" @click="addMenu">添加</el-button>
      <el-button :type="editType" icon="el-icon-edit" size="mini" @click="editMenu">编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeMenu">删除</el-button>
    </el-button-group>
    <el-popover placement="top-start" title="温馨提示" width="400" trigger="hover">
      <li>请不要在`功能`类型节点下建子节点</li>
      <li>`菜单`类型节点的权限标识请设置为其某个`功能`类型子节点的权限标识</li>
      <el-button slot="reference" size="mini" icon="el-icon-info" style="float:right">操作提示</el-button>
    </el-popover>
    <el-row>
      <el-col :span="8" style="margin-top:15px;">
        <el-tree ref="tree" class="filter-tree" node-key="id" default-expand-all highlight-current :expand-on-click-node="false" :data="menuList" :props="defaultProps" @node-click="selectMenu"></el-tree>
      </el-col>
      <el-col :span="16" style="margin-top:15px;">
        <el-card shadow="always">
          <el-form label-position="right" label-width="80px" :model="form" ref="saveForm" :rules="saveRules">
            <el-row>
              <el-col :span="8">
                <el-form-item label="父级节点" prop="parentId">
                  <necor-select-tree v-model="form.parentId" :options="menuList" style="width: 100%" accordion></necor-select-tree>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="类型" prop="menuType">
                  <necor-dict-select code="103" v-model="form.menuType" placeholder="请选择菜单类型"></necor-dict-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="图标" prop="icon">
                  <d2-icon-select v-model="form.icon" :user-input="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="菜单名" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名"></el-input>
            </el-form-item>
            <el-form-item label="路径" prop="path" v-if="form.menuType==='103000'">
              <el-input v-model="form.path" placeholder="请输入路径"></el-input>
            </el-form-item>
            <el-form-item label="接口地址" prop="url">
              <el-input v-model="form.url" placeholder="请输入接口地址"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="auth">
              <el-input v-model="form.auth" placeholder="请输入权限标识"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveMenu">提交</el-button>
              <el-button @click="reset">清空</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import { findMenuTreeList, saveMenu, removeMenu, menuDetail } from '@api/system/menu'
export default {
  name: 'system-menu',
  data () {
    return {
      menuList: [],
      defaultProps: {
        label: 'title'
      },
      addType: 'primary',
      editType: 'info',
      model: 'add',
      menuId: '',
      menuName: '',
      parentName: '',
      form: {
        id: '',
        parentId: '',
        name: '',
        path: '',
        url: '',
        icon: '',
        auth: '',
        sort: 0,
        menuType: ''
      },
      saveRules: {
        name: [{ required: true, message: '请输入菜单名', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    getMenuList () {
      findMenuTreeList().then(res => {
        this.menuList = res.data
      }).catch(err => {
        console.log('err', err)
      })
    },
    selectMenu (data) {
      this.menuId = data.id
      this.menuName = data.title
      if (this.model === 'add') {
        this.parentName = this.menuName
        this.form.parentId = this.menuId
      } else if (this.model === 'edit') {
        menuDetail(this.menuId).then(res => {
          const r = res.data
          this.form = r
          this.form.parentId = r.parent.id
          this.parentName = r.parent.name
        })
      }
    },
    addMenu () {
      this.model = 'add'
      this.addType = 'primary'
      this.editType = 'info'
      if (this.menuId != null && this.menuId !== '') {
        this.$refs.saveForm.resetFields()
        this.form = {}
        this.parentName = this.menuName
        this.form.parentId = this.menuId
      }
    },
    editMenu () {
      this.model = 'edit'
      this.addType = 'info'
      this.editType = 'primary'
      if (this.menuId != null && this.menuId !== '') {
        menuDetail(this.menuId).then(r => {
          this.form = r
          this.form.parentId = r.parent.id
          this.parentName = r.parent.name
        })
      }
    },
    saveMenu () {
      this.$refs.saveForm.validate((valid) => {
        if (valid) {
          if (this.model == null || this.model === '') {
            this.$message.error('保存失败')
            return
          }
          saveMenu(this.form).then(r => {
            this.$message.success('保存成功')
            this.getMenuList()
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    },
    removeMenu () {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeMenu(this.menuId).then(r => {
          this.$message.success('删除成功')
          this.getMenuList()
        }).catch(err => {
          console.log('err', err)
        })
      })
    },
    reset () {
      this.$refs.saveForm.resetFields()
    },
    getValue (value) {
      this.form.parentId = value
    }
  }
}
</script>

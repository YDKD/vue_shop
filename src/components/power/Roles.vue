<!--
* @description 
* @fileName Roles.vue
* @author YDKD
* @date 2020/05/18 14:15:38
!-->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 通过作用域插槽来实现数据的展示 -->
          <template slot-scope="scope">
            <!-- 通过三层循环，实现数据展示 -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="i1"
            >
              <!-- 一级权限渲染 -->
              <el-col :span="5">
                <el-tag closable @close="removeRolesById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限渲染 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="i2"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 二级权限渲染 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRolesById(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限渲染 -->
                  <el-col :span="18">
                    <el-tag
                      :class="[i3 === 0 ? '': 'bdtop']"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRolesById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showeditRolesUser(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-danger"
              @click="deleteRolesUser(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightsDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框展示区域 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="addRolesDialogClosed"
    >
      <!-- 添加用户表单 -->
      <el-form :model="addRolesForm" :rules="addFormRules" ref="addRolesForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框展示区域 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRolesDialogVisible"
      width="50%"
      @close="editRolesDialogClosed"
    >
      <!-- 添加用户表单 -->
      <el-form :model="editRolesForm" :rules="editFormRules" ref="editRolesForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="50%">
      <!-- 分配权限树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treetProps"
        :default-checked-keys="defkeys"
        show-checkbox
        node-key="id"
        default-expand-all
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolesList: [],
      //  展示角色
      addRolesDialogVisible: false,
      //   添加角色信息
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },

      // 添加角色匹配规则
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { required: true, min: 4, max: 6, message: '长度在4~6位' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },

      //   修改用户的信息
      editRolesForm: [],

      // 修改用户提示框控制
      editRolesDialogVisible: false,

      // 修改用户角色匹配规则
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { required: true, min: 4, max: 6, message: '长度在4~6位' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 控制分配角色权限对话框的显示与隐藏
      setRightsDialogVisible: false,
      // 权限数据
      rightslist: [],
      // 分配权限的树形属性对象
      treetProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的权限的ID值
      defkeys: [],
      // 当前角色的 ID
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //   获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表数据失败!')
      }
      // 保存数据
      this.rolesList = res.data
      console.log(this.rolesList)
    },

    // 添加角色
    addRoles() {
      // 提交之前预验证
      this.$refs.addRolesForm.validate(async valiad => {
        if (!valiad) {
          this.addRolesDialogVisible = false
          return this.$message.error('角色信息有误，请重新输入!')
        }

        // 提交数据
        const { data: res } = await this.$http.post('roles', this.addRolesForm)

        if (res.meta.status !== 201) {
          return this.$notify.error({
            title: '失败',
            message: '添加用户角色失败',
            duration: 2000
          })
        }
        // 添加用户角色成功
        this.$notify.success({
          title: '成功',
          message: '添加用户角色成功',
          duration: 2000
        })
        // 刷新用户列表
        this.getRolesList()
        // 隐藏对话框
        this.addRolesDialogVisible = false
      })
    },

    // 关闭弹框，重置匹配规则
    addRolesDialogClosed() {
      this.$refs.addRolesForm.resetFields()
    },

    // 根据id拿到用户信息
    async showeditRolesUser(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败!')
      }
      // 保存数据
      this.editRolesForm = res.data
      // 打开编辑修改用户对话框
      this.editRolesDialogVisible = true
    },

    // 修改用户对话框关闭操作
    editRolesDialogClosed() {
      this.$refs.editRolesForm.resetFields()
    },

    // 修改用户
    async editRoles() {
      const { data: res } = await this.$http.put(
        'roles/' + this.editRolesForm.roleId,
        this.editRolesForm
      )
      if (res.meta.status !== 200) {
        this.$notify.error({
          title: '失败',
          message: '修改用户角色失败',
          duration: 2000
        })
      }
      // 修改成功
      this.$notify.success({
        title: '成功',
        message: '修改用户角色成功',
        duration: 2000
      })
      // 刷新列表
      this.getRolesList()
      // 关闭对话框
      this.editRolesDialogVisible = false
    },

    // 删除用户角色
    async deleteRolesUser(id) {
      // 根据提示信息，来判断用户是否执行删除用户
      const comfirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (comfirmResult !== 'confirm') {
        return this.$message.info('已取消了删除操作')
      }
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        this.$notify.error({
          title: '失败',
          message: '删除用户角色失败',
          duration: 2000
        })
      }
      this.$notify.success({
        title: '成功',
        message: '删除用户角色成功',
        duration: 2000
      })
      //   刷新列表
      this.getRolesList()
      // 关闭对话框
      this.editRolesDialogVisible = false
    },

    // 根据ID删除对应权限
    async removeRolesById(role, rightId) {
      const comfirmResult = await this.$confirm(
        '此操作将永久删除该角色权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (comfirmResult !== 'confirm') {
        return this.$message.info('已取消了删除操作')
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        this.$notify.error({
          title: '失败',
          message: '删除角色权限成功',
          duration: 2000
        })
      }

      this.$notify.success({
        title: '成功',
        message: '删除角色权限成功',
        duration: 2000
      })
      // 刷新角色权限列表数据，此处不建议直接调用获取列表的方法，因为会重新渲染
      // table表格，会关闭table表格
      // this.getRolesList()

      // 因为调用接口成功后返回的data就是最新的数据
      role.children = res.data
    },

    // 展示分配权限
    async showSetRightsDialog(role) {
      // 保存当前角色ID
      this.roleId = role.id
      // 每次请求访问改页面 defkeys是空的，但是每次请求 getkeys函数会给
      // defkeys赋值，那么我们再每次点击分配权限的时候，应当对 defkeys情况
      this.defkeys = []
      // 在打开对话框之前，拿到角色权限数据
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色权限数据失败!')
      }
      // 保存数据到data中
      this.rightslist = res.data
      // 调用递归函数
      this.getKeys(role, this.defkeys)
      // 打开对话框
      this.setRightsDialogVisible = true
    },

    // 递归保存三级权限的ID值到defkeys数组中
    getKeys(node, arr) {
      // 通过三级节点没有children属性，来进行判断
      // 已经是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 不是三级节点，继续递归
      node.children.forEach(item => this.getKeys(item, arr))
    },

    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$notify.error({
          title: '失败',
          message: '分配权限失败',
          duration: 2000
        })
      }

      this.$notify.success({
        title: '成功',
        message: '用户分配成功',
        duration: 2000
      })
      // 刷新角色列表
      this.getRolesList()
      // 隐藏对话框
      this.setRightsDialogVisible = false
    }
  }
}
</script>
<style lang='less' scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>

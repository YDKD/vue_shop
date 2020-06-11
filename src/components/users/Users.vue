<!--
* @description 
* @fileName Users.vue
* @author YDKD
* @date 2020/05/14 16:47:21
!-->
<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 搜索框部分 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @keyup.enter.native="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <!-- 增加索引列，只需要给 el-table-column 增加 type="index" -->
        <el-table-column type="index" label="序号" width="60px" align="center"></el-table-column>
        <el-table-column align="center" label="姓名" prop="username"></el-table-column>
        <el-table-column align="center" label="邮箱" prop="email"></el-table-column>
        <el-table-column align="center" label="电话" prop="mobile"></el-table-column>
        <el-table-column align="center" label="角色" prop="role_name"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <!-- 编辑用户 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除用户 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
              :disabled="comfimDelete"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="shoeRoleInfo(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 添加用户提示区域 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加用户表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户提示区域 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 修改用户表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色提示区域 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <!-- 角色信息展示 -->
      <div>
        <p>当前用户: {{roleInfo.username}}</p>
        <p>当前角色: {{ roleInfo.role_name}}</p>
        <p>
          当前所选角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱验证规则
    var checkEmail = (rules, vaule, cb) => {
      const regEmail = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
      if (regEmail.test(vaule)) {
        return cb()
      }
      return cb(new Error('请输入合法邮箱'))
    }
    // 自定义手机号验证规则
    var checkMobile = (rules, vaule, cb) => {
      const regMobile = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
      if (regMobile.test(vaule)) {
        return cb()
      }
      return cb(new Error('请输入合法手机号'))
    }

    return {
      // 获取用户列表参数对象
      queryInfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 当前显示多少条数据
        pagesize: 2
      },
      // 用户数据
      userList: [],
      // 总用户数
      total: 0,
      // 添加用户提示框默认值---不提示
      addDialogVisible: false,
      // 添加用户数据对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户匹配规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            required: true,
            min: 3,
            max: 10,
            message: '用户名长度在3~10位',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            required: true,
            min: 6,
            max: 10,
            message: '用户名长度在6~10位',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 查询到的用户信息对象
      editForm: {},
      editDialogVisible: false,
      // 修改用户匹配规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      comfimDelete: false,
      // 控制分配角色对话框显示与隐藏
      setRolesDialogVisible: false,
      // 角色信息
      roleInfo: {},
      // 角色列表
      roleList: [],
      // 当前所选角色
      selectedRoleId: ''
    }
  },
  created() {
    // 获取用户列表数据
    this.getUserList()
  },
  methods: {
    // 获取用户信息
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表数据失败!')
      }
      // 将拿到的数据放到自定义的 userList中去
      this.userList = res.data.users
      this.total = res.data.total
    },

    // 监听pageSize 改变
    handleSizeChange(newSize) {
      // 给参数对象赋值
      this.queryInfo.pagesize = newSize
      // 重新发起请求
      this.getUserList()
    },

    // 监听当前页改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },

    // 监听用户状态的改变
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        // 请求失败，将改变之后的mg_state值取反
        userinfo.mg_state = !userinfo.mg_state
        this.$notify.error({
          title: '失败',
          message: '修改用户状态失败!',
          duration: 2000
        })
      }
      this.$notify.success({
        title: '成功',
        message: '修改用户状态成功!',
        duration: 2000
      })
    },

    // 监听添加用户提示框关闭事件
    addDialogClosed() {
      this.$refs.addForm.resetFields()
    },

    // 添加用户
    addUser() {
      this.$refs.addForm.validate(async valiad => {
        // 表单提交前的预验证
        if (!valiad) {
          this.addDialogVisible = false
          return this.$message.error('用户信息有误，请重新输入')
        }

        // 预校验成功，发起 axios请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.addDialogVisible = false
          return this.$notify.error({
            title: '失败',
            message: '添加用户失败!',
            duration: 2000
          })
        }
        this.$notify.success({
          title: '成功',
          message: '添加用户成功!',
          duration: 2000
        })
        // 隐藏对话框
        this.addDialogVisible = false
        // 添加用户成功，刷新用户列表
        this.getUserList()
      })
    },

    // 修改用户对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },

    // 监听修改用户提示关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 更新用户信息
    editUser() {
      //  提交之前的预判断
      this.$refs.editFormRef.validate(async valiad => {
        if (!valiad) {
          return this.$message.error('表单信息有误，请重新输入')
        }
        // 验证成功，发起请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        // 判断请求结果
        if (res.meta.status !== 200) {
          return this.$notify.error({
            title: '失败',
            message: '更新用户信息失败',
            duration: 2000
          })
        }
        // 关闭提示框
        this.editDialogVisible = false
        // 重新获取用户数据
        this.getUserList()
        // 修改成功,进行提示
        this.$notify.success({
          title: '成功',
          message: '修改用户信息成功',
          duration: 2000
        })
      })
    },

    // 删除用户信息
    async removeUserById(id) {
      this.comfimDelete = true
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
        this.$message.info('已取消了删除操作')
        return (this.comfimDelete = false)
      }
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) {
        // 删除失败提示
        return this.$notify.error({
          title: '失败',
          message: '删除用户失败',
          duration: 2000
        })
      }
      // 删除成功提示
      this.$notify.success({
        title: '成功',
        message: '删除用户成功',
        duration: 2000
      })
      // 重新加载用户列表
      this.getUserList()
      this.comfimDelete = false
    },

    // 展示分配角色的对话框
    async shoeRoleInfo(userInfo) {
      // 保存数据到本地
      this.roleInfo = userInfo

      // 获取角色列表
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }

      this.roleList = res.data
      this.setRolesDialogVisible = true
    },

    // 点击按钮分配角色
    async saveRoleInfo() {
      // 判断用户是否选中
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      const { data: res } = await this.$http.put(
        `users/${this.roleInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status !== 200) {
        return this.$notify.error({
          title: '失败',
          message: '分配角色失败',
          duration: 2000
        })
      }
      this.$notify.success({
        title: '成功',
        message: '分配角色',
        duration: 2000
      })
      this.getUserList()
      this.setRolesDialogVisible = false
    },

    // 监听分配角色对话框关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.roleInfo = ''
    }
  }
}
</script>
<style lang='less' scoped>
.el-pagination {
  display: flex;
  justify-content: center;
}
</style>

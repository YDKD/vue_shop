<!--
* @description 
* @fileName Cate.Vue
* @author YDKD
* @date 2020/05/22 10:34:28
!-->
<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialog()">商品分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        index-text="#"
        :show-row-hover="false"
        show-index
        border
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: green; font-size: 14px"
          ></i>
          <i class="el-icon-error" v-else style="color: red; font-size: 14px"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot-scope="scope" slot="opt">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="getEditCateMessage(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 表单验证 -->
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options 用来指定数据源 -->
          <!-- options 用来指定配置对象 -->
          <el-cascader
            v-model="cateKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="cascaderCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form :model="editCateForm" :rules="editCateRules" ref="editRuleRefs" label-width="100px">
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询列表参数
      queryInfo: {
        type: 3,
        // 当前页
        pagenum: 1,
        // 每页显示数目
        pagesize: 5
      },

      // 商品分类列表数据，默认为空
      cateList: [],
      // 商品总条数
      total: 0,
      // tree-table表格匹配
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类表单对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级ID
        cat_pid: 0,
        // 默认添加的默认分类为1级
        cat_level: 0
      },
      // 添加分类表单验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            required: true,
            min: 3,
            max: 8,
            message: '分类名称长度为3~8位',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类数据
      parentCateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        multiple: true,
        checkStrictly: true,
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 保存选中项的ID
      // 因为我们使用了多选模式，而这个多选模式，会把选中的ID值放到一个数组中去，
      // 所以我们的数组中又存放了一个数组
      cateKeys: [],
      // 根据ID保存修改分类的信息
      editCateForm: {},
      // 控修改辑对话框的显示与隐藏
      editCateDialogVisible: false,
      // 编辑用户的验证规则
      editCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            required: true,
            min: 3,
            max: 8,
            message: '分类名称长度在3~8位',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  created() {
    this.getCateList()
  },

  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      // 保存数据到 data
      this.cateList = res.data.result
      this.total = res.data.total
    },

    // 监听每页显示数据改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },

    // 监听当前页改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },

    // 点击按钮展示分类对话框
    showCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },

    // 获取父级分类数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据列表失败')
      }
      this.parentCateList = res.data
    },

    // 级联选择器选中发生改变时触发函数
    cascaderCateChanged() {
      // 通过保存keys的数组的长度，来确定我们添加的分类的层级
      // 先判断我们定义的数组中是否存在 ID数组
      if (this.cateKeys.length > 0) {
        // 父级分类的ID
        this.addCateForm.cat_pid = this.cateKeys[0][this.cateKeys[0].length - 1]
        this.addCateForm.cat_level = this.cateKeys[0].length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    // 监听对话框关闭事件
    addCateDialogClosed() {
      // 重置表单
      this.$refs.addCateRef.resetFields()
      // 重置cateKeys数组
      this.cateKeys[0] = []
      // 重置添加分类数据对象的值
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },

    // 点击按钮，添加分类
    addCate() {
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$notify.error({
            title: '失败',
            message: '添加分类失败',
            duration: 2000
          })
        }

        this.$notify.success({
          title: '成功',
          message: '添加分类成功',
          duration: 2000
        })
        // 刷新分类列表
        this.getCateList()
        // 关闭对话看
        this.addCateDialogVisible = false
      })
    },

    // 获取的分类信息
    async getEditCateMessage(id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类信息失败')
      }
      // 保存数据到data
      this.editCateForm = res.data
      // 打开对话框
      this.editCateDialogVisible = true
    },

    // 监听修改分类的对话框的关闭
    editCateDialogClosed() {
      this.$refs.editRuleRefs.resetFields()
      this.editCateForm.cat_name = ''
    },

    // 修改分类
    async editCate() {
      const { data: res } = await this.$http.put(
        'categories/' + this.editCateForm.cat_id,
        {
          cat_name: this.editCateForm.cat_name
        }
      )
      if (res.meta.status !== 200) {
        return this.$notify.error({
          title: '失败',
          message: '修改分类失败',
          duration: 2000
        })
      }

      this.$notify.success({
        title: '成功',
        message: '修改用户成功',
        duration: 2000
      })

      // 刷新列表
      this.getCateList()
      // 关闭对话框
      this.editCateDialogVisible = false
    },

    // 删除分类
    async deleteCate(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('用户取消了删除操作')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$notify.error({
          title: '失败',
          message: '删除分类失败',
          duration: 2000
        })
      }

      this.$notify.success({
        title: '成功',
        message: '删除分类成功',
        duration: 2000
      })

      // 刷新分类列表
      this.getCateList()
    }
  }
}
</script>
<style lang='less' scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>

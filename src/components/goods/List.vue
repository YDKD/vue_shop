<!--
* @description 
* @fileName List.vue
* @author YDKD
* @date 2020/05/31 11:47:57
!-->
<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 头部搜索部分 -->
      <el-row :gutter="20">
        <!-- 搜索框部分 -->
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getGoodsList"
            @keyup.enter.native="querMessage"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="querMessage"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 信息展示部分 -->
      <el-table :data="goodsData" stripe border>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          label="序号"
          width="80px"
        ></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="160px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="120px"
        ></el-table-column>
        <el-table-column
          prop="goods_number"
          label="商品数量"
          width="120px"
        ></el-table-column>
        <el-table-column label="创建时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 4, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 修改商品信息对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editGoodsDialogVisible"
      width="50%"
      @close="closedEidtDialog"
    >
      <!-- 表单信息部分 -->
      <el-form
        :model="editGoodsForm"
        :rules="editGoodsRules"
        ref="editGoodsForm"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editGoodsForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品数据
      goodsData: [],
      // 商品总数
      total: 0,
      editGoodsDialogVisible: false,
      // 根据ID获取到的数据信息
      editGoodsForm: {},
      // 修改商品信息表单的校验规则
      editGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getGoods()
  },

  methods: {
    // 获取商品信息
    async getGoods() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      this.goodsData = res.data.goods
      this.total = res.data.total
    },

    // 监听当前显示几条数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoods()
    },

    // 监听当前页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoods()
    },

    // 查询数据
    querMessage() {
      this.getGoods()
    },

    // 监听清空选项框，重新获取页面数据
    getGoodsList() {
      this.queryInfo.query = ''
      this.getGoods()
    },

    // 删除商品
    async deleteGoods(id) {
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

      // 发起删除请求
      const { data: res } = await this.$http.delete('goods/' + id)

      if (res.meta.status !== 200) {
        return this.$notify.error({
          title: '失败',
          message: '删除商品失败',
          duration: 2000
        })
      }

      this.$notify.success({
        title: '成功',
        message: '删除商品成功',
        duration: 2000
      })

      this.getGoods()
    },

    // 添加商品
    addGoods() {
      this.$router.push('/goods/add')
    },

    // 修改商品信息
    async showEditDialog(id) {
      // 打开修改商品信息对话框
      this.editGoodsDialogVisible = true
      // 根据ID，查询到对应的商品信息
      const { data: res } = await this.$http.get(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败')
      }
      this.editGoodsForm = res.data
    },

    // 关闭对话框，清除表单的验证规则
    closedEidtDialog() {
      this.$refs.editGoodsForm.resetFields()
    },

    // 提交修改信息
    async editGoods() {
      console.log(this.editGoodsForm)
      const { data: res } = await this.$http.put(
        `goods/${this.editGoodsForm.goods_id}`,
        {
          goods_cat: this.editGoodsForm.goods_cat,
          goods_name: this.editGoodsForm.goods_name,
          goods_price: this.editGoodsForm.goods_price,
          goods_number: this.editGoodsForm.goods_number,
          goods_weight: this.editGoodsForm.goods_weight,
          goods_introduce: this.editGoodsForm.goods_introduce,
          pics: this.editGoodsForm.pics,
          attrs: this.editGoodsForm.attrs
        }
      )
      console.log(res)
    }
  }
}
</script>
<style lang="less" scoped></style>

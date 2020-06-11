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
        <el-table-column label="创建时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
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
      total: 0
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
    }
  }
}
</script>
<style lang="less" scoped></style>

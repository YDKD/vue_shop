<!--
* @description 
* @fileName Order.vue
* @author YDKD
* @date 2020/06/15 08:38:36
!-->
<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡牌视图区域 -->
    <el-card>
      <!-- 头部搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格信息部分 -->
      <el-table :data="orderList" border stripe>
        <el-table-column
          type="index"
          label="序号"
          width="60px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          align="center"
        ></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          align="center"
        ></el-table-column>
        <el-table-column prop="create_time" label="下单时间" align="center">
          <template slot-scope="scope">{{
            scope.row.create_time | dateFormat
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="checkBox"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页部分 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="50%"
      @close="closedDialog"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <!-- 时间线 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in progressData"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'

export default {
  data() {
    return {
      // 查询订单数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 订单数据
      orderList: [],
      // 总数据条数
      total: 0,
      editAddressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      // 物流信息对话框
      progressDialogVisible: false,
      // 物流信息数据
      progressData: [],
      reverse: true
    }
  },

  created() {
    this.getOrderList()
  },

  methods: {
    // 获取订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },

    //  监听页面大小改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    // 监听当前页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },

    // 点击修改地址按钮，显示对话框
    checkBox() {
      this.editAddressDialogVisible = true
    },

    // 关闭对话框，清除校验规则
    closedDialog() {
      this.$refs.addressFormRef.resetFields()
    },

    // 点击按钮，展示物流信息对话框
    async showProgressBox() {
      // 打开物流信息对话框
      this.progressDialogVisible = true
      // 测试单号：1106975712662 获取物流信息
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }

      this.progressData = res.data
      console.log(this.progressData)
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>

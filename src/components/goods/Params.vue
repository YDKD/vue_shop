<!--
* @description 
* @fileName Params.vue
* @author YDKD
* @date 2020/05/25 16:02:16
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
      <!-- 头部警示部分 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>请选择商品分类:</span>
          <!-- 商品分类的级联选择器 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="cateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据
      cateList: [],
      // 级联选择器的匹配对象
      cateProps: {
        multiple: true,
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选择商品的keys
      selectedCateKeys: []
    }
  },

  created() {
    this.getCateList()
  },

  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = res.data
    },

    // 级联选择器选中状态发生改变触发函数
    cateChange() {
      console.log(this.selectedCateKeys)
      console.log(this.selectedCateKeys[0])
    }
  }
}
</script>
<style lang='less' scoped>
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  margin-left: 15px;
}
</style>

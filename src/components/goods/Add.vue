<!--
* @description 
* @fileName Add.vue
* @author YDKD
* @date 2020/05/31 18:01:39
!-->
<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部警告提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 进度条区域 -->
      <el-steps
        :space="400"
        :active="Number(activeIndex)"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- Tab标签页 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- v-model绑定的是选中项的ID值 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的 Item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  :label="cb"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 是上传文件的api地址， headers 是请求头信息，on-success 是上传成功的钩子函数 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="addStore"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片的对话框 -->
    <el-dialog
      title="预览图片"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="picURL" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 导入 loadash
import _ from 'lodash'

export default {
  data() {
    return {
      // 进度条默认激活选项索引
      activeIndex: '0',
      // 添加商品的的表单数据
      addForm: {
        // 商品名称
        goods_name: '',
        // 商品价格
        goods_price: 0,
        // 商品数量
        goods_number: 0,
        // 商品重量
        goods_weight: 0,
        goods_cat: '',
        // 上传图片的保存路径地址
        pics: [],
        // 商品详细描述
        goods_introduce: '',
        // 商品的参数
        attrs: []
      },
      // 添加商品表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },
      // 商品分类数据
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数数据列表
      manyTableData: [],
      // 静态属性数据列表
      onlyTableData: [],
      // 上传图片的地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 显示图片的地址
      picURL: '',
      // 控制预览图片的对话框显示与隐藏
      previewDialogVisible: false
    }
  },

  created() {
    this.getCateList()
  },

  methods: {
    async getCateList() {
      // 获取商品分类数据
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }

      this.cateList = res.data
    },

    // Tab页切换之前的钩子函数
    beforeTabLeave(activeNaem, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },

    // 标签页点击触发
    async tabClicked() {
      // 判断选择的是参数展示
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取参数信息失败')
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        this.onlyTableData = res.data
      }
    },

    // 图片预览的处理函数
    handlePreview(file) {
      this.picURL = file.response.data.url
      this.previewDialogVisible = true
    },

    // 图片移除的处理函数
    handleRemove(file) {
      // 1、获取图片存储的临时路径
      const filePath = file.response.data.tmp_path
      // 2、从 pics 数组中，找到对应的索引值
      const i = this.addForm.pics.findIndex(item => item.pic === filePath)
      // 3、调用数组的 splice 方法，把图片信息对象删除
      this.addForm.pics.splice(i, 1)
    },

    // 图片上传成功的钩子函数
    handleSuccess(response) {
      // 1.拼接图片信息
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 2.将图片信息push到pic数组中
      this.addForm.pics.push(picInfo)
    },

    // 点击按钮添加商品
    addStore() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项！')
        // 发送请求前：需对提交的表单进行处理goods_cat attrs
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        // 以上写法不对：级联选择器绑定的对象goods_cat要求是数组对象
        // 解决办法: 包：lodash 方法（深拷贝）：cloneDeep(boj)

        // 将this.addForm进行深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // 发起请求添加商品
        // 商品名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }

        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
      })
    }
  },

  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.previewImg {
  width: 100%;
  height: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>

<!--
* @description 
* @fileName Welcome.vue
* @author YDKD
* @date 2020/06/21 13:42:48
!-->
<template>
  <div>
    <!-- 系统简介 -->
    <div class="shop_desc">
        <p class="sd_fir">打造高端的</p>
        <p class="sd_secd">电商后台管理系统</p>
        <p class="sd_thre">订单管理、商品管理、数据统计、权限管理</p>
    </div>
    <!-- 功能图展示 -->
    <div>
      <img src="../assets/shop_func.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  created() {},

  methods: {}
}
</script>
<style lang="less" scoped>
.shop_desc {
    text-align: center;
    color: lightseagreen;
}
.sd_fir {
  font-size: 16px;
}
.sd_secd {
  font-size: 24px;
}
.sd_thre {
  font-size: 14px;
}
img {
  max-width: 1920px;
}
</style>

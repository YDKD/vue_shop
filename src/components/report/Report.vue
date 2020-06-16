<!--
* @description 
* @fileName Report.vue
* @author YDKD
* @date 2020/06/15 16:19:33
!-->
<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图部分 -->
    <el-card>
      <baidu-map
        :center="center"
        :zoom="zoom"
        @ready="handler"
        style="height:1080px"
        @click="getClickInfo"
        :scroll-wheel-zoom="true"
        class="map"
      >
        <!-- 显示缩放比例 -->
        <!--<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>-->
        <!-- 显示地图类型 -->
        <bm-map-type
          :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
          anchor="BMAP_ANCHOR_TOP_LEFT"
        ></bm-map-type>
        <!-- 获取当前定位 -->>
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :showAddressBar="true"
          :autoLocation="true"
        ></bm-geolocation>
        <!-- 城市列表 -->
        <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
        <!-- 全景地图 -->
        <bm-panorama></bm-panorama>
      </baidu-map>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TestBaiDu',
  data() {
    return {
      // 中心位置
      center: { lng: 106.123951, lat: 30.84652 },
      // 缩放等级
      zoom: 14
    }
  },
  methods: {
    handler({ BMap, map }) {
      var point = new BMap.Point(106.123951, 30.84652)
      map.centerAndZoom(point, 16)
      var marker = new BMap.Marker(point) // 创建标注
      map.addOverlay(marker) // 将标注添加到地图中
      var circle = new BMap.Circle(point, 1, {
        strokeColor: 'Red',
        strokeWeight: 6,
        strokeOpacity: 0.8,
        Color: 'Red',
        fillColor: '#f03'
      })
      map.addOverlay(circle)
    },
    getClickInfo(e) {
      console.log(e.point.lng)
      console.log(e.point.lat)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    }
  }
}
</script>
<style lang="less" scoped>
.map {
  width: 100%;
  height: 800px !important;
}
</style>

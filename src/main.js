import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
Vue.config.productionTip = false
    // 导入 字体图片文件样式
import './assets/font/iconfont.css'
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
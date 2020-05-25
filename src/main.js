import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

// 导入 字体图片文件样式
import './assets/font/iconfont.css'

// 导入 Tree 表格
import TreeTable from 'vue-table-with-tree-grid'

// 配置axios
import axios from 'axios'

// 注册table插件
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置请求拦截器,目的：其他权限请求时，需要先判断
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须返回 config
    return config
})
Vue.prototype.$http = axios
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

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

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 配置axios
import axios from 'axios'

// 导入百度地图
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
    ak: 'BdyaLR50D1ydGtzQ0Weis2g8piGxGk61'
})

// 注册table插件
Vue.component('tree-table', TreeTable)

// 注册富文本编辑器
Vue.use(VueQuillEditor)

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 配置请求拦截器,目的：其他权限请求时，需要先判断
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须返回 config
    return config
})

// 配置全局的时间过滤器
Vue.filter('dateFormat', function (origin) {
    const dt = new Date(origin)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + 1 + '').padStart(2, '0')

    const hh = (dt.getHours() + 1 + '').padStart(2, '0')
    const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
    const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.prototype.$http = axios
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

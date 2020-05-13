import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

// 导入 字体图片文件样式
import './assets/font/iconfont.css'

// 配置axios
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

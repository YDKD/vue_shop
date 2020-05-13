import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        { path: '/home', component: Home }
    ]
})

// 在暴露 router之前，需要挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径来
    // next 是一个函数，表示放行
    // next() 放行  next('/login') 强制跳转到 login 组件
    // 如何默认是访问登录页面，直接放行
    if (to.path === '/login') return next()
    // 不访问登录页，首先拿到token
    const tokenStr = window.sessionStorage.getItem('token')
    // 判断 token是否存在，不存在，则跳转到登录
    if (!tokenStr) return next('/login')
    // 存在，则放行
    next()
})
export default router

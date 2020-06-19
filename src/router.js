import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from './components/Login.vue'
const Login = () => import(/* webpackchunckName: "login_home_welcome" */ './components/Login.vue')
// import Home from './components/Home.vue'
const Home = () => import(/* webpackchunckName: "login_home_welcome" */ './components/Home.vue')
// import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackchunckName: "login_home_welcome" */ './components/Welcome.vue')

// import Users from './components/users/Users.vue'
const Users = () => import(/* webpackchunckName: "Users_Rights_Roles" */ './components/users/Users.vue')
// import Rights from './components/power/Rights.vue'
const Rights = () => import(/* webpackchunckName: "Users_Rights_Roles" */ './components/power/Rights.vue')
// import Roles from './components/power/Roles.vue'
const Roles = () => import(/* webpackchunckName: "Users_Rights_Roles" */ './components/power/Roles.vue')

// import Cate from './components/goods/Cate.vue'
const Cate = () => import(/* webpackchunckName: "Cate_Params" */ './components/goods/Cate.vue')
// import Params from './components/goods/Params.vue'
const Params = () => import(/* webpackchunckName: "Cate_Params" */ './components/goods/Params.vue')

// import List from './components/goods/List.vue'
const List = () => import(/* webpackchunckName: "List_Add" */ './components/goods/List.vue')
// import Add from './components/goods/Add.vue'
const Add = () => import(/* webpackchunckName: "List_Add" */ './components/goods/Add.vue')

// import Order from './components/order/Order.vue'
const Order = () => import(/* webpackchunckName: "Order_Report" */ './components/order/Order.vue')
// import Report from './components/report/Report.vue'
const Report = () => import(/* webpackchunckName: "Order_Report" */ './components/report/Report.vue')
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Cate },
                { path: '/params', component: Params },
                { path: '/goods', component: List },
                { path: '/goods/add', component: Add },
                { path: '/orders', component: Order },
                { path: '/reports', component: Report }
            ]
        }
    ]
})

// 避免路由重复点击
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
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

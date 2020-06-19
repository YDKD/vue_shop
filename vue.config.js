module.exports = {
    chainWebpack: config => {
        // 判断开发模式，来选择不同打包的文件入口
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/man-prod.js')
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}

import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
    // 将message全局挂载到vue中，这样在每个组件中就能通过 this.$message 去使用
Vue.prototype.$message = Message

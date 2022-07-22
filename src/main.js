import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import  ElementPlus  from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/dist/index.css'
import * as icons from '@element-plus/icons-vue'


const app = createApp(App)
app.use(router).use(ElementPlus,{locale}).mount('#app')

Object.keys(icons).forEach((key) => {
    app.component(key, icons[key])
})

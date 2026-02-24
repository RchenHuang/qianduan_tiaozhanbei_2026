import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 全局样式
import './shared/styles/global.scss'

// 移动端视口修复
import { initViewportFix } from './shared/utils/viewport'

// 开发环境调试工具
if (process.env.NODE_ENV === 'development') {
  import('./shared/utils/device.js')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 初始化视口修复
initViewportFix()

app.mount('#app')

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"

import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
import 'vant/lib/index.css'
import "@/assets/css/vant.less"
import "@/assets/css/table.less"
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import { createPinia } from "pinia"

import { VxeUI } from 'vxe-table'

VxeUI.setConfig({
  table: {
    emptyText: "暂无数据"
  }
})

const app = createApp(App)
app.use(router)
app.use(VXETable)
app.use(createPinia())
app.mount('#app')

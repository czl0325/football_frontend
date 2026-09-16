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
import { createPinia } from "pinia"

import VxeUIBase from 'vxe-pc-ui'
import 'vxe-pc-ui/es/style.css'

import VxeUITable from 'vxe-table'
import 'vxe-table/es/style.css'

VxeUIBase.setConfig({
  table: {
    emptyText: "暂无数据"
  }
})

const app = createApp(App)
app.use(router)
app.use(VxeUIBase).use(VxeUITable)
app.use(createPinia())
app.mount('#app')

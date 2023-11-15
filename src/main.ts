import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"

import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
import { createPinia } from "pinia"

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')

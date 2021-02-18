import { createApp } from 'vue'
import App from './App.vue'
import format from './lib/date-format'
import './registerServiceWorker'

const app = createApp(App)
app.config.globalProperties.$formatDate = format
app.mount('#app')

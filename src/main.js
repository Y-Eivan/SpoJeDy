import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const savedTheme = localStorage.getItem('spojedy-theme') || 'light'
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
}

const app = createApp(App)
app.use(router)
app.mount('#app')

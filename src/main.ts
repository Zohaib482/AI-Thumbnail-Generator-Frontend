import { createApp } from 'vue'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(Vue3Toastify, {
  position: 'top-right',
  autoClose: 5000,
  theme: 'dark',
  transition: 'slide',
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
})

app.mount('#app')

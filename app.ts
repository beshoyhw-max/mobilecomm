import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './tailwind.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('./pages/home/index.vue')
    },
    {
      path: '/expert',
      component: () => import('./pages/expert/index.vue')
    }
  ]
})
app.use(router)
app.mount('#app')
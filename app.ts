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
      redirect: '/pages/home'
    },
    {
      path: '/pages/home',
      component: () => import('./pages/home/index.vue')
    },
    {
      path: '/pages/about',
      component: () => import('./pages/about/index.vue')
    }
  ]
})
app.use(router)
app.mount('#app')

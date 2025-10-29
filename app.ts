import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './tailwind.css'
import Expert from './expert.vue'
import PostDetails from './PostDetails.vue'

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
      component: Expert
    },
    {
      path: '/post/:postId/:postType',
      component: PostDetails
    }
  ]
})
app.use(router)
app.mount('#app')

<template>
  <div class="bg-white min-h-screen font-sans">
    <!-- Header -->
    <header class="p-4 flex justify-between items-center">
      <h1 class="text-lg font-bold">expert community</h1>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </header>

    <!-- Search Bar -->
    <div class="p-4">
      <div class="relative">
        <input type="text" placeholder="搜索专家、技能或主题" class="w-full bg-gray-100 border-none rounded-full px-10 py-2 focus:outline-none" />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Post List -->
    <main>
      <div class="px-4 pb-20">
        <div class="border-t border-gray-100" v-for="post in posts" :key="post.id">
          <div class="py-4">
            <div class="flex items-center mb-2">
              <img :src="post.author.avatar" class="h-8 w-8 rounded-full mr-3" />
              <div>
                <p class="font-bold text-sm">{{ post.author.name }} <span class="text-gray-500 font-normal">({{ post.author.id }})</span></p>
              </div>
              <span class="text-gray-400 text-xs ml-auto">{{ post.date }} 发布</span>
            </div>
            <h2 class="font-bold text-lg mb-2">{{ post.title }}</h2>
            <div class="flex space-x-2 mb-4">
              <span v-for="tag in post.tags" :key="tag" class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">{{ tag }}</span>
            </div>
            <div class="flex items-center text-gray-500">
              <p class="text-sm">{{ post.author.name }}</p>
              <div class="flex items-center ml-auto space-x-4 text-sm">
                <div class="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.026a2 2 0 01-1.789-2.894l3.5-7A2 2 0 0114 10zM4 10v11" /></svg>
                  <span>{{ post.likes }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  <span>{{ post.comments }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <span>{{ post.views }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const posts = ref([
  {
    id: 1,
    author: {
      name: '晋红',
      id: '00578932',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    date: '2025-08-05',
    title: 'Qwen3-Next-80B-A3B 分析总结 (混合Gated Attention)...查看更多',
    tags: ['#心理健康', '#健康', '#数字时代'],
    likes: 123,
    comments: 123,
    views: 123
  },
  {
    id: 2,
    author: {
      name: '晋红',
      id: '00578932',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    date: '2025-08-05',
    title: 'Qwen3-Next-80B-A3B 分析总结 (混合Gated Attention)...查看更多',
    tags: ['#心理健康', '#健康', '#数字时代'],
    likes: 123,
    comments: 123,
    views: 123
  },
  {
    id: 3,
    author: {
      name: '晋红',
      id: '00578932',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    date: '2025-08-05',
    title: 'Qwen3-Next-80B-A3B 分析总结 (混合Gated Attention)...查看更多',
    tags: ['#心理健康', '#健康', '#数字时代'],
    likes: 123,
    comments: 123,
    views: 123
  },
    {
    id: 4,
    author: {
      name: '晋红',
      id: '00578932',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    date: '2025-08-05',
    title: 'Qwen3-Next-80B-A3B 分析总结 (混合Gated Attention)...查看更多',
    tags: ['#心理健康', '#健康', '#数字时代'],
    likes: 123,
    comments: 123,
    views: 123
  }
])
</script>
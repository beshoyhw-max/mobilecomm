<template>
  <div class="font-sans bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="p-4 flex justify-between items-center bg-white">
      <h1 class="text-xl font-bold text-gray-800">社区</h1>
      <div class="flex items-center space-x-4">
        <button @click="navigateToCreatePost">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Search Bar -->
    <div class="p-4 bg-white">
      <div class="relative">
        <input
          type="text"
          placeholder="搜索帖子"
          class="w-full bg-gray-100 border-none rounded-full px-10 py-2 focus:outline-none"
          v-model="searchQuery"
          @keydown.enter="searchPosts"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white">
      <nav class="flex space-x-4 px-4">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.name"
          @click="selectTab(index)"
          :class="['py-2 px-1 text-sm font-semibold', activeTab === index ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500']"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Post List -->
    <main class="p-4">
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
      <div v-else>
        <div v-if="posts.length === 0" class="text-center text-gray-500 mt-8">
          没有找到相关的帖子
        </div>
        <div v-else class="space-y-4">
          <div v-for="post in posts" :key="post.postId" @click="navigateToPost(post.postId, post.postType)" class="bg-white rounded-lg shadow p-4">
            <div class="flex items-center mb-2">
              <img src="https://via.placeholder.com/40" alt="avatar" class="w-10 h-10 rounded-full mr-3">
              <div>
                <p class="font-semibold">{{ post.creatorUserCn }}</p>
                <p class="text-sm text-gray-500">{{ post.creatorDept }}</p>
              </div>
            </div>
            <h2 class="font-bold text-lg mb-2">{{ post.postTitle }}</h2>
            <div class="text-gray-600 text-sm mb-4" v-html="post.postDetails.substring(0, 100) + '...'"></div>
            <div class="flex justify-between items-center text-sm text-gray-500">
              <div class="flex space-x-4">
                <span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>{{ post.views }}</span>
                <span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>{{ post.comments }}</span>
                <span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21H9.42a2 2 0 01-1.92-2.618l2.34-6.438A2 2 0 0112.22 10H14zM4 21V10a2 2 0 012-2h1" /></svg>{{ post.likes }}</span>
              </div>
              <div class="flex space-x-2">
                <span v-for="tag in JSON.parse(post.postTags || '[]')" :key="tag" class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">#{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

interface Post {
  postId: number;
  creatorUserCn: string;
  creatorDept: string;
  postTitle: string;
  postDetails: string;
  views: number;
  likes: number;
  comments: number;
  postTags: string;
  postType: string;
}

const router = useRouter();
const searchQuery = ref('');
const activeTab = ref(0);
const posts = ref<Post[]>([]);
const isLoading = ref(false);

const tabs = [
  { name: '综合推荐', payload: { "status": "1" } },
  { name: '答疑解惑', payload: { "status": "1", "postType": 1 } },
  { name: '技术交流', payload: { "status": "1", "postType": 2 } },
  { name: '悬赏', payload: { "status": "1", "postType": 3 } },
  { name: '我的', payload: { "status": "1", "creatorUserCn": "YOUR_USER_CN_HERE" } }, // Placeholder
];

const loadPosts = async () => {
  isLoading.value = true;
  posts.value = [];
  try {
    const payload = tabs[activeTab.value].payload;
    const response = await fetch('/posts/findList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    posts.value = data;
  } catch (error) {
    console.error('Failed to load posts:', error);
  } finally {
    isLoading.value = false;
  }
};

const searchPosts = async () => {
    if (!searchQuery.value.trim()) {
        loadPosts();
        return;
    }
    isLoading.value = true;
    posts.value = [];
    try {
        const payload = {
            "OPER_OR_": [
                { "postTitle": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } },
                { "postDetails": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } }
            ],
            "status": "1"
        };
        const response = await fetch('/posts/findList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to search posts');
        posts.value = await response.json();
    } catch (error) {
        console.error('Error searching posts:', error);
    } finally {
        isLoading.value = false;
    }
};

const selectTab = (index: number) => {
  activeTab.value = index;
  searchQuery.value = ''; // Clear search when changing tabs
  loadPosts();
};

const navigateToPost = (postId: number, postType: string) => {
  router.push(`/post/${postId}/${postType}`);
};

const navigateToCreatePost = () => {
  router.push('/create-post');
};

onMounted(() => {
  loadPosts();
});
</script>

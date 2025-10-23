<template>
  <div class="bg-white min-h-screen font-sans">
    <!-- Header -->
    <header class="p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Expert Community</h1>
    </header>

    <!-- Search Bar -->
    <div class="p-4">
      <div class="relative">
        <input 
          type="text" 
          placeholder="Search for expert" 
          class="w-full bg-gray-100 border-none rounded-full px-10 py-2 focus:outline-none"
          v-model="searchQuery"
          @keydown.enter="loadExperts"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Filters -->
    <div class="px-4 pb-4 flex space-x-2 overflow-x-auto">
      <button 
        @click="selectCategory('')"
        :class="['px-4 py-1 rounded-full text-sm', selectedCategory === '' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500']"
      >
        全部
      </button>
      <button 
        v-for="category in categories" 
        :key="category" 
        @click="selectCategory(category)"
        :class="['px-4 py-1 rounded-full text-sm whitespace-nowrap', selectedCategory === category ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500']"
      >
        {{ category }}
      </button>
    </div>
    


    <!-- Expert List -->
    <main>
      <div class="px-4 pb-20">
        <div class="bg-white rounded-lg shadow-md p-4 mb-4" v-for="expert in experts" :key="expert.expertsTableId">
          <div class="flex items-center mb-4">
            <img :src="expert.expertPic" class="h-16 w-16 rounded-full mr-4" />
            <div class="flex-grow">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-bold">{{ expert.expertUserCn }}</p>
                  <p class="text-gray-500 text-sm">{{ expert.expertPos }}   {{ expert.expertDept }} </p>

                  <p class="text-gray-500 text-sm"></p>
                </div>
                <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">{{ expert.expertCategory }}</span>
                <button @click="handleClick(expert.expertUserId)" class="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </button>
              </div>
            </div>
          </div>
          <div>
            <p class="font-bold text-sm">IT qualification</p>
            <p class="text-gray-500 text-sm">擅长领域: {{ expert.expertStr }}</p>
          </div>
        </div>
        <div v-if="!isLoading && experts.length === 0" class="text-center text-gray-500 mt-8">
          No experts found.
        </div>
      </div>
    </main>
  </div>
  
  <!-- Loading Overlay -->
  <div v-if="isLoading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const API_URL = 'community/expertfindlist';

interface Expert {
  expertsTableId: number;
  expertUserCn: string;
  expertDept: string;
  expertPos: string;
  expertCategory: string;
  expertStr: string;
  expertPic: string;
  expertUserId: string;
}

const searchQuery = ref('');
const selectedCategory = ref('');
const experts = ref<Expert[]>([]);
const categories = ['普惠安全', '普惠教育', '普惠连接','普惠政务', '普惠能源', '云智OS' , '云与算力'];
const isLoading = ref(false);


const loadExperts = async () => {
  isLoading.value = true;
  let body = {};

  if (searchQuery.value && selectedCategory.value) {
    body = {
      "OPER_OR_": [
        { "expertCq1": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } },
        { "expertPos": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } },
        { "expertStr": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } },
        { "expertCq2": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } },
        { "expertDept": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } },
        { "expertUserCn": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } }
      ],
      "expertCategory": selectedCategory.value
    };
  } else if (searchQuery.value) {
    body = {
      "OPER_OR_": [
        { "expertCq1": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } },
        { "expertCq2": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } },
        { "expertPos": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } },
        { "expertStr": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } },
        { "expertDept": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } },
        { "expertUserCn": { "OPERATOR": "LIKE", "OPERAND": `%${searchQuery.value}%` } }
      ]
    };
  } else if (selectedCategory.value) {
    body = {
      "expertCategory": selectedCategory.value
    };
  }
  console.log("--- DEBUGGING loadExperts ---");
  console.log("Selected Category:", selectedCategory.value);
  console.log("Search Query:", searchQuery.value);
  console.log("Final Body Object to be sent:", body);

  try {
  
    const response = await fetch(API_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    console.log(response , 'here is my response')
    const data = await response.json();
    experts.value = data;
  } catch (error) {
    console.log('Error fetching experts:', error);
    experts.value = [];
  } finally {
    isLoading.value = false;
  }
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
  loadExperts();
};

const handleClick = (expertUserId) => {
    console.log(`Button clicked for expert with ID: ${expertUserId}`);
    const lowerCaseUserId = expertUserId.toLowerCase();

 
};
onMounted(() => {
  loadExperts();
});
</script>
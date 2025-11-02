<template>
  <div class="font-sans bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="p-4 flex items-center bg-white border-b">
      <button @click="$router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-xl font-semibold ml-4">创建帖子</h1>
      <div class="ml-auto flex items-center">
        <label class="text-sm font-semibold text-gray-700 mr-2">匿名发布</label>
        <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" v-model="post.isAnonymous" name="toggle" id="header-toggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label for="header-toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
        </div>
        <button @click="submitPost" class="bg-red-500 text-white px-4 py-1 rounded-full text-sm">发布</button>
      </div>
    </header>

    <!-- Form -->
    <main class="p-4 space-y-6">
      <!-- Title -->
      <div class="bg-white p-4 rounded-lg">
        <label class="text-sm font-semibold text-gray-700 block mb-2"><span class="text-red-500 mr-1">*</span>标题</label>
        <textarea v-model="post.title" class="w-full border-none focus:ring-0 p-2" placeholder="请输入论坛标题" rows="3" maxlength="200"></textarea>
        <p class="text-right text-xs text-gray-400">{{ post.title.length }}/200</p>
      </div>

      <!-- Details -->
      <div class="bg-white p-4 rounded-lg">
        <label class="text-sm font-semibold text-gray-700 block mb-2"><span class="text-red-500 mr-1">*</span>详情</label>
        <textarea v-model="post.details" class="w-full border-none focus:ring-0 p-2" placeholder="请输入论坛详情" rows="6" maxlength="2000"></textarea>
        <p class="text-right text-xs text-gray-400">{{ post.details.length }}/2000</p>
      </div>

      <!-- Custom Tags -->
      <div class="bg-white p-4 rounded-lg">
        <label class="text-sm font-semibold text-gray-700 block mb-2">自定义标签</label>
        <input type="text" v-model="newTag" @keydown.enter="addTag" class="w-full border-none focus:ring-0 p-2" placeholder="请输入工号或姓名后回车">
        <div class="mt-2 flex flex-wrap gap-2">
          <span v-for="tag in suggestedTags" :key="tag" @click="addTag(tag)" class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm cursor-pointer">{{ tag }}</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-2">
            <span v-for="(tag, index) in post.customTags" :key="index" class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center">
              {{ tag }}
              <button @click="removeTag(index)" class="ml-2 text-blue-800">&times;</button>
            </span>
        </div>
      </div>

      <!-- Post Type -->
      <div class="bg-white p-4 rounded-lg">
        <div @click="toggleDropdown('postType')" class="flex justify-between items-center cursor-pointer">
          <label class="text-sm font-semibold text-gray-700">Post type: {{ postTypes.find(t => t.id === post.postTypeId)?.name }}</label>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </div>
        <div v-if="dropdowns.postType" class="mt-2 space-y-2">
          <button v-for="type in postTypes" :key="type.id" @click="selectPostType(type.id)" class="w-full text-left bg-gray-100 p-2 rounded-lg">{{ type.name }}</button>
        </div>
      </div>

      <!-- Post Category & Experts -->
      <div class="bg-white p-4 rounded-lg space-y-4">
        <div @click="toggleDropdown('category')" class="cursor-pointer">
          <label class="text-sm font-semibold text-gray-700 block mb-2"><span class="text-red-500 mr-1">*</span>所属领域</label>
          <div class="border rounded-lg p-2 min-h-[40px] flex flex-wrap gap-2 items-center">
            <span v-for="(category, index) in post.categories" :key="index" class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center">
              {{ category }}
              <button @click.stop="removeCategory(index)" class="ml-2 text-blue-800">&times;</button>
            </span>
          </div>
        </div>
        <div v-if="dropdowns.category" class="border rounded-lg p-4">
          <div class="grid grid-cols-2 gap-4">
            <label v-for="cat in allCategories" :key="cat" class="flex items-center">
              <input type="checkbox" :value="cat" v-model="post.categories" class="mr-2">{{ cat }}
            </label>
          </div>
        </div>

        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-2">领域专家</label>
          <div v-if="post.categories.length > 0">
            <div v-if="isLoadingExperts" class="text-sm text-gray-500">Loading experts...</div>
            <div v-else class="border rounded-lg p-4 grid grid-cols-2 gap-4">
              <label v-for="expert in availableExperts" :key="expert.expertsTableId" class="flex items-center">
                <input type="checkbox" :value="expert" v-model="post.experts" class="mr-2">{{ expert.expertUserCn }}
              </label>
            </div>
          </div>
           <div v-else class="text-sm text-gray-500">Please select a category to see available experts.</div>
        </div>
      </div>

    </main>
  </div>
</template>

<style>
.toggle-checkbox:checked {
  right: 0;
  border-color: #48bb78;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #48bb78;
}
</style>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Expert {
  expertsTableId: number;
  expertUserCn: string;
  expertUserId: string;
}

const post = reactive({
  title: '',
  details: '',
  customTags: [],
  postTypeId: 1,
  categories: [],
  experts: [] as Expert[],
  isAnonymous: false
});

const newTag = ref('');
const suggestedTags = ref(['Ai', '业务优化']);
const postTypes = [
  { id: 1, name: '自由讨论' },
  { id: 2, name: '专业分享' },
  { id: 3, name: '答疑解惑' }
];
const allCategories = ['普惠安全', '普惠教育', '普惠链接', '普惠政务', '普惠能源', '云智OS', '云与算力'];
const availableExperts = ref<Expert[]>([]);
const isLoadingExperts = ref(false);

const dropdowns = reactive({
  postType: false,
  category: false
});

const toggleDropdown = (type) => {
  dropdowns[type] = !dropdowns[type];
};

const selectPostType = (id: number) => {
  post.postTypeId = id;
  dropdowns.postType = false;
};

const addTag = (tag) => {
    const input = typeof tag === 'string' ? tag : newTag.value;
    const tags = input.split(/[,;]/).map(t => t.trim()).filter(t => t);

    tags.forEach(t => {
        if (!post.customTags.includes(t)) {
            post.customTags.push(t);
        }
    });

    newTag.value = '';
};

const removeTag = (index) => {
  post.customTags.splice(index, 1);
};

const removeCategory = (index) => {
  post.categories.splice(index, 1);
};

const getUserInfo = () => {
  // Your logic to get the user info goes here
  return {
    creatorDept: "IT",
    userCn: "BE7597",
    creatorUserCn: "BE7597"
  };
};

const submitPost = async () => {
    const userInfo = getUserInfo();
    const taggedUsers = post.experts.map(expert => expert.expertUserId);
    const payload = {
        postCategory: JSON.stringify(post.categories),
        comments: 0,
        postTags: JSON.stringify(post.customTags),
        taggedUsers: JSON.stringify(taggedUsers),
        isAnonymous: post.isAnonymous ? "1" : "0",
        postTitle: post.title,
        views: 0,
        postDetails: `<p>${post.details}</p>`,
        status: "1",
        likes: 0,
        creatorUserCn: userInfo.creatorUserCn,
        creatorDept: userInfo.creatorDept,
        postType: post.postTypeId,
        userCn: userInfo.userCn
    };

    try {
        const response = await fetch('https://lightapp.starling.huawei.com/NA_Market/services/api/dynamic/posts/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Post created successfully:', result);
        router.push('/home');

    } catch (error) {
        console.error('Failed to create post:', error);
    }
};

const fetchExperts = async () => {
    if (post.categories.length === 0) {
        availableExperts.value = [];
        post.experts = [];
        return;
    }
    isLoadingExperts.value = true;
    try {
        const expertPromises = post.categories.map(category =>
            fetch('/expertsTable/findList', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expertCategory: category })
            }).then(res => res.json())
        );
        const results = await Promise.all(expertPromises);
        const allExperts = results.flat() as Expert[];

        const uniqueExperts = allExperts.filter((expert, index, self) =>
            index === self.findIndex((e) => e.expertsTableId === expert.expertsTableId)
        );
        availableExperts.value = uniqueExperts;
        post.experts = [...uniqueExperts]; // Automatically select all fetched experts

    } catch (error) {
        console.error("Failed to fetch experts:", error);
        availableExperts.value = [];
    } finally {
        isLoadingExperts.value = false;
    }
};

watch(() => [...post.categories], async (newCategories, oldCategories) => {
    isLoadingExperts.value = true;

    // Determine added or removed categories
    const addedCategories = newCategories.filter(c => !oldCategories.includes(c));
    const removedCategories = oldCategories.filter(c => !newCategories.includes(c));

    try {
        // Fetch experts for new categories
        if (addedCategories.length > 0) {
            const expertPromises = addedCategories.map(category =>
                fetch('/expertsTable/findList', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ expertCategory: category })
                }).then(res => res.json())
            );
            const results = await Promise.all(expertPromises);
            const newExperts = results.flat() as Expert[];

            // Add new experts to available list (no duplicates)
            newExperts.forEach(expert => {
                if (!availableExperts.value.some(e => e.expertsTableId === expert.expertsTableId)) {
                    availableExperts.value.push(expert);
                }
            });

            // Add new experts to selected list (no duplicates)
             newExperts.forEach(expert => {
                if (!post.experts.some(e => e.expertsTableId === expert.expertsTableId)) {
                    post.experts.push(expert);
                }
            });
        }

        // Remove experts from categories that were deselected
        if (removedCategories.length > 0) {
            // This part is complex without knowing which expert belongs to which category.
            // A simpler approach for now is to refetch all experts for the current categories.
            const currentCategoriesPromises = newCategories.map(category =>
                 fetch('/expertsTable/findList', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ expertCategory: category })
                }).then(res => res.json())
            );
            const results = await Promise.all(currentCategoriesPromises);
            const currentExperts = results.flat() as Expert[];
            const currentExpertIds = new Set(currentExperts.map(e => e.expertsTableId));

            availableExperts.value = availableExperts.value.filter(e => currentExpertIds.has(e.expertsTableId));
            post.experts = post.experts.filter(e => currentExpertIds.has(e.expertsTableId));
        }

    } catch (error) {
        console.error("Failed to fetch experts:", error);
    } finally {
        isLoadingExperts.value = false;
    }

}, { deep: true });

</script>

<template>
  <div class="font-sans bg-white min-h-screen" v-if="post">
    <!-- Header -->
    <header class="p-4 flex items-center border-b">
      <button @click="$router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span class="ml-4 font-semibold">返回</span>
    </header>

    <!-- Post Content -->
    <main class="p-4">
      <div class="mb-4">
        <div class="flex items-center mb-2">
          <img src="https://via.placeholder.com/40" alt="avatar" class="w-10 h-10 rounded-full mr-3">
          <div>
            <p class="font-semibold">{{ post.creatorUserCn }}</p>
            <p class="text-sm text-gray-500">{{ new Date(post.createdDt).toLocaleDateString() }}</p>
          </div>
          <div class="ml-auto flex items-center text-sm text-gray-500 space-x-4">
            <span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3_0 11-6 0 3 3_0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> {{ post.views }}</span>
            <span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863_0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> {{ post.comments }}</span>
            <button @click="toggleLike" class="flex items-center" :class="{ 'text-red-500': isLiked }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21H9.42a2 2 0 01-1.92-2.618l2.34-6.438A2 2 0 0112.22 10H14zM4 21V10a2 2 0 012-2h1" /></svg> {{ post.likes }}
            </button>
          </div>
        </div>
        <h1 class="text-xl font-bold mb-4">{{ post.postTitle }}</h1>
        <div class="flex space-x-2 mb-4">
          <span v-for="tag in JSON.parse(post.postTags)" :key="tag" class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">#{{ tag }}</span>
        </div>
        <div v-html="post.postDetails"></div>
      </div>

      <!-- Attachments -->
      <div class="my-6" v-if="parsedAttachments.length > 0">
        <h2 class="text-lg font-bold mb-2">附件</h2>
        <ul>
          <li v-for="att in parsedAttachments" :key="att.docId" class="flex items-center mb-2">
            <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
            <span class="text-red-500">{{ att.docName }}</span>
          </li>
        </ul>
      </div>

      <!-- Ratings -->
      <div class="my-6" v-if="post.postType === '1'">
        <div class="flex items-center justify-between">
          <span class="text-gray-700">评价打分:</span>
          <div class="flex items-center">
            <button v-for="i in 5" :key="i" @click="submitRating('postScore', i)" class="text-2xl" :class="i <= (userRating.postScore || 0) ? 'text-yellow-400' : 'text-gray-300'">★</button>
            <span class="ml-2 text-gray-600">{{ userRating.postScore ? userRating.postScore.toFixed(1) : 'N/A' }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between mt-2">
          <span class="text-gray-700">专业性:</span>
          <div class="flex items-center">
            <button v-for="i in 5" :key="i" @click="submitRating('postProfScore', i)" class="text-2xl" :class="i <= (userRating.postProfScore || 0) ? 'text-yellow-400' : 'text-gray-300'">★</button>
            <span class="ml-2 text-gray-600">{{ userRating.postProfScore ? userRating.postProfScore.toFixed(1) : 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">评论({{ post.comments }})</h2>
          <div>
            <button class="text-sm text-red-500 font-semibold">最新</button>
            <button class="text-sm text-gray-500 ml-2">最早</button>
          </div>
        </div>

        <div v-for="comment in nestedComments" :key="comment.commentId" class="mb-4">
          <!-- Parent Comment -->
          <div class="flex items-start">
            <img src="https://via.placeholder.com/32" alt="avatar" class="w-8 h-8 rounded-full mr-3">
            <div class="flex-1">
              <p class="font-semibold">{{ comment.isAnonymous === '1' ? '匿名用户' : comment.creatorUserCn }}</p>
              <div v-html="comment.commentDetails" class="my-1"></div>
              <p class="text-sm text-gray-500">{{ new Date(comment.createdDt).toLocaleString() }}</p>
            </div>
            <button @click="openReplyPopup(comment.commentId)" class="text-sm text-red-500">回复</button>
          </div>

          <!-- Child Comments -->
          <div v-if="comment.children && comment.children.length > 0" class="ml-11 mt-4 bg-gray-50 p-3 rounded-lg">
            <div v-for="child in comment.children" :key="child.commentId" class="flex items-start mb-4 last:mb-0">
              <img src="https://via.placeholder.com/32" alt="avatar" class="w-8 h-8 rounded-full mr-3">
              <div class="flex-1">
                <p>
                  <span class="font-semibold">{{ child.isAnonymous === '1' ? '匿名用户' : child.creatorUserCn }}</span>
                  回复
                  <span class="font-semibold">{{ child.replyingTo }}</span>
                </p>
                <div v-html="child.commentDetails" class="my-1"></div>
                <p class="text-sm text-gray-500">{{ new Date(child.createdDt).toLocaleString() }}</p>
              </div>
              <button @click="openReplyPopup(child.commentId)" class="text-sm text-red-500">回复</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Comment Input -->
    <footer class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
      <input v-model="newCommentText" type="text" placeholder="write a comment" class="w-full bg-gray-100 border-none rounded-lg px-4 py-2 focus:outline-none mb-2">
      <div class="flex justify-between items-center">
        <label class="flex items-center whitespace-nowrap">
          <input type="checkbox" v-model="isCommentAnonymous" class="mr-1">
          匿名发布
        </label>
        <button @click="submitComment('0')" class="bg-red-500 text-white px-6 py-2 rounded-lg">send</button>
      </div>
    </footer>

    <!-- Reply Popup -->
    <div v-if="showReplyPopup" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-4 rounded-lg w-11/12">
        <textarea v-model="replyText" rows="4" class="w-full border rounded-lg p-2" placeholder="Write a reply..."></textarea>
        <div class="mt-4 flex justify-between items-center">
            <label class="flex items-center text-sm">
                <input type="checkbox" v-model="isReplyAnonymous" class="mr-1">
                匿名发布
            </label>
            <div class="flex justify-end">
                <button @click="showReplyPopup = false" class="text-gray-500 mr-4">Cancel</button>
                <button @click="submitComment(replyingToCommentId)" class="bg-red-500 text-white px-4 py-2 rounded-lg">Send</button>
            </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="isLoading" class="flex items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
  <div v-else class="p-4 text-center">
    Failed to load post.
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

// Interfaces
interface PostDetails {
  postId: number;
  createdDt: string;
  creatorUserCn: string;
  creatorDept: string;
  postTitle: string;
  postCategory: string;
  postTags: string;
  isAnonymous: string;
  taggedUsers: string;
  postDetails: string;
  status: string;
  views: number;
  likes: number;
  comments: number;
  attachments: string;
  postType: string;
}

interface PostLike {
  postLikesId: number;
  postId: string;
  creatorUserCn: string;
}

interface PostRate {
  postRateId: number;
  postScore: number | null;
  postProfScore: number | null;
  postId: string;
  creatorUserCn: string;
}

interface Comment {
  commentId: number;
  postId: string;
  commentParentId: string;
  creatorUserCn: string;
  createdDt: string;
  commentDetails: string;
  isAnonymous: string;
  children?: Comment[];
  replyingTo?: string;
}

// State
const route = useRoute();
const post = ref<PostDetails | null>(null);
const isLiked = ref(false);
const isLoading = ref(true);
const userRating = ref<{ postScore: number | null; postProfScore: number | null }>({
  postScore: null,
  postProfScore: null,
});
const comments = ref<Comment[]>([]);
const newCommentText = ref('');
const showReplyPopup = ref(false);
const replyingToCommentId = ref<string | null>(null);
const currentUserCn = ref<string>('');
const isCommentAnonymous = ref(false);
const replyText = ref('');
const isReplyAnonymous = ref(false);

// Generic function for creatorUserCn
function getCreatorUserCn(): string {
  // Your logic to get the creatorUserCn goes here
  return "YOUR_USER_CN_HERE";
}

// Computed
const parsedAttachments = computed(() => {
  if (!post.value?.attachments) return [];
  try {
    const attachments = JSON.parse(post.value.attachments);
    return Array.isArray(attachments) ? attachments : [];
  } catch (error) {
    console.error('Failed to parse attachments JSON:', error);
    return [];
  }
});

const nestedComments = computed(() => {
  const commentMap: { [key: string]: Comment } = {};
  comments.value.forEach(comment => {
    commentMap[comment.commentId] = { ...comment, children: [] };
  });

  const topLevelComments: Comment[] = [];
  comments.value.forEach(comment => {
    if (comment.commentParentId === '0') {
      topLevelComments.push(commentMap[comment.commentId]);
    } else {
      const directParent = commentMap[comment.commentParentId];
      if (directParent) {
        let topLevelParent = directParent;
        while (topLevelParent.commentParentId !== '0') {
          topLevelParent = commentMap[topLevelParent.commentParentId];
        }

        const child = commentMap[comment.commentId];
        child.replyingTo = directParent.isAnonymous === '1' ? '匿名用户' : directParent.creatorUserCn;
        topLevelParent.children?.push(child);
      }
    }
  });

  // Sort children by creation date
  topLevelComments.forEach(comment => {
    comment.children?.sort((a, b) => new Date(a.createdDt).getTime() - new Date(b.createdDt).getTime());
  });

  return topLevelComments;
});

// Functions
const openReplyPopup = (commentId: number) => {
  replyingToCommentId.value = commentId.toString();
  showReplyPopup.value = true;
};

// API Calls
const incrementCommentCount = async () => {
  if (!post.value) return;

  try {
    // 1. Refetch the post to get the latest data
    const response = await fetch('/posts/findOne', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.value.postId.toString() }),
    });
    if (!response.ok) throw new Error('Failed to fetch latest post details');
    const latestPost: PostDetails = await response.json();

    // 2. Update with the incremented comment count
    await fetch('posts/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: post.value.postId.toString(),
        comments: latestPost.comments + 1,
      }),
    });

    // 3. Update local state
    if (post.value) {
      post.value.comments = latestPost.comments + 1;
    }

  } catch (error) {
    console.error('Failed to increment comment count', error);
    if(post.value) {
        await fetchPostDetails(post.value.postId.toString());
    }
  }
};

const incrementViews = async () => {
  if (!post.value) return;
  try {
    await fetch('posts/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: post.value.postId.toString(),
        views: post.value.views + 1,
      }),
    });
  } catch (error) {
    console.error('Failed to increment views', error);
  }
};

const fetchPostDetails = async (postId: string) => {
  try {
    const response = await fetch('/posts/findOne', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    if (!response.ok) throw new Error('Failed to fetch post details');
    post.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

const checkIfLiked = async (postId: string) => {
  try {
    const response = await fetch('/postLikes/findOne', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId,
        creatorUserCN: currentUserCn.value,
      }),
    });
    if (!response.ok) throw new Error('Failed to check like status');
    const likeData: PostLike = await response.json();
    isLiked.value = !!likeData.postLikesId;
  } catch (error) {
    console.error(error);
  }
};

const toggleLike = async () => {
  if (!post.value) return;

  try {
    const response = await fetch('experts/postlike', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.value.postId.toString() }),
    });
    if (!response.ok) throw new Error('Failed to toggle like');

    if (isLiked.value) {
      post.value.likes--;
    } else {
      post.value.likes++;
    }
    isLiked.value = !isLiked.value;
  } catch (error) {
    console.error(error);
  }
};

const fetchUserRating = async (postId: string) => {
  try {
    const response = await fetch('postRate/findOne', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId,
        creatorUserCN: currentUserCn.value,
      }),
    });
    if (!response.ok) throw new Error('Failed to fetch user rating');
    const ratingData: PostRate = await response.json();
    if (ratingData.postRateId) {
      userRating.value.postScore = ratingData.postScore;
      userRating.value.postProfScore = ratingData.postProfScore;
    }
  } catch (error) {
    console.error(error);
  }
};

const submitRating = async (scoreType: 'postScore' | 'postProfScore', score: number) => {
  if (!post.value) return;

  const payload: {
    creatorUserCn: string;
    postId: string;
    postScore?: number;
    postProfScore?: number;
  } = {
    creatorUserCn: currentUserCn.value,
    postId: post.value.postId.toString(),
  };

  if (scoreType === 'postScore') {
    payload.postScore = score;
  } else {
    payload.postProfScore = score;
  }

  try {
    const response = await fetch('experts/postrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (result.resp === '200') {
      if (scoreType === 'postScore') {
        userRating.value.postScore = score;
      } else {
        userRating.value.postProfScore = score;
      }
    }
  } catch (error) {
    console.error('Failed to submit rating', error);
  }
};

const fetchComments = async (postId: string) => {
  try {
    const response = await fetch('/postComments/findList', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    if (!response.ok) throw new Error('Failed to fetch comments');
    comments.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

const submitComment = async (parentId: string | null) => {
  const isReply = parentId !== '0';
  const text = isReply ? replyText.value : newCommentText.value;
  const isAnon = isReply ? isReplyAnonymous.value : isCommentAnonymous.value;

  if (!post.value || !text.trim() || parentId === null) return;

  try {
    const response = await fetch('/postComments/insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commentParentId: parentId,
        postId: post.value.postId.toString(),
        creatorDept: 'IT', // Placeholder
        commentDetails: `<p>${text}</p>`,
        creatorUserCn: currentUserCn.value,
        isAnonymous: isAnon ? '1' : '0',
      }),
    });
    if (!response.ok) throw new Error('Failed to submit comment');

    if (isReply) {
      replyText.value = '';
      isReplyAnonymous.value = false;
    } else {
      newCommentText.value = '';
      isCommentAnonymous.value = false;
    }
    showReplyPopup.value = false;

    await incrementCommentCount();
    if (post.value) {
      await fetchComments(post.value.postId.toString());
    }

  } catch (error) {
    console.error('Failed to submit comment:', error);
  }
};

onMounted(async () => {
  currentUserCn.value = getCreatorUserCn();
  const postId = route.params.postId as string;
  try {
    await fetchPostDetails(postId);
    if (post.value) {
      await Promise.all([
        checkIfLiked(postId),
        fetchUserRating(postId),
        fetchComments(postId),
        incrementViews(),
      ]);
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

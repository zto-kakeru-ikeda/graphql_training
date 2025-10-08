<template>
  <div class="post-detail-page">
    <div v-if="loading" class="loading">Loading post...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    <article v-else-if="result" class="post-detail">
      <header class="post-header">
        <h1>{{ result.post.title }}</h1>
        <div class="meta-row">
          <span v-if="result.post.published" class="badge published">Published</span>
          <span v-else class="badge draft">Draft</span>
        </div>
      </header>

      <div class="author-section">
        <img :src="result.post.author.avatar || 'https://via.placeholder.com/60'" :alt="result.post.author.fullName" class="author-avatar" />
        <div class="author-details">
          <h3>{{ result.post.author.fullName }}</h3>
          <p class="username">@{{ result.post.author.username }}</p>
          <p class="bio">{{ result.post.author.bio }}</p>
        </div>
      </div>

      <div class="post-info">
        <div class="info-item">📅 {{ formatDate(result.post.createdAt) }}</div>
        <div class="info-item">👁️ {{ result.post.viewCount }} views</div>
        <div class="info-item">❤️ {{ result.post.likeCount }} likes</div>
      </div>

      <div v-if="result.post.category" class="category">
        📂 {{ result.post.category.name }}
      </div>

      <div v-if="result.post.tags.length > 0" class="tags">
        <span v-for="tag in result.post.tags" :key="tag.id" class="tag">
          #{{ tag.name }}
        </span>
      </div>

      <div class="post-content" v-html="formatContent(result.post.content)"></div>

      <section class="comments-section">
        <h2>💬 Comments ({{ result.post.comments.length }})</h2>
        
        <div v-if="result.post.comments.length === 0" class="no-comments">
          No comments yet. Be the first to comment!
        </div>

        <div v-else class="comments-list">
          <div v-for="comment in result.post.comments" :key="comment.id" class="comment">
            <img :src="comment.author.avatar || 'https://via.placeholder.com/40'" :alt="comment.author.fullName" class="comment-avatar" />
            <div class="comment-body">
              <div class="comment-header">
                <strong>{{ comment.author.fullName }}</strong>
                <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <p class="comment-content">{{ comment.content }}</p>
              
              <!-- Replies -->
              <div v-if="comment.replies && comment.replies.length > 0" class="replies">
                <div v-for="reply in comment.replies" :key="reply.id" class="reply">
                  <img :src="reply.author.avatar || 'https://via.placeholder.com/30'" :alt="reply.author.fullName" class="reply-avatar" />
                  <div class="reply-body">
                    <div class="reply-header">
                      <strong>{{ reply.author.fullName }}</strong>
                      <span class="reply-date">{{ formatDate(reply.createdAt) }}</span>
                    </div>
                    <p class="reply-content">{{ reply.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="actions">
        <button @click="handleLike" class="btn btn-like" :disabled="likeMutationLoading">
          {{ likeMutationLoading ? 'Liking...' : '❤️ Like this post' }}
        </button>
        <button @click="handleIncrementView" class="btn btn-view" :disabled="viewMutationLoading">
          {{ viewMutationLoading ? 'Recording...' : '👁️ Record View' }}
        </button>
      </div>
    </article>

    <div class="back-link">
      <router-link to="/posts" class="btn">← Back to Posts</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_POST, LIKE_POST, INCREMENT_POST_VIEW } from '../graphql/queries';

const route = useRoute();
const postId = route.params.id as string;

const { result, loading, error, refetch } = useQuery(GET_POST, { id: postId });

const { mutate: likePost, loading: likeMutationLoading } = useMutation(LIKE_POST);
const { mutate: incrementView, loading: viewMutationLoading } = useMutation(INCREMENT_POST_VIEW);

async function handleLike() {
  try {
    // Use author ID 1 as default user for demo
    await likePost({ postId, userId: '1' });
    await refetch();
    alert('Post liked successfully!');
  } catch (err: any) {
    alert('Error liking post: ' + err.message);
  }
}

async function handleIncrementView() {
  try {
    await incrementView({ id: postId });
    await refetch();
  } catch (err: any) {
    alert('Error recording view: ' + err.message);
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatContent(content: string): string {
  return content.replace(/\n/g, '<br>');
}
</script>

<style scoped>
.post-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.post-detail {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-header h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.meta-row {
  margin-bottom: 1.5rem;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

.badge.published {
  background: #2ecc71;
  color: white;
}

.badge.draft {
  background: #95a5a6;
  color: white;
}

.author-section {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details h3 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.username {
  color: #3498db;
  margin: 0 0 0.5rem 0;
}

.bio {
  color: #555;
  margin: 0;
  font-size: 0.95rem;
}

.post-info {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.info-item {
  color: #7f8c8d;
  font-size: 0.95rem;
}

.category {
  display: inline-block;
  background: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tag {
  background: #ecf0f1;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.post-content {
  color: #333;
  line-height: 1.8;
  font-size: 1.05rem;
  margin: 2rem 0;
  padding-top: 2rem;
  border-top: 2px solid #ecf0f1;
}

.comments-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #ecf0f1;
}

.comments-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.no-comments {
  text-align: center;
  color: #7f8c8d;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment {
  display: flex;
  gap: 1rem;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.comment-header strong {
  color: #2c3e50;
}

.comment-date {
  color: #7f8c8d;
  font-size: 0.85rem;
}

.comment-content {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.replies {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid #ecf0f1;
}

.reply {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.reply-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.reply-body {
  flex: 1;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.reply-header strong {
  color: #2c3e50;
  font-size: 0.9rem;
}

.reply-date {
  color: #7f8c8d;
  font-size: 0.8rem;
}

.reply-content {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #ecf0f1;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-like {
  background: #e74c3c;
  color: white;
}

.btn-like:hover:not(:disabled) {
  background: #c0392b;
}

.btn-view {
  background: #3498db;
  color: white;
}

.btn-view:hover:not(:disabled) {
  background: #2980b9;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-link {
  text-align: center;
  margin-top: 2rem;
}

.back-link .btn {
  background: #95a5a6;
  color: white;
}

.back-link .btn:hover {
  background: #7f8c8d;
}
</style>

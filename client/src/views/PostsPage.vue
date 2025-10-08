<template>
  <div class="posts-page">
    <h1>📝 Posts</h1>
    
    <div class="filters">
      <button @click="showPublished = true" :class="{ active: showPublished }" class="filter-btn">
        Published
      </button>
      <button @click="showPublished = false" :class="{ active: !showPublished }" class="filter-btn">
        All Posts
      </button>
    </div>

    <div v-if="loading" class="loading">Loading posts...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    <div v-else-if="result" class="posts-list">
      <article v-for="post in result.posts" :key="post.id" class="post-card">
        <div class="post-header">
          <h2>
            <router-link :to="`/posts/${post.id}`">{{ post.title }}</router-link>
          </h2>
          <span v-if="post.published" class="badge published">Published</span>
          <span v-else class="badge draft">Draft</span>
        </div>

        <div class="post-meta">
          <img :src="post.author.avatar || 'https://via.placeholder.com/40'" :alt="post.author.fullName" class="author-avatar" />
          <div class="author-info">
            <div class="author-name">{{ post.author.fullName }}</div>
            <div class="post-date">{{ formatDate(post.createdAt) }}</div>
          </div>
        </div>

        <p class="post-excerpt">{{ truncate(post.content, 200) }}</p>

        <div class="post-footer">
          <div class="tags">
            <span v-for="tag in post.tags" :key="tag.id" class="tag">
              #{{ tag.name }}
            </span>
          </div>
          <div class="stats">
            <span>👁️ {{ post.viewCount }}</span>
            <span>❤️ {{ post.likeCount }}</span>
          </div>
        </div>

        <router-link :to="`/posts/${post.id}`" class="read-more">Read more →</router-link>
      </article>
    </div>

    <div class="back-link">
      <router-link to="/" class="btn">← Back to Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_POSTS } from '../graphql/queries';

const showPublished = ref(true);

const { result, loading, error } = useQuery(GET_POSTS, () => ({
  published: showPublished.value,
  limit: 50,
  offset: 0,
}));

function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<style scoped>
.posts-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #3498db;
  background: white;
  color: #3498db;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: #ecf0f1;
}

.filter-btn.active {
  background: #3498db;
  color: white;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.post-header h2 {
  flex: 1;
  margin: 0;
}

.post-header h2 a {
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s;
}

.post-header h2 a:hover {
  color: #3498db;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
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

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 500;
  color: #2c3e50;
}

.post-date {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.post-excerpt {
  color: #555;
  line-height: 1.6;
  margin: 1rem 0;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #ecf0f1;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.stats {
  display: flex;
  gap: 1rem;
  color: #7f8c8d;
}

.read-more {
  display: inline-block;
  margin-top: 1rem;
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.read-more:hover {
  color: #2980b9;
}

.back-link {
  text-align: center;
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: #95a5a6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn:hover {
  background: #7f8c8d;
}
</style>

<template>
  <div class="users-page">
    <h1>👥 Users</h1>
    
    <div v-if="loading" class="loading">Loading users...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    <div v-else-if="result" class="users-grid">
      <div v-for="user in result.users" :key="user.id" class="user-card">
        <img :src="user.avatar || 'https://via.placeholder.com/100'" :alt="user.fullName" class="avatar" />
        <h3>{{ user.fullName }}</h3>
        <p class="username">@{{ user.username }}</p>
        <p class="email">{{ user.email }}</p>
        <p class="bio">{{ user.bio || 'No bio available' }}</p>
        <div class="posts-count">
          📝 {{ user.posts.length }} posts
        </div>
      </div>
    </div>

    <div class="back-link">
      <router-link to="/" class="btn">← Back to Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable';
import { GET_USERS } from '../graphql/queries';

const { result, loading, error } = useQuery(GET_USERS);
</script>

<style scoped>
.users-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #3498db;
}

h3 {
  color: #2c3e50;
  margin: 0.5rem 0;
}

.username {
  color: #3498db;
  font-weight: 500;
  margin: 0.25rem 0;
}

.email {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.bio {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 1rem 0;
  min-height: 3rem;
}

.posts-count {
  background: #ecf0f1;
  padding: 0.5rem;
  border-radius: 6px;
  color: #2c3e50;
  font-weight: 500;
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

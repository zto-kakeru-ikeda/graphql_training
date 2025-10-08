<template>
  <div class="home">
    <h1>📊 GraphQL Server Statistics</h1>
    
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    <div v-else-if="result" class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ result.stats.totalUsers }}</div>
        <div class="stat-label">Total Users</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ result.stats.totalPosts }}</div>
        <div class="stat-label">Total Posts</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ result.stats.totalComments }}</div>
        <div class="stat-label">Total Comments</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ result.stats.totalLikes }}</div>
        <div class="stat-label">Total Likes</div>
      </div>
    </div>

    <div class="nav-section">
      <h2>🚀 Explore</h2>
      <div class="button-group">
        <router-link to="/users" class="btn">View Users</router-link>
        <router-link to="/posts" class="btn">View Posts</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable';
import { GET_STATS } from '../graphql/queries';

const { result, loading, error } = useQuery(GET_STATS);
</script>

<style scoped>
.home {
  max-width: 1200px;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

.nav-section {
  text-align: center;
}

.nav-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn:hover {
  background: #2980b9;
}
</style>

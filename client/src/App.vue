<script setup lang="ts">
import { useAuth } from './composables/useAuth';
import { useRouter } from 'vue-router';

const { currentUser, isAuthenticated, logout } = useAuth();
const router = useRouter();

function handleLogout() {
  logout();
  alert('ログアウトしました');
  router.push('/login');
}
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="logo">🚀 GraphQL Demo</router-link>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link to="/users">Users</router-link>
          <router-link to="/posts">Posts</router-link>
        </div>
        <div class="nav-auth">
          <template v-if="isAuthenticated">
            <div class="user-info">
              <img :src="currentUser?.avatar || 'https://via.placeholder.com/40'" :alt="currentUser?.fullName" class="user-avatar" />
              <span class="user-name">{{ currentUser?.fullName }}</span>
            </div>
            <button @click="handleLogout" class="btn-logout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-login">Login</router-link>
          </template>
        </div>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f7fa;
  color: #2c3e50;
}

#app {
  min-height: 100vh;
}

.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s;
}

.logo:hover {
  color: #2980b9;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-links a:hover {
  color: #3498db;
}

.nav-links a.router-link-active {
  color: #3498db;
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 2px;
  background: #3498db;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
}

.btn-login {
  padding: 0.5rem 1.5rem;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-login:hover {
  background: #2980b9;
}

.btn-logout {
  padding: 0.5rem 1.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c0392b;
}

main {
  padding: 2rem 0;
}
</style>

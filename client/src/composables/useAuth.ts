import { ref, computed } from 'vue';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string | null;
  bio: string | null;
}

const STORAGE_KEY = 'graphql_training_user';

// Reactive state
const currentUser = ref<User | null>(null);

// Load user from localStorage on initialization
const storedUser = localStorage.getItem(STORAGE_KEY);
if (storedUser) {
  try {
    currentUser.value = JSON.parse(storedUser);
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null);

  const login = (user: User) => {
    currentUser.value = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  };

  const logout = () => {
    currentUser.value = null;
    localStorage.removeItem(STORAGE_KEY);
  };

  const getUser = () => {
    return currentUser.value;
  };

  const getUserId = () => {
    return currentUser.value?.id || null;
  };

  return {
    currentUser: computed(() => currentUser.value),
    isAuthenticated,
    login,
    logout,
    getUser,
    getUserId,
  };
}

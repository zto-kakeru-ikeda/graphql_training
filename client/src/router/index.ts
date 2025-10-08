import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import UsersPage from '../views/UsersPage.vue';
import PostsPage from '../views/PostsPage.vue';
import PostDetailPage from '../views/PostDetailPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersPage,
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostsPage,
  },
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: PostDetailPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

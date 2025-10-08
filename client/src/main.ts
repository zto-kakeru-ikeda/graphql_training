import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setupApollo } from './apollo';

const app = createApp(App);

// Setup Apollo Client
setupApollo(app);

// Setup Router
app.use(router);

app.mount('#app');

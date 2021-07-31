import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import PrimeVue from 'primevue/config';

import '@/styles/main.scss';

createApp(App).use(router).use(PrimeVue).mount('#app');

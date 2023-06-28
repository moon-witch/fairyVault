import './assets/main.scss'
import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
//theme
import "primevue/resources/themes/lara-dark-indigo/theme.css";      
//core
import "primevue/resources/primevue.min.css";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)

app.mount('#app')

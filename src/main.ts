// importations de modules principaux
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// importations de modules secondaires

// feuilles de style
import './css/main.css'

// création de l'application
const app = createApp(App)

// application des modules
app.use(router)

// montage de l'application
app.mount('#app')
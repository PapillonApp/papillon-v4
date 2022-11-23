// importations de modules principaux
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// importations de modules secondaires
import VWave from 'v-wave'
import { vfmPlugin } from 'vue-final-modal'
import LongPress from 'vue3-directive-long-press';

// feuilles de style
import './css/main.css'
import './css/fixes.css'

// création de l'application
const app = createApp(App)

// application des modules
app.use(router)
app.use(vfmPlugin)
app.use(LongPress)
app.use(VWave, {
    duration: 0.2,
    initialOpacity: 0.4,
})

// montage de l'application
app.mount('#app')

// vars
app.config.globalProperties.$currentTab = "";
app.config.globalProperties.$calendarVisible = true;
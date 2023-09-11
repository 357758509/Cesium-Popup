import { createApp } from 'vue'
import App from './App.vue'
// import Boxfunction from './Boxfunction.vue'
import BinDatav from 'bin-datav'
import 'bin-datav/lib/styles/index.css';
const app = createApp(App)
app.use(BinDatav)
app.mount('#app')
// createApp(Boxfunction).mount('#boxfunction')

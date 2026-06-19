import { toast } from 'vue-sonner'
import { createApi } from '@ametie/vue-muza-use'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { authApi } from '@/shared/api'
import App from './App.vue'
import 'vue-sonner/style.css'
import './main.css'
import router from './router'
import { useToast } from '@/shared/composables'

const app = createApp(App)
const { showError } = useToast()

app.use(
  createApi({
    axios: authApi,
    onError: (err) => {
      showError(err)
    },
  }),
)
app.use(createPinia())
app.use(router)

app.mount('#app')

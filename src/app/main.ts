import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from '../i18n'
import { createApi } from '@ametie/vue-muza-use'
import { router } from './router'
import { authApi } from './auth.ts'
import { useToast } from '@/shared/composables'
import App from './App.vue'
import 'vue-sonner/style.css'
import './main.css'

const app = createApp(App)
const { showError } = useToast()

app.use(
  createApi({
    axios: authApi,
    devtools: { enabled: true },
    onError: (err) => {
      showError(err)
    },
    globalOptions: {
      cacheDefaults: {
        swr: true,
        staleTime: '5h',
        freshFor: '1h',
      },
    },
  }),
)
app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')

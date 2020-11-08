import { ref, watch } from 'vue'
import { Auth } from '@/types'

const auth = ref()

function setAuth (to: Auth | null) {
  auth.value = to
}

try {
  const initialAuth = localStorage.getItem('auth')
  if (initialAuth) {
    setAuth(JSON.parse(initialAuth))
  }
} catch (e) {
  // nah
}

watch(auth, (to: Auth) => {
  localStorage.setItem('auth', JSON.stringify(to))
})

export function useAuth () {
  return {
    auth,
    setAuth
  }
}

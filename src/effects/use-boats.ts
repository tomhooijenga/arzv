import { ref } from 'vue'
import { Auth, Boat } from '@/types'
import { getBoats } from '@/lib/arzv'

const boats = ref<Boat[]>([])

async function loadBoats (auth: Auth): Promise<void> {
  boats.value = await getBoats(auth)
}

export function useBoats () {
  return {
    boats,
    loadBoats
  }
}

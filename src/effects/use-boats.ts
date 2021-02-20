import { reactive, ref, watch } from 'vue'
import { Auth, Boat } from '@/types'
import { getBoats } from '@/lib/arzv'

const boats = ref<Boat[]>([])

async function loadBoats (auth: Auth): Promise<void> {
  boats.value = await getBoats(auth)
}

const favorites = reactive<string[]>([])

function toggleFavorite (boat: Boat): void {
  if (isFavorite(boat)) {
    favorites.splice(favorites.indexOf(boat.name), 1)
  } else {
    favorites.push(boat.name)
  }
}

function isFavorite (boat: Boat): boolean {
  return favorites.includes(boat.name)
}

try {
  const initialFavorites = localStorage.getItem('favorites')
  if (initialFavorites) {
    favorites.push(...JSON.parse(initialFavorites))
  }
} catch (e) {
  // nah
}

watch(favorites, (to: string[]) => {
  localStorage.setItem('favorites', JSON.stringify(to))
})

export function useBoats () {
  return {
    boats,
    loadBoats,
    toggleFavorite,
    isFavorite
  }
}

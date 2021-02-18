import { ref } from 'vue'
import { Weather } from '@/types'
import { getWeather } from '@/lib/arzv'

const weather = ref<Weather>()
const showBan = ref(false)

async function loadWeather (): Promise<void> {
  weather.value = await getWeather()
}

async function pollWeather (): Promise<void> {
  setInterval(() => {
    loadWeather()
  }, 10 * 60 * 1000)
}

export function useWeather () {
  return {
    weather,
    showBan,
    loadWeather,
    pollWeather
  }
}

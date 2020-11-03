import { Ref, ref, watch } from 'vue'

export default function<T = any> (key: string): Ref<T> {
  const init = localStorage.getItem(key)
  const variable = ref(init ? JSON.parse(init) : undefined)

  watch(
    () => variable.value,
    to => {
      localStorage.setItem(key, JSON.stringify(to))
    },
    { deep: true }
  )

  return variable
}

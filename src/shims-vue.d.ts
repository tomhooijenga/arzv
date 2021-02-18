declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module 'fuzzysearch' {
  export default function (needle: string, haystack: string): boolean
}

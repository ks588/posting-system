// composables/usePosts.js
import { watch } from 'vue'

export function usePosts() {
  const { data, error, pending, refresh } = useFetch('http://localhost:3000/post', {
    transform: (res) => res.data || []
  })

  watch(data, (newData) => {
    console.log('Fetched posts:', newData)
  })

  return {
    posts: data,
    error,
    pending,
    refresh
  }
}

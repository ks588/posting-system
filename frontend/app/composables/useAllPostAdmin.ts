// composables/usePosts.ts
import { ref } from 'vue'

export const usePosts = () => {
  const posts = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPosts = async () => {
    loading.value = true
    error.value = null

    try {
      const token = sessionStorage.getItem('authtoken')
      const res = await fetch('http://localhost:3000/post', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      if (!res.ok) throw new Error(`Failed to fetch posts: ${res.statusText}`)

      const data = await res.json()
      posts.value = data.data || []
    } catch (err: any) {
      error.value = err.message || 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { posts, loading, error, fetchPosts }
}

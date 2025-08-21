import { computed } from 'vue'
import { useRuntimeConfig, useAsyncData } from '#imports'

export function usePosts() {
  const config = useRuntimeConfig()

  const { data, error, pending, refresh } = useAsyncData('posts', async () => {
    try {
      const res = await fetch(`${config.public.apiBase}/post`)

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.message || `Error: ${res.status}`)
      }

      const json = await res.json()
      return json.data || []
    } catch (err) {
      // Re-throw to let useAsyncData handle it
      throw err
    }
  })

  const posts = computed(() => data.value || [])

  return {
    posts,
    error,
    pending,
    refresh,
  }
}

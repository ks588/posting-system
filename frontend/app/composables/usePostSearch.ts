// composables/usePostSearch.ts
import { ref } from 'vue'

interface SearchHitDocument {
  id: string
  title: string
  description: string
  imageUrl: string
  userId: string
  createdAt: number
}

interface SearchHitHighlight {
  field: string
  matched_tokens: string[]
  snippet: string
  value: string
}

interface SearchHit {
  document: SearchHitDocument
  highlight: {
    title?: SearchHitHighlight
    description?: SearchHitHighlight
  }
  highlights?: SearchHitHighlight[]
}

interface SearchResponseData {
  found: number
  hits: SearchHit[]
  page: number
  per_page?: number
}

export function usePostSearch() {
  const hits = ref<SearchHit[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function searchPosts(query: string) {
    loading.value = true
    error.value = null
    hits.value = []

    try {
      const url = `http://localhost:3000/post/search/?q=${encodeURIComponent(query)}`
      const res = await fetch(url)

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const json = await res.json()

      if (!json.status) {
        throw new Error(json.message || 'API error')
      }

      hits.value = json.data.hits
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  return { hits, loading, error, searchPosts }
}

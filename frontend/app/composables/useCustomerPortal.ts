import { ref } from 'vue'

export function useCustomerPortal() {
  const portalUrl = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPortal(userId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`http://localhost:3000/subscription/portal/${userId}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch portal URL')
      }

      if (data?.data?.url) {
        portalUrl.value = data.data.url
      } else {
        error.value = 'No portal URL returned'
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch portal URL'
    } finally {
      loading.value = false
    }
  }

  return {
    portalUrl,
    loading,
    error,
    fetchPortal,
  }
}

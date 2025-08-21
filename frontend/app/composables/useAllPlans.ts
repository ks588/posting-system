// composables/usePlans.ts
import { ref } from 'vue'
import { useFetch } from '#app'

// Define the Plan type
export interface Plan {
  id: number
  name: string
  stripePriceId: string
  type: 'monthly' | 'yearly'
  maxPosts: number
  priceUsd: number
  description: string
  createdAt: string
  updatedAt: string
}

// API response type
interface PlansResponse {
  status: boolean
  path: string
  message: string
  statusCode: number
  data: Plan[]
  timestamp: string
}

export function usePlans() {
  const plans = ref<Plan[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPlans = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await useFetch<PlansResponse>('http://localhost:3000/plans')

      if (fetchError.value) {
        error.value = fetchError.value.message
      } else if (data.value?.data) {
        plans.value = data.value.data
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    plans,
    loading,
    error,
    fetchPlans,
  }
}

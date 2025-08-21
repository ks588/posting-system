// composables/useSubscriptions.ts
import { ref } from 'vue'
import { $fetch } from 'ofetch'   // ✅ import this

// Define types
interface Plan {
  id: number
  name: string
  type: string
  priceUsd: number
}

interface Subscription {
  id: number
  userId: number
  planId: number
  status: string
  postsUsed: number
  startedAt: string
  expiresAt: string
  planName?: string
  planType?: string
  planPrice?: number
}

export function useSubscriptions() {
  const subscriptions = ref<Subscription[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchSubscriptions = async () => {
    loading.value = true
    error.value = null

    try {
      // Step 1: Fetch subscriptions
      const subRes = await $fetch<{ data: Subscription[] }>('http://localhost:3000/subscription')
      const subs = subRes.data

      // Step 2: Fetch each plan by planId and merge data
      const enrichedSubs = await Promise.all(
        subs.map(async (sub) => {
          try {
            const planRes = await $fetch<{ data: Plan }>(`http://localhost:3000/plans/${sub.planId}`)
            const plan = planRes.data

            return {
              ...sub,
              planName: plan.name,
              planType: plan.type,
              planPrice: plan.priceUsd,
            }
          } catch (planError) {
            console.error(`Failed to fetch plan ${sub.planId}`, planError)
            return { ...sub, planName: 'N/A', planType: 'N/A', planPrice: 0 }
          }
        })
      )

      subscriptions.value = enrichedSubs
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch subscriptions'
    } finally {
      loading.value = false
    }
  }

  return {
    subscriptions,
    loading,
    error,
    fetchSubscriptions,
  }
}

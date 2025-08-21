// composables/useCheckout.ts
import { useFetch } from '#app'

interface CheckoutResponse {
  status: boolean
  path: string
  message: string
  statusCode: number
  data: {
    url: string
  }
  timestamp: string
}

export function useCheckout() {
  const startCheckout = async (planId: number) => {
    try {
      const userId = Number(sessionStorage.getItem('temp_userId'))
      //delete temp_userId after use
      sessionStorage.removeItem('temp_userId')
      if (!userId) throw new Error('User not logged in')

      //explicitly type the response
      const { data, error } = await useFetch<CheckoutResponse>('/stripe/checkout', {
        baseURL: 'http://localhost:3000',
        method: 'POST',
        body: { userId, planId },
      })

      if (error.value) throw error.value

      const checkoutUrl = data.value?.data?.url
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        throw new Error('Stripe checkout URL missing in response')
      }
    } catch (err) {
      console.error('Checkout failed:', err)
    }
  }

  return { startCheckout }
}

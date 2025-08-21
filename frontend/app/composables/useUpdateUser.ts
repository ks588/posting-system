// composables/useUpdateUser.ts
import { ref } from 'vue'

export function useUpdateUser() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateUser = async (id: number, username: string, email: string, role: string) => {
    loading.value = true
    error.value = null

    try {
      const authtoken = sessionStorage.getItem('authtoken')
      const response = await fetch(`http://localhost:3000/user/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authtoken}`

        },
        body: JSON.stringify({
          username,
          email,
          role
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      return await response.json()
    } catch (err) {
      error.value = (err as Error).message || 'Something went wrong'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { updateUser, loading, error }
}

// composables/useUsers.ts
import { ref } from 'vue'

export const useUsers = () => {
  const users = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      // Get token from sessionStorage
      const token = sessionStorage.getItem('authtoken')

      if (!token) {
        throw new Error('No auth token found in session')
      }

      const res = await fetch('http://localhost:3000/user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // attach token
        }
      })

      if (!res.ok) {
        throw new Error(`Error fetching users: ${res.status}`)
      }

      const data = await res.json()
      users.value = data.data || []
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch users'
      users.value = []
    } finally {
      loading.value = false
    }
  }

  return { users, loading, error, fetchUsers }
}

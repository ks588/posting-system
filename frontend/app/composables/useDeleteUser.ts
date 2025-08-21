import { ref } from 'vue'

export function useDeleteUser() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  async function deleteUser(userId: number) {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const token = sessionStorage.getItem('authtoken')
      if (!token) throw new Error('No authentication token found')

      const res = await fetch(`http://localhost:3000/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`)

      success.value = true
      return await res.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { deleteUser, loading, error, success }
}

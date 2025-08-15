// composables/useUpdatePost.ts
export function useUpdatePost() {
  /**
   * Update a post by ID using PATCH
   * @param id - post ID
   * @param title - new title
   * @param description - new description
   * @param imageUrl - new image URL
   */
  async function updatePost(
    id: number,
    title: string,
    description: string,
    imageUrl: string
  ) {
    const token = sessionStorage.getItem('authtoken')
    const res = await fetch(`http://localhost:3000/post/${id}`, {
      method: 'PATCH',    // changed from PUT to PATCH
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, imageUrl }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.message || 'Failed to update post')
    }

    const json = await res.json()
    if (!json.status) {
      throw new Error(json.message || 'API error')
    }

    return json.data
  }

  return { updatePost }
}

// composables/useUpdatePost.ts
export function useUpdatePost() {
  /**
   * Update a post by ID using PATCH
   * @param id - post ID
   * @param data - object containing title, description, optional image file
   */
  async function updatePost(
    id: number,
    data: { title: string; description: string },
    file?: File
  ) {
    const token = sessionStorage.getItem('authtoken')

    // Use FormData if a file exists
    let body: FormData | string
    let headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
    }

    if (file) {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('image', file) // key should match backend FileInterceptor('image')
      body = formData
      // Remove 'Content-Type', browser sets multipart/form-data automatically
    } else {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data)
    }

    const res = await fetch(`http://localhost:3000/post/${id}`, {
      method: 'PATCH',
      headers,
      body,
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

// composables/useDeletePost.ts
export const useDeletePost = () => {
  const deletePost = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/post/${postId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
    }
  }

  return { deletePost }
}
